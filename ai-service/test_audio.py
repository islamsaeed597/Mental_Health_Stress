import tempfile
import os
import sys

def mock_extract():
    import audio_processor
    # Create a dummy file named .webm
    fd, tmp_webm = tempfile.mkstemp(suffix=".webm")
    os.write(fd, b"dummy data")
    os.close(fd)
    
    print("TESTING WITH:", tmp_webm)
    res = audio_processor.extract_audio_features(tmp_webm)
    print("RESULT:", res)
    os.remove(tmp_webm)

sys.path.append("app")
mock_extract()
