import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaceLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

function StressTest() {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [stream, setStream] = useState(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const faceLandmarkerRef = useRef(null);
  
  const navigate = useNavigate();

  const handleAccept = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      setHasAccepted(true);
    } catch (err) {
      alert("Camera and Microphone permissions are required to perform the test.");
    }
  };

  // 1. Initialize Video Stream and FaceLandmarker Model
  useEffect(() => {
    let active = true;
    
    const initFaceLandmarker = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1
        });
        if (active) {
          faceLandmarkerRef.current = landmarker;
          setIsModelLoaded(true);
        }
      } catch (err) {
        console.error("Error loading FaceLandmarker:", err);
      }
    };

    if (hasAccepted && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      initFaceLandmarker();
    }
    
    return () => { active = false; };
  }, [hasAccepted, stream]);

  // 2. Render Loop to draw Face Mesh on Canvas
  useEffect(() => {
    let animationId;
    let lastVideoTime = -1;
    
    const predictWebcam = async () => {
      if (!videoRef.current || !canvasRef.current || !faceLandmarkerRef.current) {
        animationId = requestAnimationFrame(predictWebcam);
        return;
      }
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      // Sync canvas size to video stream resolution
      if (video.videoWidth > 0 && (canvas.width !== video.videoWidth)) {
         canvas.width = video.videoWidth;
         canvas.height = video.videoHeight;
      }

      if (video.readyState >= 2) {
        let startTimeMs = performance.now();
        if (lastVideoTime !== video.currentTime) {
          lastVideoTime = video.currentTime;
          
          // Detect faces in the current video frame
          const results = faceLandmarkerRef.current.detectForVideo(video, startTimeMs);
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          if (results.faceLandmarks) {
            const drawingUtils = new DrawingUtils(ctx);
            for (const landmarks of results.faceLandmarks) {
              // Minimalist Professional HUD Style (No messy spiderweb)
              const hudColor = "#0ea5e9"; // Cyan blue
              const hudWidth = 2;
              
              drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
                { color: hudColor, lineWidth: hudWidth }
              );
              drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
                { color: hudColor, lineWidth: hudWidth }
              );
              drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
                { color: hudColor, lineWidth: hudWidth }
              );
              drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
                { color: hudColor, lineWidth: hudWidth }
              );
              drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
                { color: hudColor, lineWidth: hudWidth }
              );
              drawingUtils.drawConnectors(
                landmarks,
                FaceLandmarker.FACE_LANDMARKS_LIPS,
                { color: hudColor, lineWidth: hudWidth }
              );
            }
          }
        }
      }
      animationId = requestAnimationFrame(predictWebcam);
    };
    
    if (hasAccepted) {
      predictWebcam();
    }
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [hasAccepted]);

  const startRecording = () => {
    setIsRecording(true);
    chunksRef.current = [];
    let timer = 30;
    
    const options = { mimeType: 'video/webm;codecs=vp8,opus' };
    const mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      await uploadMedia(blob);
    };
    
    mediaRecorder.start(1000);
    
    const interval = setInterval(() => {
      timer -= 1;
      setTimeLeft(timer);
      if (timer === 0) {
        clearInterval(interval);
        stopRecording();
      }
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    navigate('/analyzing');
  };

  const uploadMedia = async (blob) => {
    const formData = new FormData();
    formData.append('video', blob, 'recording.webm');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      const data = await response.json();
      navigate('/result', { state: { results: data } });
    } catch (error) {
      console.error('Upload Error:', error);
      alert('Failed to analyze the video. Please try again.');
      navigate('/dashboard');
    }
  };

  if (!hasAccepted) {
    return (
      <div className="main-content">
        <div className="card">
          <h2>Disclaimer</h2>
          <div className="alert-box" style={{ fontSize: '1.1rem' }}>
            "This tool is an experimental screening aid and is not a medical diagnosis."
          </div>
          <p>
            We require access to your camera and microphone for a 30-second recording.
            The data is processed in real-time and <strong>not permanently stored</strong>.
          </p>
          <button onClick={handleAccept} className="primary-btn">I Accept, Continue</button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="card" style={{ maxWidth: '800px' }}>
        <h2>Stress Test Recording</h2>
        <p>Please speak naturally about how you are feeling today.</p>
        
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
          
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          ></video>
          
          {/* Live Face Tracking Canvas */}
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 5 }}
          ></canvas>

          {/* Loading Indicator for Model */}
          {!isModelLoaded && (
             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.7)', padding: '1rem', borderRadius: '8px', zIndex: 10, color: '#0ea5e9' }}>
               Loading AI Models...
             </div>
          )}

          {isRecording && (
            <>
              <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(239, 68, 68, 0.8)', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold', zIndex: 10 }}>
                Recording: {timeLeft}s
              </div>
              
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', padding: '10px 15px', borderRadius: '8px', color: '#0ea5e9', fontFamily: 'monospace', fontSize: '0.9rem', textAlign: 'left', zIndex: 10 }}>
                <div className="typewriter">&gt; TRACKING FACIAL LANDMARKS...</div>
                <div className="typewriter" style={{ animationDelay: '1s' }}>&gt; EXTRACTING 468 MESH POINTS...</div>
                <div className="typewriter" style={{ animationDelay: '2s' }}>&gt; ANALYZING MICRO-EXPRESSIONS...</div>
              </div>

              <style>
                {`
                  @keyframes typing {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                  .typewriter {
                    opacity: 0;
                    animation: typing 0.5s forwards;
                  }
                `}
              </style>
            </>
          )}
        </div>

        {!isRecording ? (
          <button onClick={startRecording} className="primary-btn" style={{ width: '100%' }} disabled={!isModelLoaded}>
            {isModelLoaded ? "Start 30-Second Recording" : "Please wait..."}
          </button>
        ) : (
          <button onClick={() => {}} className="primary-btn" style={{ width: '100%', background: '#ef4444' }} disabled>
            Recording in progress...
          </button>
        )}
      </div>
    </div>
  );
}

export default StressTest;
