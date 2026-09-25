import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor

def train_dummy_audio_model():
    print("Generating synthetic audio dataset...")
    # In reality, you would load RAVDESS or TESS datasets here.
    # We simulate 1000 samples. 
    # Features: 13 MFCCs + 1 Pitch + 1 RMS = 15 features total
    X_train = np.random.rand(1000, 15)
    
    # We create a fake stress score (0-100) that correlates with our random data
    # (Just so the model learns a mathematical relationship)
    y_train = (X_train[:, 13] * 60) + (X_train[:, 14] * 40) + np.random.normal(0, 5, 1000)
    y_train = np.clip(y_train, 0, 100)
    
    print("Training Audio Machine Learning Model (RandomForest)...")
    model = RandomForestRegressor(n_estimators=50, random_state=42)
    model.fit(X_train, y_train)
    
    MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, os.path.join(MODEL_DIR, 'audio_model.pkl'))
    print("Saved audio_model.pkl successfully.")

def train_dummy_face_model():
    print("Generating synthetic face dataset...")
    # Features: 1 feature (avg_z_variance)
    X_train = np.random.rand(1000, 1)
    
    # Fake relationship: higher variance = higher stress
    y_train = (X_train[:, 0] * 100) + np.random.normal(0, 5, 1000)
    y_train = np.clip(y_train, 0, 100)
    
    print("Training Face Machine Learning Model (RandomForest)...")
    model = RandomForestRegressor(n_estimators=50, random_state=42)
    model.fit(X_train, y_train)
    
    MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, os.path.join(MODEL_DIR, 'face_model.pkl'))
    print("Saved face_model.pkl successfully.")

if __name__ == "__main__":
    print("--- STARTING ML TRAINING PIPELINE ---")
    train_dummy_audio_model()
    train_dummy_face_model()
    print("--- PIPELINE FINISHED ---")
    print("Models are ready in the 'ai-service/models/' directory!")
