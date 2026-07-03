"""
Aurevion Phenotype Mapper
Converts real-world user inputs into Anny's 0–1 phenotype parameter space.

Usage:
    from param_mapper import map_user_to_phenotype, estimate_body_fat

    params = map_user_to_phenotype(
        height_cm=178,
        weight_kg=82,
        age_years=27,
        gender="male",
        activity_level="active",  # sedentary | light | moderate | active | athlete
    )
    # → dict ready to pass to anny model.forward(phenotype_kwargs=params)

    bf = estimate_body_fat(
        height_cm=178, weight_kg=82, age_years=27, gender="male",
        waist_cm=84, neck_cm=38, hip_cm=None,
    )
    # → {"body_fat_pct": 15.2, "category": "fitness", ...}
"""

from __future__ import annotations
import math
from typing import Literal, TypedDict


# ---------------------------------------------------------------------------
# Reference ranges (adult population norms)
# Sources: CDC, WHO growth charts, NHANES anthropometric data
# ---------------------------------------------------------------------------

# Height ranges by gender (cm) — used for 0–1 mapping
HEIGHT_RANGE = {
    "male":   (155.0, 200.0),   # 5th–99th percentile adult male
    "female": (145.0, 185.0),   # 5th–99th percentile adult female
}

# Weight ranges by gender (kg) — BMI 16–40 mapped to 0–1
BMI_RANGE = (16.0, 40.0)

# Age mapping: Anny's age param spans newborn → old
# For a fitness app, users are typically 14–80
AGE_RANGE = (14.0, 80.0)


ActivityLevel = Literal["sedentary", "light", "moderate", "active", "athlete"]

# Activity level → estimated muscle param
# These are heuristic starting points; the visual result is what matters
ACTIVITY_TO_MUSCLE: dict[ActivityLevel, float] = {
    "sedentary": 0.25,
    "light":     0.35,
    "moderate":  0.50,
    "active":    0.65,
    "athlete":   0.85,
}


# ---------------------------------------------------------------------------
# Phenotype mapping
# ---------------------------------------------------------------------------

class PhenotypeParams(TypedDict, total=False):
    gender: float
    age: float
    muscle: float
    weight: float
    height: float
    proportions: float
    cupsize: float
    firmness: float


def _clamp(val: float, lo: float = 0.0, hi: float = 1.0) -> float:
    return max(lo, min(hi, val))


def _normalize(val: float, lo: float, hi: float) -> float:
    """Map val from [lo, hi] → [0, 1], clamped."""
    return _clamp((val - lo) / (hi - lo))


def map_user_to_phenotype(
    height_cm: float,
    weight_kg: float,
    age_years: float,
    gender: Literal["male", "female"],
    activity_level: ActivityLevel = "moderate",
) -> PhenotypeParams:
    """
    Convert real-world measurements into Anny phenotype parameters.

    Returns a dict suitable for:
        model.forward(phenotype_kwargs=params)
    or:
        model.get_phenotype_blendshape_coefficients(**params)
    """
    # Gender: 0.0 = female, 1.0 = male in Anny's parameterization
    gender_val = 1.0 if gender == "male" else 0.0

    # Height: normalize within gender-specific range
    h_lo, h_hi = HEIGHT_RANGE[gender]
    height_val = _normalize(height_cm, h_lo, h_hi)

    # Weight: derive from BMI rather than raw kg, so height is factored out
    height_m = height_cm / 100.0
    bmi = weight_kg / (height_m ** 2)
    weight_val = _normalize(bmi, BMI_RANGE[0], BMI_RANGE[1])

    # Age: map 14–80 → 0–1 (Anny's "young" is ~0.5–0.7)
    # Apply a slight curve: younger users cluster toward "young" archetype
    age_linear = _normalize(age_years, AGE_RANGE[0], AGE_RANGE[1])
    # Push toward young-adult range (0.6–0.7) for typical fitness app users
    age_val = 0.55 + age_linear * 0.45  # maps 14→0.55, 80→1.0

    # Muscle: from activity level, adjusted down if BMI is very high
    # (high BMI + sedentary = more fat, less visible muscle)
    base_muscle = ACTIVITY_TO_MUSCLE[activity_level]
    if bmi > 30:
        muscle_val = _clamp(base_muscle - 0.1)
    elif bmi < 20:
        muscle_val = _clamp(base_muscle - 0.05)
    else:
        muscle_val = base_muscle

    # Proportions: default to middle; could be refined with more inputs
    proportions_val = 0.5

    return {
        "gender": gender_val,
        "age": age_val,
        "muscle": muscle_val,
        "weight": weight_val,
        "height": height_val,
        "proportions": proportions_val,
    }


# ---------------------------------------------------------------------------
# Body fat estimation
# U.S. Navy method (Hodgdon & Beckett, 1984)
# ---------------------------------------------------------------------------

class BodyFatResult(TypedDict):
    body_fat_pct: float
    category: str
    lean_mass_kg: float
    fat_mass_kg: float
    bmi: float


# BF% category thresholds by gender
BF_CATEGORIES_MALE = [
    (6,  "essential"),
    (14, "athletic"),
    (18, "fitness"),
    (25, "average"),
    (100, "above_average"),
]

BF_CATEGORIES_FEMALE = [
    (14, "essential"),
    (21, "athletic"),
    (25, "fitness"),
    (32, "average"),
    (100, "above_average"),
]


def _bf_category(bf_pct: float, gender: str) -> str:
    categories = BF_CATEGORIES_MALE if gender == "male" else BF_CATEGORIES_FEMALE
    for threshold, label in categories:
        if bf_pct <= threshold:
            return label
    return "above_average"


def estimate_body_fat(
    height_cm: float,
    weight_kg: float,
    age_years: float,
    gender: Literal["male", "female"],
    waist_cm: float | None = None,
    neck_cm: float | None = None,
    hip_cm: float | None = None,
) -> BodyFatResult:
    """
    Estimate body fat percentage.

    If waist/neck measurements are provided, uses the U.S. Navy method.
    Otherwise falls back to the BMI-based estimation (less accurate).

    For females, hip_cm improves Navy method accuracy.
    """
    height_m = height_cm / 100.0
    bmi = weight_kg / (height_m ** 2)

    if waist_cm is not None and neck_cm is not None:
        # U.S. Navy method
        if gender == "male":
            bf_pct = (
                86.010 * math.log10(waist_cm - neck_cm)
                - 70.041 * math.log10(height_cm)
                + 36.76
            )
        else:
            hip = hip_cm if hip_cm is not None else waist_cm * 1.15  # rough fallback
            bf_pct = (
                163.205 * math.log10(waist_cm + hip - neck_cm)
                - 97.684 * math.log10(height_cm)
                - 78.387
            )
    else:
        # BMI-based fallback (Deurenberg et al., 1991)
        sex_factor = 1 if gender == "male" else 0
        bf_pct = 1.20 * bmi + 0.23 * age_years - 10.8 * sex_factor - 5.4

    bf_pct = max(3.0, min(60.0, bf_pct))
    fat_mass = weight_kg * (bf_pct / 100.0)
    lean_mass = weight_kg - fat_mass

    return {
        "body_fat_pct": round(bf_pct, 1),
        "category": _bf_category(bf_pct, gender),
        "lean_mass_kg": round(lean_mass, 1),
        "fat_mass_kg": round(fat_mass, 1),
        "bmi": round(bmi, 1),
    }


# ---------------------------------------------------------------------------
# Reverse mapping: Anny anthropometry → user-facing stats
# Used after mesh generation to extract computed measurements.
# ---------------------------------------------------------------------------

def anny_measurements_to_stats(
    anny_output: dict,
    gender: Literal["male", "female"],
    age_years: float,
) -> dict:
    """
    Takes the output of anny.Anthropometry(model)(rest_vertices) and
    converts to user-facing stats.

    anny_output keys: height, waist_circumference, volume, mass, bmi
    All are torch tensors — we call .item() on scalars.
    """
    height_m = float(anny_output["height"])
    waist_m = float(anny_output["waist_circumference"])
    mass_kg = float(anny_output["mass"])
    bmi = float(anny_output["bmi"])

    height_cm = height_m * 100.0
    waist_cm = waist_m * 100.0

    # Use BMI-based BF% since we don't have neck measurement from the mesh
    sex_factor = 1 if gender == "male" else 0
    bf_pct = 1.20 * bmi + 0.23 * age_years - 10.8 * sex_factor - 5.4
    bf_pct = max(3.0, min(60.0, bf_pct))

    return {
        "height_cm": round(height_cm, 1),
        "waist_cm": round(waist_cm, 1),
        "weight_kg": round(mass_kg, 1),
        "bmi": round(bmi, 1),
        "body_fat_pct": round(bf_pct, 1),
        "bf_category": _bf_category(bf_pct, gender),
    }
