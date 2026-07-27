"""
train.py
--------
Trains the GeoMiner AI model suite:

1. RandomForestClassifier   -> mineral type
2. RandomForestRegressor    -> mineral_probability, depth_m, lateral_extent_m,
                                ore_grade_pct, uncertainty, deposit_size_kt

Models are saved to ai/models/ as .joblib files and loaded by predict.py at
request time. Re-run this script any time datasets/generate_synthetic.py
changes, or swap it out entirely once real labeled survey data is available
-- predict.py does not need to change, only the artifacts in ai/models/.
"""

import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, mean_absolute_error

from datasets.generate_synthetic import generate

FEATURES = [
    "resistivity", "magnetic", "seismic", "gravity",
    "fault_proximity", "lithology_code", "elevation_m", "borehole_grade_hint",
]

REGRESSION_TARGETS = [
    "mineral_probability", "depth_m", "lateral_extent_m",
    "ore_grade_pct", "uncertainty", "deposit_size_kt",
]

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")


def main():
    os.makedirs(MODELS_DIR, exist_ok=True)
    df = generate()

    X = df[FEATURES].values
    y_class = df["mineral"].values
    y_reg = df[REGRESSION_TARGETS].values

    le = LabelEncoder()
    y_class_enc = le.fit_transform(y_class)

    X_train, X_test, yc_train, yc_test, yr_train, yr_test = train_test_split(
        X, y_class_enc, y_reg, test_size=0.2, random_state=42
    )

    clf = RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42)
    clf.fit(X_train, yc_train)
    acc = accuracy_score(yc_test, clf.predict(X_test))
    print(f"Mineral classifier accuracy: {acc:.3f}")

    reg = RandomForestRegressor(n_estimators=250, max_depth=14, random_state=42)
    reg.fit(X_train, yr_train)
    mae = mean_absolute_error(yr_test, reg.predict(X_test), multioutput="raw_values")
    for name, m in zip(REGRESSION_TARGETS, mae):
        print(f"  MAE[{name}] = {m:.3f}")

    joblib.dump(clf, os.path.join(MODELS_DIR, "mineral_classifier.joblib"))
    joblib.dump(reg, os.path.join(MODELS_DIR, "target_regressor.joblib"))
    joblib.dump(le, os.path.join(MODELS_DIR, "label_encoder.joblib"))
    joblib.dump(FEATURES, os.path.join(MODELS_DIR, "feature_order.joblib"))
    joblib.dump(REGRESSION_TARGETS, os.path.join(MODELS_DIR, "regression_targets.joblib"))

    print(f"Saved models to {MODELS_DIR}")


if __name__ == "__main__":
    main()
