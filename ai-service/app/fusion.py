def calculate_late_fusion(audio_score: float, face_score: float) -> dict:
    """
    Combine audio and face scores using a simple weighted late-fusion algorithm.
    """
    # 60/40 weighting for better clinical accuracy (Face is more reliable than Audio)
    weight_audio = 0.4
    weight_face = 0.6
    
    final_score = (audio_score * weight_audio) + (face_score * weight_face)
    
    # Categorize
    if final_score < 40:
        category = "Low"
    elif final_score < 70:
        category = "Medium"
    else:
        category = "High"
        
    return {
        "audioScore": round(audio_score, 1),
        "faceScore": round(face_score, 1),
        "finalScore": round(final_score, 1),
        "category": category
    }
