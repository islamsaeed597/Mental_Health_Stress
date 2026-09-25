# 🌟 Aura: AI Mental Health & Stress Detector

Aura is a privacy-first web application designed to help university students estimate their cognitive load and stress levels in real-time. It utilizes a 30-second video recording to perform **Facial Micro-expression Analysis** and **Vocal Tension Analysis**, combining them into a comprehensive stress index.

---

## 🛠️ Tech Stack
- **Frontend:** React.js, Vite, CSS (Premium UI / Glassmorphism)
- **Backend:** Node.js, Express.js, MongoDB
- **AI Service:** Python, FastAPI, MediaPipe (FaceLandmarker), Librosa (Audio)

---

## 🚀 Getting Started

Follow these steps to run the complete project on your local machine from scratch.

### 📋 Prerequisites
Before you begin, ensure you have the following installed on your machine:
1. [Node.js](https://nodejs.org/) (v18 or higher)
2. [Python](https://www.python.org/downloads/) (v3.9 or higher)
3. [MongoDB](https://www.mongodb.com/try/download/community) (Running locally or a MongoDB Atlas URI) - *(Optional for testing, backend has a soft-fail)*

---

### 1️⃣ Setup the Node.js Backend
The backend handles user authentication, database connections, and saving test histories.

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add your MongoDB URI:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/stress-detector
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *(The server will run on `http://localhost:5000`)*

---

### 2️⃣ Setup the Python AI Service
The AI service analyzes the video and audio to compute the stress scores using a highly accurate `60% Face / 40% Audio` weighted algorithm.

1. Open a **new terminal** and navigate to the `ai-service` folder:
   ```bash
   cd ai-service
   ```
2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - **Windows:** `venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`
4. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
5. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *(The AI service will run on `http://127.0.0.1:8000`)*

---

### 3️⃣ Setup the React Frontend
The frontend provides the premium, interactive user interface.

1. Open a **third terminal** and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```
   *(The frontend will open in your browser, typically at `http://localhost:5173`)*

---

## 💡 How to Use
1. Open the frontend URL in your browser.
2. Navigate to the **Dashboard** and start a **New Test**.
3. Grant camera and microphone permissions.
4. Record a 30-second video of yourself speaking naturally.
5. The AI service will analyze the feed, and you will see your **Overall Stress Index** alongside personalized actionable insights!
6. Visit the **History** tab to see your past recorded scores (currently saved in local storage for lightning-fast access).

---

## 🔒 Privacy First
Your video and audio streams are processed in real-time and are **never permanently stored**. Only the numerical stress scores and history logs are saved to track your well-being over time.
