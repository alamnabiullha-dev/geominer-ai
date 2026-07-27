"""
generate_synthetic.py
----------------------
Generates a synthetic but geologically-plausible training dataset for the
GeoMiner AI mineral-prediction models.

Real geophysical inversion (SEG-Y processing, MT resistivity inversion, etc.)
is out of scope for a hackathon build, so we instead synthesize feature
vectors that *behave* like the outputs of a geophysical processing
pipeline (resistivity, magnetic anomaly, seismic reflectivity, gravity
anomaly, lithology codes, fault proximity, elevation) and derive labels
from geologically-motivated rules + noise. This keeps the ML pipeline
(train.py / predict.py) completely real and swappable for true inversion
outputs later -- only this generator would need to be replaced.
"""

import numpy as np
import pandas as pd
import os

RANDOM_SEED = 42
N_SAMPLES = 6000

MINERALS = ["Copper", "Lithium", "Iron Ore", "Gold", "Nickel", "Silver", "Zinc"]

# Each mineral has a "signature" in feature space (mean values it tends to
# cluster around) so the classifier has real structure to learn instead of
# pure noise.
MINERAL_SIGNATURES = {
    "Copper":   dict(resistivity=0.35, magnetic=0.55, seismic=0.40, gravity=0.50, fault_prox=0.65),
    "Lithium":  dict(resistivity=0.75, magnetic=0.25, seismic=0.30, gravity=0.30, fault_prox=0.35),
    "Iron Ore": dict(resistivity=0.20, magnetic=0.85, seismic=0.55, gravity=0.70, fault_prox=0.30),
    "Gold":     dict(resistivity=0.45, magnetic=0.40, seismic=0.35, gravity=0.35, fault_prox=0.80),
    "Nickel":   dict(resistivity=0.30, magnetic=0.60, seismic=0.45, gravity=0.55, fault_prox=0.45),
    "Silver":   dict(resistivity=0.50, magnetic=0.35, seismic=0.30, gravity=0.30, fault_prox=0.60),
    "Zinc":     dict(resistivity=0.40, magnetic=0.45, seismic=0.35, gravity=0.40, fault_prox=0.50),
}


def generate(n_samples: int = N_SAMPLES, seed: int = RANDOM_SEED) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    rows = []

    for _ in range(n_samples):
        mineral = rng.choice(MINERALS)
        sig = MINERAL_SIGNATURES[mineral]
        noise = 0.12

        resistivity = np.clip(rng.normal(sig["resistivity"], noise), 0, 1)
        magnetic = np.clip(rng.normal(sig["magnetic"], noise), 0, 1)
        seismic = np.clip(rng.normal(sig["seismic"], noise), 0, 1)
        gravity = np.clip(rng.normal(sig["gravity"], noise), 0, 1)
        fault_proximity = np.clip(rng.normal(sig["fault_prox"], noise), 0, 1)
        lithology_code = rng.integers(1, 9)
        elevation_m = rng.normal(650, 220)
        borehole_grade_hint = np.clip(rng.normal(0.4, 0.25), 0, 1)

        # Composite signal strength drives probability + confidence
        signal_strength = np.mean([resistivity, magnetic, seismic, gravity, fault_proximity])
        mineral_probability = float(np.clip(rng.normal(signal_strength, 0.08), 0.05, 0.99))

        depth_m = float(np.clip(rng.normal(120 + (1 - resistivity) * 380, 60), 20, 900))
        lateral_extent_m = float(np.clip(rng.normal(150 + signal_strength * 500, 90), 30, 1200))
        ore_grade_pct = float(np.clip(rng.normal(0.5 + borehole_grade_hint * 3.5, 0.6), 0.05, 6.5))
        uncertainty = float(np.clip(1 - mineral_probability + rng.normal(0, 0.08), 0.03, 0.85))
        deposit_size_kt = float(np.clip(
            (lateral_extent_m * depth_m * ore_grade_pct) / 400 * rng.uniform(0.6, 1.4), 5, 50000
        ))

        rows.append(dict(
            resistivity=resistivity,
            magnetic=magnetic,
            seismic=seismic,
            gravity=gravity,
            fault_proximity=fault_proximity,
            lithology_code=lithology_code,
            elevation_m=elevation_m,
            borehole_grade_hint=borehole_grade_hint,
            mineral=mineral,
            mineral_probability=mineral_probability,
            depth_m=depth_m,
            lateral_extent_m=lateral_extent_m,
            ore_grade_pct=ore_grade_pct,
            uncertainty=uncertainty,
            deposit_size_kt=deposit_size_kt,
        ))

    return pd.DataFrame(rows)


if __name__ == "__main__":
    df = generate()
    out_path = os.path.join(os.path.dirname(__file__), "synthetic_survey_data.csv")
    df.to_csv(out_path, index=False)
    print(f"Wrote {len(df)} rows to {out_path}")
