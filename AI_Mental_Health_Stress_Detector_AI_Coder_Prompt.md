# AI Coder — Restart Project From Scratch

## IMPORTANT: RESTART THE PROJECT FROM SCRATCH

You are the main AI software engineer responsible for building this project from A to Z.

## 1. FIRST: REMOVE THE OLD PROJECT IDEA

The current project may contain previous code, components, APIs, models, pages, or logic related to an older idea.

Before writing new code:

- Inspect the entire existing project.
- Identify everything related to the old project/idea.
- Remove the old business logic, unnecessary components, old APIs, old database models, old pages, and unused dependencies.
- Do NOT keep old features just because they already exist.
- Do NOT mix the old project with the new project.
- Keep only useful technical configuration when it is genuinely reusable.
- Then rebuild the application around the new specification below.

Do not start coding until you understand the complete architecture.

---

# 2. NEW PROJECT

## Project Name

**AI Mental Health & Stress Detector**

## Short Description

Build a privacy-first web application for university students.

The user records a short **30-second video while speaking**.

The system analyzes two things:

1. **Voice**
2. **Facial expressions**

The AI then combines both results and produces an **estimated stress score**.

The system is NOT a medical diagnostic tool.

It is an experimental **stress screening/indicator system**.

---

# 3. HOW THE USER USES THE SYSTEM

The complete user flow should be:

### Step 1 — Register / Login

The user creates an account or logs in.

### Step 2 — Dashboard

The user sees:

- Welcome message
- Start Stress Test button
- Previous test history

### Step 3 — Disclaimer

Before recording, display a clear disclaimer:

> "This tool is an experimental screening aid and is not a medical diagnosis."

The user must accept the disclaimer before continuing.

### Step 4 — Camera & Microphone

Ask the browser for:

- Camera permission
- Microphone permission

Show the camera preview.

### Step 5 — 30 Second Recording

The user clicks:

**Start Test**

Record video + audio for exactly approximately 30 seconds.

Show:

- Countdown/timer
- Camera preview
- Recording status
- Stop button

Handle permission errors gracefully.

### Step 6 — Analyze

After recording:

Send the recorded media to the Python AI backend.

The AI backend should analyze:

#### Audio

Extract useful acoustic features such as:

- MFCC
- Pitch
- Energy
- Other lightweight audio features when useful

Use Python libraries such as:

- librosa
- NumPy
- scikit-learn

#### Face

Extract facial information using a lightweight solution such as:

- MediaPipe

Use facial features/landmarks and a lightweight classifier.

### Step 7 — Fusion

Generate:

- Audio Stress Score: 0–100
- Face Stress Score: 0–100

Then combine them using a simple weighted late-fusion algorithm.

Example:

```text
Final Score =
(Audio Score × 0.5) +
(Face Score × 0.5)
```

Keep the fusion logic simple, transparent, and easy to explain academically.

### Step 8 — Result

Display:

- Final Stress Score
- Stress Category
- Audio Score
- Face Score
- Short explanation
- Simple recommendations

Example categories:

```text
0–39   = Low
40–69  = Medium
70–100 = High
```

These thresholds should be configurable.

Do NOT present the result as a medical diagnosis.

Use wording such as:

> "Estimated Stress Level"

instead of:

> "You have a mental health disorder."

### Step 9 — Recommendations

Based on the estimated level, provide simple non-medical recommendations such as:

- Breathing exercise
- Short break
- Walk
- Relaxation exercise
- Hydration
- Reduce screen time temporarily

Include a simple breathing exercise/timer if practical.

### Step 10 — History

Save the numerical result to the database.

The user can view previous tests.

Display:

- Date
- Final score
- Category
- Audio score
- Face score

A simple line chart can be added for the user's history.

---

# 4. IMPORTANT PRIVACY REQUIREMENT

The raw video/audio should NOT be permanently stored.

Preferred flow:

```text
Browser
   ↓
30-second recording
   ↓
Python AI service
   ↓
Process media
   ↓
Extract features
   ↓
Calculate scores
   ↓
Delete raw media
   ↓
Return scores
```

Only store:

- User ID
- Date
- Audio score
- Face score
- Final score
- Category
- Recommendations

Do not store raw video/audio unless absolutely required for debugging during development.

If temporary files are technically required during processing, delete them immediately after processing.

---

# 5. TECHNOLOGY STACK

## Frontend

Use:

- React.js
- Vite
- Vanilla CSS

Build a modern, clean, responsive UI.

Do not introduce unnecessary UI libraries unless there is a strong reason.

## Main Backend

Use:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt/password hashing

Node.js handles:

- Authentication
- Users
- Reports
- History
- Database operations

## AI Backend

Use:

- Python 3.10+
- FastAPI
- librosa
- OpenCV
- MediaPipe
- NumPy
- pandas when needed
- scikit-learn

Python handles ONLY the AI/media-analysis responsibilities.

---

# 6. HIGH-LEVEL ARCHITECTURE

Use this architecture:

```text
                ┌─────────────────────┐
                │     React + Vite    │
                │      Frontend       │
                └──────────┬──────────┘
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
    ┌─────────────────┐        ┌─────────────────┐
    │ Node / Express  │        │ Python FastAPI  │
    │ Main Backend    │        │   AI Service    │
    └────────┬────────┘        └────────┬────────┘
             │                          │
             ▼                          ▼
       ┌───────────┐           ┌──────────────────┐
       │ MongoDB   │           │ Voice + Face AI  │
       └───────────┘           └──────────────────┘
```

---

# 7. DATABASE

Use MongoDB.

## User

```text
User
├── name
├── email
├── passwordHash
└── createdAt
```

## Report

```text
Report
├── userId
├── audioScore
├── faceScore
├── finalScore
├── category
├── recommendations
└── createdAt
```

Never store raw video/audio in MongoDB.

---

# 8. API REQUIREMENTS

## Node / Express

Implement clean REST APIs such as:

```text
POST /api/auth/register
POST /api/auth/login

GET /api/reports/history
POST /api/reports
```

Protect private routes using JWT authentication.

## Python FastAPI

Implement:

```text
POST /analyze
```

It receives the recorded media and returns something similar to:

```json
{
  "audioScore": 65,
  "faceScore": 58,
  "finalScore": 61,
  "category": "Medium"
}
```

Use proper validation and error handling.

---

# 9. AI DEVELOPMENT APPROACH

Do NOT build a huge deep-learning system from scratch.

The goal is a practical, lightweight academic project that can run on CPU.

Use public datasets for training/evaluation.

Potential datasets include:

### Audio

- RAVDESS
- TESS

### Facial expression

- FER2013

If a dataset does not directly measure "stress", clearly document that emotional-state labels are being used as a proxy/experimental signal rather than claiming clinical stress detection.

Keep the ML pipeline modular so models can be replaced later.

For example:

```text
models/
├── audio_model/
├── face_model/
└── fusion/
```

---

# 10. MACHINE LEARNING PIPELINE

Create a clear pipeline:

```text
Dataset
   ↓
Data preprocessing
   ↓
Feature extraction
   ↓
Train/Test split
   ↓
Model training
   ↓
Evaluation
   ↓
Save trained model
   ↓
FastAPI inference
```

Use appropriate evaluation metrics such as:

- Accuracy
- Precision
- Recall
- F1-score
- Confusion Matrix

Also evaluate:

1. Audio-only
2. Face-only
3. Audio + Face fusion

This comparison is important for the academic report.

---

# 11. UI PAGES

Create these pages:

```text
/
├── Landing Page
├── Login
├── Register
├── Dashboard
├── Stress Test
├── Analysis Loading
├── Result
└── History
```

The UI should feel like a serious graduation project.

Use:

- Clean typography
- Modern cards
- Clear hierarchy
- Responsive design
- Accessible buttons
- Loading states
- Error states
- Empty states

Avoid excessive animations.

---

# 12. SECURITY

Implement:

- Password hashing
- JWT authentication
- Protected routes
- Input validation
- CORS configuration
- Environment variables
- No hardcoded secrets
- Secure error handling

Use `.env` files for:

```text
MONGO_URI
JWT_SECRET
PYTHON_AI_URL
```

Never commit secrets.

---

# 13. ERROR HANDLING

Handle at minimum:

- Camera denied
- Microphone denied
- Browser does not support MediaRecorder
- Recording failure
- Upload failure
- Python AI service unavailable
- Invalid media
- ML processing failure
- Database failure
- Expired JWT

Always show a user-friendly message.

Do not expose stack traces to users.

---

# 14. PROJECT STRUCTURE

Use a clean structure similar to:

```text
project/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── ...
│
├── ai-service/
│   ├── app/
│   ├── models/
│   ├── preprocessing/
│   ├── inference/
│   └── requirements.txt
│
├── ml/
│   ├── datasets/
│   ├── notebooks/
│   ├── training/
│   └── evaluation/
│
└── README.md
```

Adapt this structure to the existing project when appropriate, but keep the separation between frontend, backend, AI service, and ML training code.

---

# 15. DEVELOPMENT RULES

**Do not over-engineer.**

We have approximately 12 weeks and this is a solo project.

Prioritize:

1. Working system
2. Correct architecture
3. Reliable AI pipeline
4. Clean UI
5. Evaluation
6. Documentation

Do not add unnecessary features.

Build incrementally.

After every major feature, verify that it works before moving to the next feature.

---

# 16. DEVELOPMENT ORDER

Follow this order:

### Phase A
Clean old project and establish the new architecture.

### Phase B
Build React frontend.

### Phase C
Build Node/Express authentication.

### Phase D
Connect MongoDB.

### Phase E
Implement camera/microphone recording.

### Phase F
Build Python FastAPI service.

### Phase G
Build audio feature extraction and model.

### Phase H
Build facial feature extraction and model.

### Phase I
Implement late fusion.

### Phase J
Connect React → Python AI service.

### Phase K
Connect results → Node → MongoDB.

### Phase L
Build history and charts.

### Phase M
Testing, error handling, security, and UI polishing.

### Phase N
ML evaluation and academic documentation.

---

# 17. VERY IMPORTANT

Do not pretend that a model is accurate if it has not been evaluated.

Do not fabricate:

- Dataset results
- Accuracy
- F1 scores
- Model performance
- Scientific claims

If something is not implemented yet, clearly mark it as:

```text
TODO
```

If a dataset/model/library causes a problem, stop and explain the problem before creating a fake solution.

---

# 18. YOUR FIRST TASK

Before changing code:

1. Inspect the current project structure.
2. Identify the existing old project.
3. Identify what can safely be deleted.
4. Identify reusable infrastructure.
5. Propose the final folder structure.
6. Explain the migration plan briefly.
7. Then start implementing the new project.

Do NOT continue the old idea.

The new project is exclusively:

# AI Mental Health & Stress Detector

The final goal is:

**30-second student video → Voice Analysis + Face Analysis → Fusion → Estimated Stress Score → Recommendations → History**

Build the complete system from A to Z in a clean, modular, academically defensible way.
