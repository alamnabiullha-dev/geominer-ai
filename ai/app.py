"""
app.py
------
GeoMiner AI microservice. Exposes mineral prediction, drill-site
recommendation, 2D/3D visualization data, uncertainty maps, and the AI
assistant chatbot to the Node/Express backend.

Run:
    uvicorn app:app --reload --port 8000

Ensure models are trained first:
    python train.py
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import predict as predict_mod

app = FastAPI(
    title="GeoMiner AI Service",
    description="AI microservice for mineral deposit prediction, drill-site recommendation, and geological visualization data.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to the Express server's origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    survey_id: str = Field(..., description="Unique survey identifier from MongoDB")
    latitude: float
    longitude: float
    drill_sites: int = 10


class ChatRequest(BaseModel):
    message: str
    context: dict | None = None


def _models_ready() -> bool:
    return os.path.exists(os.path.join(predict_mod.MODELS_DIR, "mineral_classifier.joblib"))


@app.on_event("startup")
def startup_check():
    if not _models_ready():
        print("WARNING: models not found in ai/models/. Run `python train.py` before serving predictions.")


@app.get("/health")
def health():
    return {"status": "ok", "models_ready": _models_ready()}


@app.post("/predict")
def predict(req: PredictRequest):
    if not _models_ready():
        raise HTTPException(status_code=503, detail="Models not trained yet. Run train.py.")

    try:
        prediction = predict_mod.predict_single(req.survey_id, req.latitude, req.longitude)
        economics = predict_mod.economic_analysis(prediction)
        drill_sites = predict_mod.generate_drill_sites(req.survey_id, req.latitude, req.longitude, req.drill_sites)
        cross_section = predict_mod.generate_cross_section(prediction, req.survey_id)
        model_3d = predict_mod.generate_3d_model(prediction, req.survey_id)
        uncertainty = predict_mod.generate_uncertainty_maps(req.survey_id, req.latitude, req.longitude)

        return {
            "prediction": prediction,
            "economics": economics,
            "drill_sites": drill_sites,
            "cross_section_2d": cross_section,
            "model_3d": model_3d,
            "uncertainty_analysis": uncertainty,
        }
    except Exception as e:  # pragma: no cover
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat")
def chat(req: ChatRequest):
    reply = predict_mod.chatbot_reply(req.message, req.context)
    return {"reply": reply}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
