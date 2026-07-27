"""
predict.py
----------
Runs the trained GeoMiner AI models against a survey and assembles the full
prediction payload the frontend needs: mineral probabilities, deposit
geometry, uncertainty, economics, drill-site recommendations, a 2D
cross-section, and a 3D subsurface layer model.

Feature extraction note
------------------------
A real pipeline would derive `resistivity`, `magnetic`, `seismic`, `gravity`,
etc. from actual SEG-Y / MT inversion / potential-field processing. That
processing is out of scope here, so `derive_features()` deterministically
derives a feature vector from the survey's id + GPS coordinates (same
survey -> same features every time, different surveys -> different results).
Swap `derive_features()` for a real geophysics pipeline later; nothing else
in this file needs to change.
"""

import os
import hashlib
import joblib
import numpy as np

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

_clf = None
_reg = None
_label_encoder = None
_feature_order = None
_regression_targets = None


def _load_models():
    global _clf, _reg, _label_encoder, _feature_order, _regression_targets
    if _clf is None:
        _clf = joblib.load(os.path.join(MODELS_DIR, "mineral_classifier.joblib"))
        _reg = joblib.load(os.path.join(MODELS_DIR, "target_regressor.joblib"))
        _label_encoder = joblib.load(os.path.join(MODELS_DIR, "label_encoder.joblib"))
        _feature_order = joblib.load(os.path.join(MODELS_DIR, "feature_order.joblib"))
        _regression_targets = joblib.load(os.path.join(MODELS_DIR, "regression_targets.joblib"))
    return _clf, _reg, _label_encoder, _feature_order, _regression_targets


def _seeded_rng(seed_str: str) -> np.random.Generator:
    h = hashlib.sha256(seed_str.encode()).hexdigest()
    seed = int(h[:8], 16)
    return np.random.default_rng(seed)


def derive_features(survey_id: str, lat: float, lon: float) -> dict:
    rng = _seeded_rng(f"{survey_id}:{lat:.4f}:{lon:.4f}")
    return {
        "resistivity": float(np.clip(rng.normal(0.5, 0.2), 0, 1)),
        "magnetic": float(np.clip(rng.normal(0.5, 0.2), 0, 1)),
        "seismic": float(np.clip(rng.normal(0.5, 0.2), 0, 1)),
        "gravity": float(np.clip(rng.normal(0.5, 0.2), 0, 1)),
        "fault_proximity": float(np.clip(rng.normal(0.5, 0.2), 0, 1)),
        "lithology_code": int(rng.integers(1, 9)),
        "elevation_m": float(rng.normal(650, 220)),
        "borehole_grade_hint": float(np.clip(rng.normal(0.4, 0.25), 0, 1)),
    }


def predict_single(survey_id: str, lat: float, lon: float) -> dict:
    clf, reg, le, feature_order, targets = _load_models()
    feats = derive_features(survey_id, lat, lon)
    x = np.array([[feats[f] for f in feature_order]])

    class_probs = clf.predict_proba(x)[0]
    top_idx = np.argsort(class_probs)[::-1]
    mineral_ranking = [
        {"mineral": le.inverse_transform([i])[0], "probability": round(float(class_probs[i]), 3)}
        for i in top_idx
    ]
    top_mineral = mineral_ranking[0]["mineral"]

    reg_out = reg.predict(x)[0]
    reg_dict = {t: float(v) for t, v in zip(targets, reg_out)}

    confidence = round(float(class_probs[top_idx[0]]) * (1 - reg_dict["uncertainty"] * 0.4), 3)

    return {
        "mineral_type": top_mineral,
        "mineral_probability": round(reg_dict["mineral_probability"], 3),
        "mineral_ranking": mineral_ranking,
        "deposit_depth_m": round(reg_dict["depth_m"], 1),
        "lateral_extent_m": round(reg_dict["lateral_extent_m"], 1),
        "ore_grade_pct": round(reg_dict["ore_grade_pct"], 2),
        "confidence_score": max(0.05, min(0.99, confidence)),
        "uncertainty_score": round(reg_dict["uncertainty"], 3),
        "deposit_size_kt": round(reg_dict["deposit_size_kt"], 1),
        "features_used": feats,
    }


MINERAL_PRICE_USD_PER_TON = {
    "Copper": 8500, "Lithium": 14000, "Iron Ore": 110, "Gold": 65000,
    "Nickel": 17000, "Silver": 780000, "Zinc": 2600,
}
MINERAL_COLOR = {
    "Copper": "#B87333", "Lithium": "#A78BFA", "Iron Ore": "#94A3B8",
    "Gold": "#FBBF24", "Nickel": "#60A5FA", "Silver": "#E5E7EB", "Zinc": "#38BDF8",
}


def economic_analysis(prediction: dict) -> dict:
    mineral = prediction["mineral_type"]
    price = MINERAL_PRICE_USD_PER_TON.get(mineral, 5000)
    deposit_size_kt = prediction["deposit_size_kt"]
    grade = prediction["ore_grade_pct"] / 100
    depth = prediction["deposit_depth_m"]

    recoverable_tons = deposit_size_kt * 1000 * grade * 0.85
    revenue = recoverable_tons * price

    depth_cost_factor = 1 + (depth / 500)
    mining_cost = revenue * 0.55 * depth_cost_factor
    profit = revenue - mining_cost
    roi_pct = (profit / mining_cost * 100) if mining_cost > 0 else 0
    break_even_tons = mining_cost / price if price > 0 else 0

    investment_score = round(
        min(100, max(0, (prediction["confidence_score"] * 50) + (min(roi_pct, 100) * 0.5))), 1
    )
    risk_score = round(min(100, max(0, prediction["uncertainty_score"] * 100 + (depth / 900) * 20)), 1)

    return {
        "estimated_mining_cost_usd": round(mining_cost, 0),
        "expected_revenue_usd": round(revenue, 0),
        "profit_usd": round(profit, 0),
        "roi_pct": round(roi_pct, 1),
        "break_even_tons": round(break_even_tons, 1),
        "investment_score": investment_score,
        "risk_score": risk_score,
        "unit_price_usd_per_ton": price,
    }


def generate_drill_sites(survey_id: str, base_lat: float, base_lon: float, n: int = 10) -> list:
    rng = _seeded_rng(f"drill:{survey_id}:{base_lat}:{base_lon}")
    sites = []
    for i in range(n):
        d_lat = base_lat + rng.uniform(-0.045, 0.045)
        d_lon = base_lon + rng.uniform(-0.045, 0.045)
        pred = predict_single(f"{survey_id}-site{i}", d_lat, d_lon)
        econ = economic_analysis(pred)
        sites.append({
            "rank": 0,
            "latitude": round(d_lat, 5),
            "longitude": round(d_lon, 5),
            "mineral_type": pred["mineral_type"],
            "probability": pred["mineral_probability"],
            "estimated_depth_m": pred["deposit_depth_m"],
            "risk": "Low" if econ["risk_score"] < 33 else ("Medium" if econ["risk_score"] < 66 else "High"),
            "confidence": pred["confidence_score"],
            "estimated_cost_usd": econ["estimated_mining_cost_usd"],
            "expected_revenue_usd": econ["expected_revenue_usd"],
            "roi_pct": econ["roi_pct"],
        })
    sites.sort(key=lambda s: (s["probability"] * 0.5 + s["confidence"] * 0.3 + min(s["roi_pct"], 200) / 200 * 0.2), reverse=True)
    for i, s in enumerate(sites):
        s["rank"] = i + 1
    return sites


def generate_cross_section(prediction: dict, seed: str) -> dict:
    """2D geological cross-section: layered rock strata + mineral body + fault + confidence envelope."""
    rng = _seeded_rng(f"xsec:{seed}")
    depth = prediction["deposit_depth_m"]
    extent = prediction["lateral_extent_m"]

    layers = []
    cum_depth = 0
    layer_names = ["Topsoil", "Weathered Rock", "Sedimentary Layer", "Bedrock", "Host Rock"]
    for name in layer_names:
        thickness = max(10, rng.uniform(20, 90))
        layers.append({"name": name, "top_m": round(cum_depth, 1), "bottom_m": round(cum_depth + thickness, 1)})
        cum_depth += thickness
        if cum_depth > depth + 100:
            break

    fault_x_pct = round(float(rng.uniform(0.15, 0.85)), 2)

    return {
        "layers": layers,
        "mineral_body": {
            "center_depth_m": depth,
            "top_m": round(max(0, depth - extent * 0.25), 1),
            "bottom_m": round(depth + extent * 0.25, 1),
            "lateral_extent_m": extent,
            "mineral": prediction["mineral_type"],
            "color": MINERAL_COLOR.get(prediction["mineral_type"], "#22C55E"),
        },
        "fault_line": {"x_position_pct": fault_x_pct, "dip_degrees": round(float(rng.uniform(45, 85)), 1)},
        "recommended_boreholes_x_pct": [round(float(v), 2) for v in sorted(rng.uniform(0.1, 0.9, 3))],
        "confidence_envelope_m": round(extent * (0.15 + prediction["uncertainty_score"] * 0.5), 1),
    }


def generate_3d_model(prediction: dict, seed: str) -> dict:
    """Layer + mineral-body geometry description consumed by the React Three Fiber scene."""
    rng = _seeded_rng(f"3d:{seed}")
    depth = prediction["deposit_depth_m"]
    extent = prediction["lateral_extent_m"]

    return {
        "bounds": {"width": 400, "depth": 400, "height": round(min(depth * 1.6, 900), 1)},
        "rock_layers": [
            {"name": "Topsoil", "y_top": 0, "y_bottom": -15, "color": "#4B5563"},
            {"name": "Weathered Rock", "y_top": -15, "y_bottom": -60, "color": "#6B7280"},
            {"name": "Sedimentary Layer", "y_top": -60, "y_bottom": -140, "color": "#78716C"},
            {"name": "Bedrock", "y_top": -140, "y_bottom": round(-min(depth * 1.6, 900), 1), "color": "#374151"},
        ],
        "mineral_body": {
            "mineral": prediction["mineral_type"],
            "color": MINERAL_COLOR.get(prediction["mineral_type"], "#22C55E"),
            "center": {"x": 0, "y": -depth, "z": 0},
            "radius": round(max(15, extent / 6), 1),
            "height": round(max(20, extent / 4), 1),
        },
        "fault_lines": [
            {"x": round(float(rng.uniform(-150, 150)), 1), "angle_deg": round(float(rng.uniform(45, 85)), 1)}
            for _ in range(int(rng.integers(1, 3)))
        ],
        "water_table_y": round(-float(rng.uniform(30, 90)), 1),
    }


def generate_uncertainty_maps(survey_id: str, base_lat: float, base_lon: float, grid_size: int = 12) -> dict:
    rng = _seeded_rng(f"uncertainty:{survey_id}")
    confidence_map = np.clip(rng.normal(0.6, 0.18, (grid_size, grid_size)), 0.05, 0.98)
    probability_map = np.clip(confidence_map + rng.normal(0, 0.1, (grid_size, grid_size)), 0.02, 0.97)
    risk_map = np.clip(1 - confidence_map + rng.normal(0, 0.08, (grid_size, grid_size)), 0.02, 0.95)

    return {
        "grid_size": grid_size,
        "confidence_map": np.round(confidence_map, 3).tolist(),
        "probability_map": np.round(probability_map, 3).tolist(),
        "risk_map": np.round(risk_map, 3).tolist(),
    }


CHATBOT_KB = {
    "resistivity": "Resistivity measures how strongly a rock or ore body resists electrical current. Sulfide ore bodies (copper, nickel, zinc) are often more conductive, so they show up as low-resistivity anomalies in MT surveys.",
    "confidence score": "The confidence score blends the model's classification certainty with the uncertainty score for the deposit's geometry. Higher is better -- above 0.75 is generally considered a strong target.",
    "uncertainty": "The uncertainty score reflects how much the deposit depth, extent, and grade could vary from the point estimate, driven by signal noise and distance from calibration data.",
    "ore grade": "Ore grade is the concentration of the target mineral within the host rock, shown as a percentage. Higher grade means more mineral per ton mined, which usually improves ROI.",
    "roi": "ROI (Return on Investment) here is calculated as (expected revenue - mining cost) / mining cost, expressed as a percentage. It's a quick way to compare drill-site priority.",
    "fault": "Fault lines are fractures in the rock where displacement has occurred. Many ore bodies, especially gold and copper, form along or near faults because they act as pathways for mineral-rich fluids.",
    "seg-y": "SEG-Y is the standard file format for storing seismic reflection data, used to image subsurface rock layers and structures.",
    "magnetotelluric": "Magnetotelluric (MT) surveys measure natural electromagnetic fields to infer subsurface electrical resistivity, useful for detecting conductive ore bodies at depth.",
}


def chatbot_reply(message: str, context: dict | None = None) -> str:
    msg = message.lower()
    for key, ans in CHATBOT_KB.items():
        if key in msg:
            return ans
    if "drill" in msg and "site" in msg:
        return "Drill sites are ranked by a blend of mineral probability, model confidence, and projected ROI. Rank 1 is the strongest recommended target."
    if "depth" in msg:
        return "Deposit depth is the model's estimated distance from the surface to the center of the mineral body, in meters."
    if "economic" in msg or "viability" in msg:
        return "Economic viability weighs expected revenue against estimated mining cost, factoring in depth (deeper deposits cost more to extract) to produce an ROI and investment score."
    if context and "mineral_type" in context:
        return f"This survey's top prediction is {context['mineral_type']} with a probability of {context.get('mineral_probability', 'n/a')}. Ask me about depth, grade, confidence, or drill sites for more detail."
    return "I can help explain predictions, geological terms (resistivity, faults, SEG-Y, MT surveys), drill-site ranking, or economic scores -- what would you like to know?"
