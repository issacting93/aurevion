"""
Aurevion Muscle Map
Maps exercises → muscle groups → Anny bone labels + local change targets.

Usage:
    from muscle_map import get_exercise_targets, MUSCLE_GROUPS

    targets = get_exercise_targets("bench_press")
    # {
    #     "primary": ["chest", "triceps", "front_delts"],
    #     "secondary": ["core"],
    #     "bones": ["spine03", "spine04", "clavicle.L", ...],
    #     "local_changes": {"torso-muscle-incr": 0.3, ...},
    # }
"""

from typing import TypedDict

# ---------------------------------------------------------------------------
# Muscle group → Anny bones
# Each group lists the skeleton bones whose weighted vertices define that region.
# ---------------------------------------------------------------------------

MUSCLE_GROUPS: dict[str, list[str]] = {
    # --- CHEST ---
    "chest": [
        "spine03", "spine04", "spine05",
        "clavicle.L", "clavicle.R",
    ],

    # --- BACK ---
    "upper_back": [
        "spine03", "spine04", "spine05",
        "shoulder01.L", "shoulder01.R",
    ],
    "lats": [
        "spine02", "spine03",
        "shoulder01.L", "shoulder01.R",
    ],
    "lower_back": ["spine01", "spine02"],
    "traps": [
        "neck01",
        "clavicle.L", "clavicle.R",
        "shoulder01.L", "shoulder01.R",
    ],

    # --- SHOULDERS ---
    "front_delts": ["shoulder01.L", "shoulder01.R", "clavicle.L", "clavicle.R"],
    "side_delts": ["shoulder01.L", "shoulder01.R"],
    "rear_delts": ["shoulder01.L", "shoulder01.R"],

    # --- ARMS ---
    "biceps": ["upperarm01.L", "upperarm01.R", "upperarm02.L", "upperarm02.R"],
    "triceps": ["upperarm01.L", "upperarm01.R", "upperarm02.L", "upperarm02.R"],
    "forearms": ["lowerarm01.L", "lowerarm01.R", "lowerarm02.L", "lowerarm02.R"],

    # --- CORE ---
    "abs": ["spine01", "spine02", "pelvis.L", "pelvis.R"],
    "obliques": ["spine01", "spine02", "pelvis.L", "pelvis.R"],
    "core": ["spine01", "spine02", "pelvis.L", "pelvis.R"],

    # --- GLUTES / HIPS ---
    "glutes": ["pelvis.L", "pelvis.R", "upperleg01.L", "upperleg01.R"],
    "hip_flexors": ["pelvis.L", "pelvis.R", "upperleg01.L", "upperleg01.R"],

    # --- LEGS ---
    "quads": ["upperleg01.L", "upperleg01.R", "upperleg02.L", "upperleg02.R"],
    "hamstrings": ["upperleg01.L", "upperleg01.R", "upperleg02.L", "upperleg02.R"],
    "calves": ["lowerleg01.L", "lowerleg01.R", "lowerleg02.L", "lowerleg02.R"],
    "adductors": ["upperleg01.L", "upperleg01.R"],
}

# ---------------------------------------------------------------------------
# Muscle group → Anny local_change targets for visual "pump" effect
# These are the morph targets that inflate/define each muscle region.
# Values are suggested default intensities (0.0–1.0).
# ---------------------------------------------------------------------------

MUSCLE_LOCAL_CHANGES: dict[str, dict[str, float]] = {
    "chest":       {"torso-muscle-incr": 0.4, "breast-volume-vert-up": 0.15},
    "upper_back":  {"torso-muscle-incr": 0.3},
    "lats":        {"torso-muscle-incr": 0.3, "torso-scale-horiz-incr": 0.2},
    "lower_back":  {"torso-muscle-incr": 0.2},
    "traps":       {"neck-scale-horiz-incr": 0.2, "torso-muscle-incr": 0.15},
    "front_delts": {"l-upperarm-muscle-incr": 0.3, "r-upperarm-muscle-incr": 0.3},
    "side_delts":  {"l-upperarm-muscle-incr": 0.25, "r-upperarm-muscle-incr": 0.25},
    "rear_delts":  {"l-upperarm-muscle-incr": 0.2, "r-upperarm-muscle-incr": 0.2},
    "biceps":      {"l-upperarm-muscle-incr": 0.4, "r-upperarm-muscle-incr": 0.4},
    "triceps":     {"l-upperarm-muscle-incr": 0.35, "r-upperarm-muscle-incr": 0.35},
    "forearms":    {"l-lowerarm-scale-horiz-incr": 0.2, "r-lowerarm-scale-horiz-incr": 0.2},
    "abs":         {"stomach-tone-incr": 0.4, "torso-muscle-incr": 0.2},
    "obliques":    {"stomach-tone-incr": 0.3, "torso-scale-horiz-incr": 0.15},
    "core":        {"stomach-tone-incr": 0.35, "torso-muscle-incr": 0.2},
    "glutes":      {"buttocks-volume-incr": 0.4, "hip-scale-vert-incr": 0.15},
    "hip_flexors": {"hip-scale-vert-incr": 0.2},
    "quads":       {"l-upperleg-muscle-incr": 0.4, "r-upperleg-muscle-incr": 0.4},
    "hamstrings":  {"l-upperleg-muscle-incr": 0.35, "r-upperleg-muscle-incr": 0.35},
    "calves":      {"l-lowerleg-muscle-incr": 0.4, "r-lowerleg-muscle-incr": 0.4},
    "adductors":   {"l-upperleg-scale-horiz-incr": 0.2, "r-upperleg-scale-horiz-incr": 0.2},
}

# ---------------------------------------------------------------------------
# Exercise catalog
# Each exercise declares primary and secondary muscle groups.
# ---------------------------------------------------------------------------


class ExerciseTargets(TypedDict):
    primary: list[str]
    secondary: list[str]


EXERCISES: dict[str, ExerciseTargets] = {
    # --- CHEST ---
    "bench_press":          {"primary": ["chest", "triceps", "front_delts"],      "secondary": ["core"]},
    "incline_bench_press":  {"primary": ["chest", "front_delts", "triceps"],      "secondary": ["core"]},
    "decline_bench_press":  {"primary": ["chest", "triceps"],                     "secondary": ["front_delts", "core"]},
    "dumbbell_fly":         {"primary": ["chest"],                                "secondary": ["front_delts"]},
    "cable_crossover":      {"primary": ["chest"],                                "secondary": ["front_delts"]},
    "push_up":              {"primary": ["chest", "triceps", "front_delts"],      "secondary": ["core"]},
    "dips":                 {"primary": ["chest", "triceps"],                     "secondary": ["front_delts", "core"]},

    # --- BACK ---
    "pull_up":              {"primary": ["lats", "biceps"],                       "secondary": ["upper_back", "forearms", "rear_delts"]},
    "chin_up":              {"primary": ["lats", "biceps"],                       "secondary": ["upper_back", "forearms"]},
    "barbell_row":          {"primary": ["upper_back", "lats"],                   "secondary": ["biceps", "rear_delts", "lower_back"]},
    "dumbbell_row":         {"primary": ["lats", "upper_back"],                   "secondary": ["biceps", "rear_delts"]},
    "seated_cable_row":     {"primary": ["upper_back", "lats"],                   "secondary": ["biceps", "rear_delts"]},
    "lat_pulldown":         {"primary": ["lats"],                                 "secondary": ["biceps", "upper_back"]},
    "deadlift":             {"primary": ["lower_back", "hamstrings", "glutes"],   "secondary": ["quads", "traps", "forearms", "core"]},
    "face_pull":            {"primary": ["rear_delts", "traps"],                  "secondary": ["upper_back"]},
    "back_extension":       {"primary": ["lower_back"],                           "secondary": ["glutes", "hamstrings"]},

    # --- SHOULDERS ---
    "overhead_press":       {"primary": ["front_delts", "side_delts", "triceps"], "secondary": ["traps", "core"]},
    "lateral_raise":        {"primary": ["side_delts"],                           "secondary": ["traps"]},
    "front_raise":          {"primary": ["front_delts"],                          "secondary": ["chest"]},
    "reverse_fly":          {"primary": ["rear_delts"],                           "secondary": ["upper_back", "traps"]},
    "arnold_press":         {"primary": ["front_delts", "side_delts"],            "secondary": ["triceps", "traps"]},
    "upright_row":          {"primary": ["traps", "side_delts"],                  "secondary": ["biceps", "forearms"]},
    "shrugs":               {"primary": ["traps"],                                "secondary": []},

    # --- ARMS ---
    "barbell_curl":         {"primary": ["biceps"],                               "secondary": ["forearms"]},
    "dumbbell_curl":        {"primary": ["biceps"],                               "secondary": ["forearms"]},
    "hammer_curl":          {"primary": ["biceps", "forearms"],                   "secondary": []},
    "preacher_curl":        {"primary": ["biceps"],                               "secondary": ["forearms"]},
    "tricep_pushdown":      {"primary": ["triceps"],                              "secondary": []},
    "skull_crusher":        {"primary": ["triceps"],                              "secondary": ["chest"]},
    "overhead_tricep_ext":  {"primary": ["triceps"],                              "secondary": []},
    "wrist_curl":           {"primary": ["forearms"],                             "secondary": []},

    # --- LEGS ---
    "squat":                {"primary": ["quads", "glutes"],                      "secondary": ["hamstrings", "core", "lower_back"]},
    "front_squat":          {"primary": ["quads"],                                "secondary": ["glutes", "core"]},
    "leg_press":            {"primary": ["quads", "glutes"],                      "secondary": ["hamstrings"]},
    "lunge":                {"primary": ["quads", "glutes"],                      "secondary": ["hamstrings", "core"]},
    "bulgarian_split_squat":{"primary": ["quads", "glutes"],                      "secondary": ["hamstrings", "hip_flexors"]},
    "leg_extension":        {"primary": ["quads"],                                "secondary": []},
    "leg_curl":             {"primary": ["hamstrings"],                           "secondary": ["calves"]},
    "romanian_deadlift":    {"primary": ["hamstrings", "glutes"],                 "secondary": ["lower_back"]},
    "hip_thrust":           {"primary": ["glutes"],                               "secondary": ["hamstrings", "core"]},
    "calf_raise":           {"primary": ["calves"],                               "secondary": []},
    "sumo_deadlift":        {"primary": ["glutes", "quads", "adductors"],         "secondary": ["hamstrings", "lower_back", "traps"]},

    # --- CORE ---
    "crunch":               {"primary": ["abs"],                                  "secondary": ["obliques"]},
    "plank":                {"primary": ["core"],                                 "secondary": ["front_delts"]},
    "russian_twist":        {"primary": ["obliques"],                             "secondary": ["abs"]},
    "hanging_leg_raise":    {"primary": ["abs", "hip_flexors"],                   "secondary": ["obliques", "forearms"]},
    "ab_wheel":             {"primary": ["abs"],                                  "secondary": ["core", "front_delts", "lats"]},
    "cable_woodchop":       {"primary": ["obliques"],                             "secondary": ["core", "front_delts"]},
    "dead_bug":             {"primary": ["core"],                                 "secondary": ["hip_flexors"]},

    # --- FULL BODY / COMPOUND ---
    "clean_and_press":      {"primary": ["quads", "glutes", "front_delts", "traps"], "secondary": ["hamstrings", "core", "triceps"]},
    "snatch":               {"primary": ["quads", "glutes", "traps", "upper_back"], "secondary": ["hamstrings", "front_delts", "core"]},
    "kettlebell_swing":     {"primary": ["glutes", "hamstrings"],                 "secondary": ["core", "front_delts", "quads"]},
    "burpee":               {"primary": ["chest", "quads", "core"],               "secondary": ["triceps", "front_delts", "glutes"]},
    "thruster":             {"primary": ["quads", "front_delts", "glutes"],       "secondary": ["triceps", "core"]},
    "farmers_walk":         {"primary": ["forearms", "traps"],                    "secondary": ["core", "quads", "calves"]},
}


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

class ExerciseOutput(TypedDict):
    primary: list[str]
    secondary: list[str]
    bones: list[str]
    local_changes: dict[str, float]


def get_exercise_targets(exercise: str) -> ExerciseOutput:
    """
    Returns the full Anny targeting data for a given exercise.

    Bones are deduplicated. Local changes are merged with primary muscles
    getting full intensity and secondary muscles getting 50%.
    """
    ex = EXERCISES.get(exercise)
    if ex is None:
        raise KeyError(f"Unknown exercise: {exercise!r}. Available: {sorted(EXERCISES.keys())}")

    bones: set[str] = set()
    local_changes: dict[str, float] = {}

    for group in ex["primary"]:
        bones.update(MUSCLE_GROUPS.get(group, []))
        for target, intensity in MUSCLE_LOCAL_CHANGES.get(group, {}).items():
            local_changes[target] = max(local_changes.get(target, 0.0), intensity)

    for group in ex["secondary"]:
        bones.update(MUSCLE_GROUPS.get(group, []))
        for target, intensity in MUSCLE_LOCAL_CHANGES.get(group, {}).items():
            # secondary muscles get half intensity unless primary already set higher
            local_changes[target] = max(local_changes.get(target, 0.0), intensity * 0.5)

    return {
        "primary": ex["primary"],
        "secondary": ex["secondary"],
        "bones": sorted(bones),
        "local_changes": local_changes,
    }


def get_highlight_bones(exercises: list[str]) -> set[str]:
    """Returns the union of all bones targeted by a list of exercises."""
    bones: set[str] = set()
    for ex in exercises:
        targets = get_exercise_targets(ex)
        bones.update(targets["bones"])
    return bones


def get_merged_local_changes(exercises: list[str]) -> dict[str, float]:
    """Merges local change targets across multiple exercises, taking max intensity."""
    merged: dict[str, float] = {}
    for ex in exercises:
        targets = get_exercise_targets(ex)
        for target, intensity in targets["local_changes"].items():
            merged[target] = max(merged.get(target, 0.0), intensity)
    return merged
