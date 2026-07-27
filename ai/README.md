# GeoMiner AI - AI Microservice

FastAPI microservice that trains and serves the mineral-prediction models.

## Setup
```bash
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python train.py          # trains + saves models to ai/models/
uvicorn app:app --reload --port 8000
```

## Endpoints
- `GET  /health` - service + model status
- `POST /predict` - full prediction payload (mineral, geometry, economics, drill sites, 2D/3D viz data, uncertainty)
- `POST /chat` - GeoMiner AI Assistant chatbot

See `predict.py` for the swap point where synthetic feature derivation
would be replaced with real geophysical inversion output.
