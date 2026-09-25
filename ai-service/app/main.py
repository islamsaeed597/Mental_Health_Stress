from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import tempfile

# Import our processors
from audio_processor import extract_audio_features, predict_audio_stress
from face_processor import process_video_faces, predict_face_stress
from fusion import calculate_late_fusion

app = FastAPI(title="AI Mental Health & Stress Detector API")

# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "AI Stress Detector Service is running."}

@app.post("/analyze")
async def analyze_media(video: UploadFile = File(...)):
    """
    Receives a 30-second video/audio recording.
    Processes it via librosa (audio) and mediapipe (face).
    Returns stress scores.
    """
    if not video.filename.endswith(('.mp4', '.webm', '.wav', '.ogg')):
        raise HTTPException(status_code=400, detail="Invalid file format")
    
    # 1. Save temporarily
    try:
        suffix = os.path.splitext(video.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
            tmp_file.write(await video.read())
            tmp_path = tmp_file.name
            
        # 2. Extract & Predict Audio
        audio_features = extract_audio_features(tmp_path)
        audio_score = predict_audio_stress(audio_features)
        
        # 3. Extract & Predict Face
        face_features = process_video_faces(tmp_path)
        face_score = predict_face_stress(face_features)
        
        # 4. Fusion
        results = calculate_late_fusion(audio_score, face_score)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # IMPORTANT PRIVACY REQUIREMENT: Delete raw media immediately after processing
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
            
    return results

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
