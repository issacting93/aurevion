"""
Generate 10 body model variants from ANNY — single merged GLB per variant.

Muscle group IDs and smooth boundary weights are baked into vertex colors:
  R channel = (groupIndex + 1) * 20  (0 = unassigned body)
  G channel = smooth falloff weight   (255 = core, 0 = boundary)

Outputs:
  public/models/<variant_id>.glb   — single mesh, ~40-60KB each
  public/models/manifest.json      — variant list + muscle group metadata

Usage:
  source .venv/bin/activate
  python scripts/generate_bodies.py
"""

import json
from pathlib import Path

import torch
import numpy as np
import trimesh
import anny

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "models"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# ── 10 Variants ─────────────────────────────────────────────────────────────

VARIANTS = [
    {"id": "male-lean",      "label": "Male · Lean",      "gender": 0.0, "age": 0.55, "muscle": 0.95, "weight": 0.30, "height": 0.75, "proportions": 0.5},
    {"id": "male-athletic",  "label": "Male · Athletic",  "gender": 0.0, "age": 0.50, "muscle": 0.90, "weight": 0.50, "height": 0.80, "proportions": 0.5},
    {"id": "male-average",   "label": "Male · Average",   "gender": 0.0, "age": 0.55, "muscle": 0.65, "weight": 0.55, "height": 0.70, "proportions": 0.5},
    {"id": "male-stocky",    "label": "Male · Stocky",    "gender": 0.0, "age": 0.60, "muscle": 0.80, "weight": 0.75, "height": 0.65, "proportions": 0.5},
    {"id": "male-heavy",     "label": "Male · Heavy",     "gender": 0.0, "age": 0.60, "muscle": 0.50, "weight": 0.90, "height": 0.70, "proportions": 0.5},
    {"id": "female-lean",     "label": "Female · Lean",     "gender": 1.0, "age": 0.50, "muscle": 0.90, "weight": 0.30, "height": 0.70, "proportions": 0.5},
    {"id": "female-athletic", "label": "Female · Athletic", "gender": 1.0, "age": 0.50, "muscle": 0.85, "weight": 0.45, "height": 0.75, "proportions": 0.5},
    {"id": "female-average",  "label": "Female · Average",  "gender": 1.0, "age": 0.55, "muscle": 0.65, "weight": 0.55, "height": 0.65, "proportions": 0.5},
    {"id": "female-curvy",    "label": "Female · Curvy",    "gender": 1.0, "age": 0.55, "muscle": 0.60, "weight": 0.70, "height": 0.65, "proportions": 0.5},
    {"id": "female-heavy",    "label": "Female · Heavy",    "gender": 1.0, "age": 0.60, "muscle": 0.50, "weight": 0.90, "height": 0.65, "proportions": 0.5},
]

# ── 11 Muscle Groups ────────────────────────────────────────────────────────

MUSCLE_GROUPS = {
    "chest":      {"label": "Chest",      "bones": ["spine03", "spine02", "breast.L", "breast.R"], "side": "front",  "color": [220, 60, 60],   "exercises": ["Bench Press", "Push-ups", "Chest Fly", "Dips"]},
    "back":       {"label": "Back",       "bones": ["spine03", "spine02", "spine01"],              "side": "back",   "color": [60, 130, 220],  "exercises": ["Pull-ups", "Rows", "Lat Pulldown", "Deadlift"]},
    "shoulders":  {"label": "Shoulders",  "bones": ["shoulder01.L", "shoulder01.R", "clavicle.L", "clavicle.R"], "side": "any", "color": [220, 160, 40],  "exercises": ["Overhead Press", "Lateral Raise", "Front Raise", "Face Pull"]},
    "biceps":     {"label": "Biceps",     "bones": ["upperarm01.L", "upperarm01.R", "upperarm02.L", "upperarm02.R"], "side": "front", "color": [180, 60, 200],  "exercises": ["Bicep Curl", "Hammer Curl", "Chin-ups", "Preacher Curl"]},
    "triceps":    {"label": "Triceps",    "bones": ["upperarm01.L", "upperarm01.R", "upperarm02.L", "upperarm02.R"], "side": "back",  "color": [60, 200, 180],  "exercises": ["Tricep Pushdown", "Skull Crusher", "Dips", "Overhead Extension"]},
    "forearms":   {"label": "Forearms",   "bones": ["lowerarm01.L", "lowerarm01.R", "lowerarm02.L", "lowerarm02.R"], "side": "any",   "color": [200, 120, 60],  "exercises": ["Wrist Curl", "Reverse Curl", "Farmer's Walk", "Dead Hang"]},
    "abs":        {"label": "Abs",        "bones": ["spine05", "spine04"],                        "side": "front",  "color": [100, 220, 60],  "exercises": ["Crunches", "Plank", "Leg Raise", "Cable Woodchop"]},
    "glutes":     {"label": "Glutes",     "bones": ["pelvis.L", "pelvis.R"],                      "side": "back",   "color": [220, 60, 160],  "exercises": ["Hip Thrust", "Squat", "Lunges", "Glute Bridge"]},
    "quads":      {"label": "Quads",      "bones": ["upperleg01.L", "upperleg01.R", "upperleg02.L", "upperleg02.R"], "side": "front", "color": [60, 180, 220],  "exercises": ["Squat", "Leg Press", "Lunges", "Leg Extension"]},
    "hamstrings": {"label": "Hamstrings", "bones": ["upperleg01.L", "upperleg01.R", "upperleg02.L", "upperleg02.R"], "side": "back",  "color": [160, 100, 60],  "exercises": ["Romanian Deadlift", "Leg Curl", "Good Morning", "Nordic Curl"]},
    "calves":     {"label": "Calves",     "bones": ["lowerleg01.L", "lowerleg01.R", "lowerleg02.L", "lowerleg02.R"], "side": "any",   "color": [140, 180, 60],  "exercises": ["Calf Raise", "Seated Calf Raise", "Jump Rope", "Box Jump"]},
}

GROUP_NAMES = list(MUSCLE_GROUPS.keys())


def build_vertex_muscle_map(model, vertices):
    """Assign each vertex to the best-matching muscle group. Returns int array (-1 = unassigned)."""
    n_verts = vertices.shape[0]
    bone_indices = model.vertex_bone_indices.cpu().numpy()
    bone_weights = model.vertex_bone_weights.cpu().numpy()
    verts_np = vertices.cpu().numpy()
    bone_label_to_idx = {l: i for i, l in enumerate(model.bone_labels)}

    # Compute bone affinity per vertex per group
    group_candidates = {}
    for gi, key in enumerate(GROUP_NAMES):
        target = {bone_label_to_idx[b] for b in MUSCLE_GROUPS[key]["bones"] if b in bone_label_to_idx}
        if not target:
            continue
        cands = []
        for vi in range(n_verts):
            w = sum(bone_weights[vi, k] for k in range(bone_indices.shape[1]) if bone_indices[vi, k] in target)
            if w >= 0.15:
                cands.append((vi, w))
        group_candidates[gi] = cands

    # Paired centroid split for shared-bone groups
    bones_to_groups = {}
    for gi, key in enumerate(GROUP_NAMES):
        bk = tuple(sorted(MUSCLE_GROUPS[key]["bones"]))
        bones_to_groups.setdefault(bk, []).append(gi)

    scores = np.zeros((n_verts, len(GROUP_NAMES)), dtype=np.float32)

    for bk, gis in bones_to_groups.items():
        if len(gis) == 1:
            gi = gis[0]
            if gi not in group_candidates:
                continue
            side = MUSCLE_GROUPS[GROUP_NAMES[gi]]["side"]
            for vi, w in group_candidates[gi]:
                if side == "any" or (side == "front" and verts_np[vi, 1] < 0) or (side == "back" and verts_np[vi, 1] >= 0):
                    scores[vi, gi] = w
        else:
            all_vis = {vi for gi in gis if gi in group_candidates for vi, _ in group_candidates[gi]}
            if not all_vis:
                continue
            cy = np.mean([verts_np[vi, 1] for vi in all_vis])
            for gi in gis:
                if gi not in group_candidates:
                    continue
                side = MUSCLE_GROUPS[GROUP_NAMES[gi]]["side"]
                for vi, w in group_candidates[gi]:
                    if side == "any" or (side == "front" and verts_np[vi, 1] < cy) or (side == "back" and verts_np[vi, 1] >= cy):
                        scores[vi, gi] = w

    vertex_group = np.full(n_verts, -1, dtype=np.int32)
    for vi in range(n_verts):
        best = scores[vi].argmax()
        if scores[vi, best] > 0:
            vertex_group[vi] = best

    return vertex_group


def compute_vertex_weights(faces_np, vertex_group, n_verts):
    """
    Compute smooth boundary weights by distance-from-edge.
    Vertices deep inside a muscle group = 1.0, at the boundary = soft falloff.
    """
    DEPTH = 3  # how many rings inward from boundary to reach full weight

    # Build vertex→neighbor adjacency
    neighbors = [set() for _ in range(n_verts)]
    for face in faces_np:
        for i, vi in enumerate(face):
            for j, vj in enumerate(face):
                if i != j:
                    neighbors[vi].add(vj)

    weights = np.zeros(n_verts, dtype=np.float32)

    for gi in range(len(GROUP_NAMES)):
        group_verts = set(np.where(vertex_group == gi)[0].tolist())
        if not group_verts:
            continue

        # Find boundary vertices: assigned verts adjacent to a different group or unassigned
        boundary = set()
        for vi in group_verts:
            for nvi in neighbors[vi]:
                if vertex_group[nvi] != gi:
                    boundary.add(vi)
                    break

        # BFS inward from boundary to compute depth
        depth = {}
        for vi in boundary:
            depth[vi] = 0
        frontier = list(boundary)
        for d in range(1, DEPTH + 1):
            next_frontier = []
            for vi in frontier:
                for nvi in neighbors[vi]:
                    if nvi in group_verts and nvi not in depth:
                        depth[nvi] = d
                        next_frontier.append(nvi)
            frontier = next_frontier

        # Assign weights: boundary=0.15, linearly up to 1.0 at DEPTH rings in
        for vi in group_verts:
            d = depth.get(vi, DEPTH)  # verts not reached by BFS are deep interior
            weights[vi] = 0.15 + 0.85 * (d / DEPTH)

    return weights


def generate_variant(model, variant):
    """Generate a single merged GLB with muscle group data in vertex colors."""
    print(f"  Generating {variant['id']}...")

    phenotype_kwargs = {k: variant[k] for k in ("gender", "age", "muscle", "weight", "height", "proportions")}
    n_bones = len(model.bone_labels)
    pose = torch.eye(4, dtype=torch.float32).unsqueeze(0).expand(n_bones, -1, -1).unsqueeze(0)
    output = model(pose_parameters=pose, phenotype_kwargs=phenotype_kwargs)
    vertices = output["vertices"].squeeze(0)
    verts_np = vertices.cpu().numpy()
    faces_np = model.faces.cpu().numpy()
    n_verts = len(verts_np)

    # Segment vertices into muscle groups
    vertex_group = build_vertex_muscle_map(model, vertices)

    # Compute smooth boundary weights
    vertex_weight = compute_vertex_weights(faces_np, vertex_group, n_verts)

    # Encode into vertex colors: R=groupID, G=weight, B=0, A=255
    vert_colors = np.zeros((n_verts, 4), dtype=np.uint8)
    for vi in range(n_verts):
        gi = vertex_group[vi]
        w = vertex_weight[vi]
        if gi >= 0 and w > 0:
            vert_colors[vi, 0] = min(255, (gi + 1) * 20)  # R = encoded group ID
            vert_colors[vi, 1] = int(255 * w)               # G = weight
        vert_colors[vi, 3] = 255  # A

    # Triangulate quads → triangles for GLB
    tri_faces = []
    for face in faces_np:
        tri_faces.append([face[0], face[1], face[2]])
        if len(face) == 4:
            tri_faces.append([face[0], face[2], face[3]])
    tri_faces = np.array(tri_faces)

    rotation = trimesh.transformations.rotation_matrix(np.radians(-90), [1, 0, 0])
    visual = trimesh.visual.ColorVisuals(vertex_colors=vert_colors)
    mesh = trimesh.Trimesh(vertices=verts_np, faces=tri_faces, visual=visual)
    mesh.apply_transform(rotation)

    out_path = OUT_DIR / f"{variant['id']}.glb"
    mesh.export(str(out_path), file_type="glb")

    size_kb = out_path.stat().st_size / 1024
    assigned = (vertex_group >= 0).sum()
    print(f"    → {out_path.name} ({len(tri_faces)} tris, {size_kb:.0f}KB, {assigned}/{n_verts} verts assigned)")
    return out_path


def main():
    print("Loading ANNY model (default topology)...")
    model = anny.create_fullbody_model(
        topology="default",
        local_changes=False,
        extrapolate_phenotypes=True,
    )
    model = model.to(dtype=torch.float32)
    print(f"  {model.template_vertices.shape[0]} verts, {model.faces.shape[0]} tris, {len(model.bone_labels)} bones")

    manifest = {"variants": [], "muscleGroups": {}}
    for i, (key, g) in enumerate(MUSCLE_GROUPS.items()):
        manifest["muscleGroups"][key] = {
            "index": i,
            "label": g["label"],
            "color": g["color"],
            "exercises": g["exercises"],
        }

    print(f"Generating {len(VARIANTS)} variants...")
    for v in VARIANTS:
        generate_variant(model, v)
        manifest["variants"].append({
            "id": v["id"],
            "label": v["label"],
            "gender": "male" if v["gender"] < 0.5 else "female",
            "file": f"/models/{v['id']}.glb",
        })

    manifest_path = OUT_DIR / "manifest.json"
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)
    print(f"\nManifest → {manifest_path}")
    print("Done!")


if __name__ == "__main__":
    main()
