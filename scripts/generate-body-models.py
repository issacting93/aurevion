#!/usr/bin/env python3
"""
Generate body models at specific body fat percentages using ANNY.

Maps body fat % to ANNY's weight/muscle phenotype parameters:
  - Higher body fat → higher weight, lower muscle
  - Lower body fat → lower weight, higher muscle

Outputs GLB files to public/models/ with naming: male-bf08.glb, female-bf25.glb, etc.
"""

import os
import sys
import torch
import numpy as np

try:
    import anny
    import trimesh
except ImportError:
    print("Install dependencies: pip3 install anny trimesh")
    sys.exit(1)

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'models')

# Body fat % → (weight, muscle) parameter mapping
# weight and muscle are 0–1 normalized phenotype params
# Lower BF = more muscle definition, less weight
# Higher BF = more weight, less muscle definition
BODY_FAT_MAP = {
    # bf%:  (weight, muscle)
    8:      (0.15, 0.85),   # Very lean, highly muscular
    12:     (0.25, 0.70),   # Lean, athletic
    16:     (0.35, 0.55),   # Athletic, some softness
    20:     (0.45, 0.40),   # Average-fit
    25:     (0.55, 0.25),   # Average
    30:     (0.65, 0.15),   # Above average
    35:     (0.75, 0.10),   # Stocky
    40:     (0.85, 0.05),   # Heavy
}

GENDERS = {
    'male':   1.0,
    'female': 0.0,
}


def generate_model(model, gender_name, gender_val, bf_pct, weight, muscle):
    """Generate a single body mesh and save as GLB."""
    phenotype = {
        'gender': torch.tensor([gender_val]),
        'age': torch.tensor([0.45]),         # ~30 years old
        'muscle': torch.tensor([muscle]),
        'weight': torch.tensor([weight]),
        'height': torch.tensor([0.5]),       # average height
        'proportions': torch.tensor([0.5]),  # average proportions
    }

    result = model(phenotype_kwargs=phenotype)
    vertices = result['rest_vertices'][0].detach().numpy().astype(np.float32)
    faces = model.get_triangular_faces().numpy()

    # ANNY is Z-up, Three.js is Y-up — swap Y and Z
    vertices[:, [1, 2]] = vertices[:, [2, 1]]
    # Flip Z so model faces camera (toward -Z in Three.js)
    vertices[:, 2] *= -1
    # Center at origin (camera looks at 0,0,0)
    center = vertices.mean(axis=0)
    vertices -= center
    # Scale to match existing model size (~1.8 units tall)
    height = vertices[:, 1].max() - vertices[:, 1].min()
    scale = 1.8 / height if height > 0 else 1.0
    vertices *= scale

    mesh = trimesh.Trimesh(vertices=vertices, faces=faces, process=False)
    mesh.fix_normals()

    filename = f"{gender_name}-bf{bf_pct:02d}.glb"
    filepath = os.path.join(OUTPUT_DIR, filename)
    mesh.export(filepath, file_type='glb')
    vert_count = len(vertices)
    size_kb = os.path.getsize(filepath) / 1024
    print(f"  ✓ {filename}  ({vert_count} verts, {size_kb:.0f} KB)")
    return filename


def main():
    print("Loading ANNY model...")
    model = anny.create_fullbody_model()
    print(f"Generating {len(BODY_FAT_MAP)} body fat variants × {len(GENDERS)} genders\n")

    manifest_variants = []

    for gender_name, gender_val in GENDERS.items():
        print(f"\n{gender_name.upper()}:")
        for bf_pct, (weight, muscle) in sorted(BODY_FAT_MAP.items()):
            filename = generate_model(model, gender_name, gender_val, bf_pct, weight, muscle)
            manifest_variants.append({
                "id": f"{gender_name}-bf{bf_pct:02d}",
                "label": f"{gender_name.title()} · {bf_pct}% BF",
                "gender": gender_name,
                "bodyFat": bf_pct,
                "file": f"/models/{filename}",
            })

    # Write updated manifest
    import json
    manifest_path = os.path.join(OUTPUT_DIR, 'manifest.json')
    with open(manifest_path) as f:
        manifest = json.load(f)

    manifest['bodyFatVariants'] = manifest_variants
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)

    print(f"\n✓ Generated {len(manifest_variants)} models")
    print(f"✓ Updated {manifest_path}")


if __name__ == '__main__':
    main()
