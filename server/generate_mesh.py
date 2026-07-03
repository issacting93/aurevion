"""
Aurevion Mesh Generator
Generates personalized 3D body meshes using Anny, exports GLB with
optional muscle-group vertex coloring.

Usage (CLI):
    python generate_mesh.py \
        --height 178 --weight 82 --age 27 --gender male \
        --activity active \
        --highlight squat,bench_press \
        --output avatar.glb

Usage (Python):
    from generate_mesh import generate_avatar

    result = generate_avatar(
        height_cm=178, weight_kg=82, age_years=27,
        gender="male", activity_level="active",
        highlight_exercises=["squat", "bench_press"],
        output_path="avatar.glb",
    )
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np
import torch
import trimesh

import anny

from muscle_map import (
    MUSCLE_GROUPS,
    get_exercise_targets,
    get_highlight_bones,
    get_merged_local_changes,
)
from param_mapper import (
    PhenotypeParams,
    map_user_to_phenotype,
    estimate_body_fat,
    anny_measurements_to_stats,
)


# ---------------------------------------------------------------------------
# Highlight colors (RGBA 0–255)
# ---------------------------------------------------------------------------
COLOR_PRIMARY   = np.array([255, 179, 0, 200], dtype=np.uint8)    # Aurevion gold
COLOR_SECONDARY = np.array([255, 220, 120, 140], dtype=np.uint8)  # softer gold
COLOR_DEFAULT   = np.array([180, 180, 185, 255], dtype=np.uint8)  # neutral skin-ish


# ---------------------------------------------------------------------------
# Core generation
# ---------------------------------------------------------------------------

def _build_model(device: str = "cpu") -> anny.RiggedModelWithPhenotypeParameters:
    """Create the Anny full-body model."""
    model = anny.create_fullbody_model(
        rig="default",
        topology="default",
        local_changes=True,  # enable muscle/fat morphs
    )
    return model.to(device)


def _get_vertex_colors(
    model,
    highlight_exercises: list[str] | None,
    n_vertices: int,
) -> np.ndarray:
    """
    Build per-vertex RGBA color array. Vertices belonging to highlighted
    muscle groups get colored; everything else gets the default.
    """
    colors = np.tile(COLOR_DEFAULT, (n_vertices, 1))

    if not highlight_exercises:
        return colors

    # Collect primary and secondary bone sets
    primary_bones: set[str] = set()
    secondary_bones: set[str] = set()

    for ex_name in highlight_exercises:
        targets = get_exercise_targets(ex_name)
        for group in targets["primary"]:
            primary_bones.update(MUSCLE_GROUPS.get(group, []))
        for group in targets["secondary"]:
            secondary_bones.update(MUSCLE_GROUPS.get(group, []))

    # Remove overlap — primary wins
    secondary_bones -= primary_bones

    # Get skinning weights from model
    # v_weights: [V, 8], v_indices: [V, 8]
    v_weights = model.vertex_bone_weights.cpu().numpy()
    v_indices = model.vertex_bone_indices.cpu().numpy()
    bone_labels = model.bone_labels

    bone_to_idx = {label: i for i, label in enumerate(bone_labels)}

    # Mark primary vertices
    for bone in primary_bones:
        idx = bone_to_idx.get(bone)
        if idx is None:
            continue
        mask = np.any((v_indices == idx) & (v_weights > 0.15), axis=1)
        colors[mask] = COLOR_PRIMARY

    # Mark secondary vertices (only where not already primary)
    for bone in secondary_bones:
        idx = bone_to_idx.get(bone)
        if idx is None:
            continue
        mask = np.any((v_indices == idx) & (v_weights > 0.15), axis=1) & np.all(colors != COLOR_PRIMARY, axis=1)
        colors[mask] = COLOR_SECONDARY

    return colors


def generate_avatar(
    height_cm: float,
    weight_kg: float,
    age_years: float,
    gender: str,
    activity_level: str = "moderate",
    highlight_exercises: list[str] | None = None,
    output_path: str = "avatar.glb",
    device: str = "cpu",
) -> dict:
    """
    Full pipeline: user params → Anny mesh → GLB file + stats.

    Returns a dict with body stats and the output file path.
    """
    # 1. Map user inputs to Anny phenotype
    phenotype: PhenotypeParams = map_user_to_phenotype(
        height_cm=height_cm,
        weight_kg=weight_kg,
        age_years=age_years,
        gender=gender,
        activity_level=activity_level,
    )

    # 2. Merge local changes from highlighted exercises (visual pump)
    local_changes: dict[str, float] = {}
    if highlight_exercises:
        local_changes = get_merged_local_changes(highlight_exercises)

    print(f"Phenotype params: {phenotype}")
    print(f"Local changes: {local_changes}")

    # 3. Build model and generate mesh
    model = _build_model(device)

    with torch.no_grad():
        output = model(
            phenotype_kwargs=phenotype,
            local_changes_kwargs=local_changes,
            return_bone_ends=True,
        )

    vertices = output["vertices"][0].cpu().numpy()       # [V, 3]
    rest_vertices = output["rest_vertices"][0].cpu().numpy()   # [V, 3]
    faces = model.faces.numpy()                  # [F, 3]

    # 4. Compute anthropometry
    # Use Anny mesh only for measurements the user didn't provide (waist).
    # User's actual inputs are ground truth for height/weight/BMI.
    anthro = anny.Anthropometry(model)
    rest_verts_tensor = output["rest_vertices"]  # [1, V, 3]
    measurements = anthro(rest_verts_tensor)

    mesh_waist_cm = float(measurements["waist_circumference"][0].item()) * 100.0

    height_m = height_cm / 100.0
    bmi = weight_kg / (height_m ** 2)

    bf = estimate_body_fat(
        height_cm=height_cm,
        weight_kg=weight_kg,
        age_years=age_years,
        gender=gender,
    )

    stats = {
        "height_cm": round(height_cm, 1),
        "weight_kg": round(weight_kg, 1),
        "bmi": round(bmi, 1),
        "waist_cm_estimated": round(mesh_waist_cm, 1),
        "body_fat_pct": bf["body_fat_pct"],
        "bf_category": bf["category"],
        "lean_mass_kg": bf["lean_mass_kg"],
        "fat_mass_kg": bf["fat_mass_kg"],
    }

    # 5. Build vertex colors for muscle highlights
    n_vertices = vertices.shape[0]
    vertex_colors = _get_vertex_colors(model, highlight_exercises, n_vertices)

    # 6. Export as GLB via trimesh
    mesh = trimesh.Trimesh(
        vertices=vertices,
        faces=faces,
        vertex_colors=vertex_colors,
        process=False,
    )

    out_path = Path(output_path)
    mesh.export(str(out_path), file_type="glb")
    print(f"Exported mesh to {out_path} ({n_vertices} vertices, {faces.shape[0]} faces)")

    # 7. Also save stats as JSON sidecar
    stats_path = out_path.with_suffix(".json")
    with open(stats_path, "w") as f:
        json.dump(stats, f, indent=2)
    print(f"Stats written to {stats_path}")

    return {
        "mesh_path": str(out_path),
        "stats_path": str(stats_path),
        "stats": stats,
        "phenotype": phenotype,
    }


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Generate Aurevion avatar mesh")
    parser.add_argument("--height", type=float, required=True, help="Height in cm")
    parser.add_argument("--weight", type=float, required=True, help="Weight in kg")
    parser.add_argument("--age", type=float, required=True, help="Age in years")
    parser.add_argument("--gender", choices=["male", "female"], required=True)
    parser.add_argument("--activity", default="moderate",
                        choices=["sedentary", "light", "moderate", "active", "athlete"])
    parser.add_argument("--highlight", type=str, default="",
                        help="Comma-separated exercise names to highlight")
    parser.add_argument("--output", type=str, default="avatar.glb")
    parser.add_argument("--device", type=str, default="cpu", help="torch device")

    args = parser.parse_args()

    exercises = [e.strip() for e in args.highlight.split(",") if e.strip()] or None

    result = generate_avatar(
        height_cm=args.height,
        weight_kg=args.weight,
        age_years=args.age,
        gender=args.gender,
        activity_level=args.activity,
        highlight_exercises=exercises,
        output_path=args.output,
        device=args.device,
    )

    print("\n--- Body Stats ---")
    for k, v in result["stats"].items():
        print(f"  {k}: {v}")


if __name__ == "__main__":
    main()
