# 🌎 GeoMiner AI  
### AI-Powered Mineral Exploration & Geological Intelligence Platform

![GeoMiner AI](https://img.shields.io/badge/AI-Mineral%20Exploration-blue)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![FastAPI](https://img.shields.io/badge/AI-Service-FastAPI-yellow)
![3D Visualization](https://img.shields.io/badge/3D-Three.js-black)

---

## 🚀 Overview

**GeoMiner AI** is an AI-powered mineral exploration platform that analyzes geophysical survey data and predicts underground mineral deposits using Machine Learning, geological intelligence, and interactive 3D visualization.

The platform helps users discover potential mining locations by providing:

- Mineral probability estimation
- Deposit depth prediction
- Ore grade analysis
- Geological boundary detection
- Recommended drilling locations
- Economic feasibility analysis
- Confidence and uncertainty estimation

Built with **MERN Stack + Python FastAPI AI Microservice**, GeoMiner AI provides a modern workflow for intelligent mineral exploration.

---

# 🎯 Problem Statement

Traditional mineral exploration requires expensive surveys, expert analysis, and significant time investment.

GeoMiner AI reduces exploration complexity by using Artificial Intelligence to analyze geological datasets and provide data-driven insights for mining decisions.

---

# ✨ Features

## 🔐 User Authentication

- User Registration
- Secure Login
- JWT Authentication
- Protected Routes
- User Profile
- Forgot Password Interface
- Logout
- Account Settings


---

# 🧠 AI Mineral Prediction Engine

The AI system analyzes uploaded geological survey data and predicts:

- Mineral Type
- Mineral Probability
- Deposit Depth
- Deposit Boundary
- Ore Grade
- Confidence Score
- Uncertainty Score
- Deposit Size
- Economic Viability


Supported Minerals:

- Copper
- Lithium
- Gold
- Iron Ore
- Nickel
- Silver
- Zinc


---

# 📂 Geological Survey Data Analysis

Supported Data Formats:

- CSV
- Excel
- SEG-Y
- GeoJSON
- Geological Maps
- Borehole Data
- Drill Core Samples
- Assay Data
- GPS Survey Data


Supported Geological Inputs:

- 2D Seismic Reflection Profiles
- Magnetotelluric Resistivity Data
- Geological Maps
- Fault Line Data
- Lithology Maps
- Borehole Information


---

# 🌍 3D Underground Visualization

GeoMiner AI provides an interactive underground geological model using:

- Three.js
- React Three Fiber
- React Three Drei


Features:

- Rotate underground model
- Zoom and pan controls
- Layer visualization
- Transparency control
- Lighting effects
- Mineral body visualization
- Rock layers
- Fault lines
- Water table representation


---

# 🗺️ Interactive Geological Map

Powered by Leaflet.js.

Displays:

- Survey locations
- Recommended drilling sites
- GPS coordinates
- Risk zones
- Mineral probability heatmaps
- Location-based analysis


---

# 🎯 AI Drill Site Recommendation

The system generates the best drilling locations based on AI predictions.

Each recommended site includes:

- Latitude
- Longitude
- Mineral Type
- Probability
- Estimated Depth
- Confidence Score
- Risk Level
- Mining Cost
- Expected Revenue
- ROI
- Priority Ranking


---

# 📊 Intelligent Dashboard

Dashboard provides real-time exploration insights.

### Statistics

- Total Surveys
- AI Predictions
- Recommended Drill Sites
- Average Confidence
- Economic Score
- Reports Generated


### Analytics

- Mineral Distribution
- Prediction Accuracy
- Confidence Trend
- Survey Progress
- Economic Analysis
- Ore Grade Analysis
- Risk Assessment


---

# 🤖 GeoMiner AI Assistant

An AI chatbot that helps users understand geological insights.

Capabilities:

- Explain AI predictions
- Explain geological concepts
- Provide survey guidance
- Explain mineral information
- Assist with reports


---

# 📑 Professional Report Generation

Generate downloadable exploration reports.

Supported Formats:

- PDF
- CSV
- Excel


Reports contain:

- Project Summary
- Survey Information
- AI Prediction Results
- Geological Visualization
- Drill Recommendations
- Economic Analysis
- Confidence Analysis


---

# 📈 Economic Analysis

GeoMiner AI estimates:

- Mining Cost
- Expected Revenue
- Ore Grade
- Profit Potential
- ROI
- Investment Score
- Risk Score
- Break-even Analysis


---

# 🏗️ Technology Stack


## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Framer Motion
- React Icons
- Recharts
- Three.js
- React Three Fiber
- React Three Drei
- Leaflet.js


## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Multer


## AI Service

- Python
- FastAPI
- TensorFlow / PyTorch
- Scikit-Learn
- NumPy
- Pandas


## Deployment

Frontend:
- Vercel

Backend:
- Render

AI Service:
- Cloud Deployment Ready


---

# 🔌 API Features

### Authentication

```
POST /api/auth/register

POST /api/auth/login

GET /api/auth/profile
```


### Surveys

```
POST /api/surveys/upload

GET /api/surveys

GET /api/surveys/:id
```


### AI Prediction

```
POST /api/predict

GET /api/predictions

GET /api/predictions/:id

DELETE /api/predictions/:id
```


### Reports

```
GET /api/report/pdf/:id

GET /api/report/csv/:id
```


---

# 🧪 Example AI Prediction Output

```json
{
  "mineral": "Copper",
  "probability": "94%",
  "depth": "350m",
  "oreGrade": "2.8%",
  "confidence": "91%",
  "economicScore": "87",
  "recommendedDrillSites": 10
}
```

---

# 🎨 UI Design

Design Philosophy:

- Modern Enterprise Dashboard
- Dark Professional Theme
- Glassmorphism UI
- Smooth Animations
- Responsive Layout


Color Theme:

```
Primary:
#2563EB

Background:
#0F172A

Accent:
#22C55E
```


---

# 🚀 Future Enhancements

- Real satellite geological data integration
- Advanced deep learning geological models
- Drone survey data processing
- Real-time mining collaboration
- Digital twin mining simulation
- Cloud-based AI training pipeline


---

# 👨‍💻 Developer

**Nabiullha Alam**

BCA Data Science  
SRM Institute of Science and Technology


---

# ⭐ Project Status

🚀 Hackathon Ready  
🧠 AI Powered  
🌍 Industry Inspired  
📊 Data Driven Exploration Platform


---

# 📜 License

This project is created for educational, research, and hackathon purposes.
