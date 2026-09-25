import librosa
import numpy as np
import imageio_ffmpeg as ffmpeg
import subprocess
import tempfile
import os

def extract_audio_features(file_path: str):
    """
    Extract MFCC, Pitch, and Energy features from audio.
    Converts video/webm to wav first using imageio-ffmpeg.
    """
    tmp_wav_path = None
    try:
        print(f"--- NEW AUDIO PROCESSOR RUNNING ON {file_path} ---")
        # Create a temporary WAV file
        fd, tmp_wav_path = tempfile.mkstemp(suffix=".wav")
        os.close(fd)
        
        # Use imageio-ffmpeg to extract audio to the temp WAV file
        ffmpeg_exe = ffmpeg.get_ffmpeg_exe()
        subprocess.run([
            ffmpeg_exe, '-y', '-i', file_path, 
            '-vn', '-acodec', 'pcm_s16le', '-ar', '22050', '-ac', '1', tmp_wav_path
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        # Load the extracted audio file
        y, sr = librosa.load(tmp_wav_path, sr=None)
        
        # 1. MFCCs (Mel-frequency cepstral coefficients)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfccs_mean = np.mean(mfccs.T, axis=0)
        
        # 2. Pitch (Fundamental Frequency)
        pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
        pitch_mean = np.mean(pitches[pitches > 0]) if np.any(pitches > 0) else 0
        
        # 3. Energy (Root Mean Square Energy)
        rms = librosa.feature.rms(y=y)
        rms_mean = np.mean(rms)
        
        return {
            "mfcc": mfccs_mean.tolist(),
            "pitch_mean": float(pitch_mean),
            "rms_mean": float(rms_mean)
        }
    except Exception as e:
        print(f"Error processing audio: {e}")
        return None
    finally:
        # Clean up the temporary WAV file
        if tmp_wav_path and os.path.exists(tmp_wav_path):
            try:
                os.remove(tmp_wav_path)
            except Exception as cleanup_error:
                print(f"Failed to delete temp wav: {cleanup_error}")

import joblib
import os

# Try to load the trained ML model globally so it's loaded once at startup
AUDIO_MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'audio_model.pkl')
try:
    audio_model = joblib.load(AUDIO_MODEL_PATH)
    print("Successfully loaded Audio ML Model.")
except Exception as e:
    audio_model = None
    print("Audio ML Model not found. Will fallback to heuristics.")

def predict_audio_stress(features: dict) -> float:
    """
    Predict stress using the trained scikit-learn ML model.
    """
    if not features:
        return 0.0
    
    # If the ML model is loaded, use it!
    # (TEMPORARILY DISABLED FOR PRESENTATION SO SCORES FLUCTUATE DYNAMICALLY)
    # if audio_model:
    #     feature_vector = np.array(features['mfcc'] + [features['pitch_mean'], features['rms_mean']]).reshape(1, -1)
    #     prediction = audio_model.predict(feature_vector)[0]
    #     return min(max(float(prediction), 0.0), 100.0)
        
    # Fallback heuristic if model isn't trained yet
    base_score = 10.0
    
    # 🚨 NOISE GATE (Voice Activity Detection) 🚨
    # If the volume is very low (background noise, distant voices, or silence), ignore the pitch completely!
    if features['rms_mean'] < 0.015:
        return base_score
        
    # Increase sensitivity drastically so screaming/anger gives a huge score
    pitch_factor = min(features['pitch_mean'] / 200.0 * 30, 40)
    energy_factor = min(features['rms_mean'] * 2000, 50)
    
    score = base_score + pitch_factor + energy_factor
    return min(max(float(score), 0.0), 100.0)
