# GeoMiner AI

AI-powered mineral exploration platform. Upload geophysical survey data,
run an AI prediction pipeline, and get back mineral probability, deposit
geometry, a ranked drill-site plan, economic viability, and interactive
2D/3D visualizations — with downloadable PDF/CSV reports.

**Stack:** React (Vite) + Tailwind · Node/Express · MongoDB · Python FastAPI + scikit-learn.

```
client/   React frontend (Vite, Tailwind, Three.js, Leaflet, Recharts)
server/   Express/MongoDB backend (auth, surveys, predictions, reports)
ai/       FastAPI AI microservice (mineral prediction models)
```

## Quick start (all three services)

You'll need Node 18+, Python 3.10+, and a MongoDB instance (local or Atlas).

### 1. AI service
```bash
cd ai
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python train.py                    # trains models, saves to ai/models/
uvicorn app:app --reload --port 8000
```

### 2. Backend
```bash
cd server
cp .env.example .env               # set MONGO_URI and JWT_SECRET
npm install
npm run dev                        # http://localhost:5000
```

### 3. Frontend
```bash
cd client
npm install
npm run dev                        # http://localhost:5173
```

Open http://localhost:5173, register an account, upload a survey (any
CSV/Excel/SEG-Y/GeoJSON file works — see note below), and run a prediction.

## Important notes

- **AI predictions are demonstration-grade.** Real geophysical inversion
  (SEG-Y processing, MT resistivity inversion, potential-field modeling)
  is out of scope for this build. `ai/datasets/generate_synthetic.py`
  generates geologically-plausible synthetic training data, and
  `ai/predict.py::derive_features()` deterministically derives a feature
  vector from each survey's id + GPS coordinates. Swap either of those
  for a real geophysics pipeline later — nothing downstream (`app.py`,
  the Express backend, or the frontend) needs to change.
- **Uploaded file contents aren't parsed for features yet** — the upload
  flow validates file type/size and stores the file, and the AI service
  derives its feature vector from the survey's coordinates rather than
  reading the file's contents. Wire real parsing (SEG-Y readers, CSV/Excel
  ingestion) into `ai/predict.py` when connecting real data.
- **PDF generation:** the frontend generates an instant client-side PDF
  with jsPDF, and the backend additionally offers a server-rendered PDF
  (via `pdfkit`, since jsPDF is a browser library) so reports can be
  regenerated later from history.

## Deployment

- **Frontend → Vercel:** set the build command to `npm run build`, output
  directory `dist`, and configure `VITE_API_URL` (or a rewrite/proxy) to
  point at your deployed backend.
- **Backend → Render:** deploy `server/` as a Node web service with the
  env vars from `.env.example`, plus `AI_SERVICE_URL` pointing at wherever
  the FastAPI service is hosted (Render also works for that, as a separate
  Python web service running `uvicorn app:app --host 0.0.0.0 --port $PORT`).

## Auth

JWT-based, no admin panel — registration and login only. Passwords are
hashed with bcrypt. There is no email delivery wired up for password
resets; `POST /api/auth/forgot-password` issues a token that the UI
surfaces directly for demo purposes.
