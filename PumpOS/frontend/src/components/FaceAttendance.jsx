import React, { useRef, useEffect, useState } from 'react';

const FaceRecognition = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [status, setStatus] = useState("Waiting...");

    // 1. Start the Camera on Component Mount
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(err => console.error("Error accessing webcam:", err));
    }, []);

    // 2. The Activation Function
    const captureAndCheckAttendance = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        // Draw video frame to canvas
        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, 640, 480);

        // Convert to Base64
        const imageSrc = canvasRef.current.toDataURL('image/jpeg');

        setStatus("Scanning...");

        try {
            // 3. Send to your Django Backend
            const response = await fetch('http://localhost:8000/api/face-recognition/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add Authorization header if your view requires it, 
                    // though we set permission_classes = [AllowAny] for this view
                },
                body: JSON.stringify({ image: imageSrc })
            });

            const data = await response.json();

            if (data.attendance_updated) {
                setStatus(`Success: ${data.message}`);
                // Optional: Play a success sound here
            } else {
                setStatus(data.message || "Not recognized");
            }
        } catch (error) {
            console.error("API Error:", error);
            setStatus("Error connecting to server");
        }
    };

    // 4. Trigger Loop (Automatic Activation)
    useEffect(() => {
        const interval = setInterval(() => {
            captureAndCheckAttendance();
        }, 3000); // Activate every 3 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
        <div>
            <h2>Kiosk Mode: Face Attendance</h2>
            <div style={{ position: 'relative', width: '640px', height: '480px' }}>
                <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    width="640" 
                    height="480" 
                    style={{ borderRadius: '10px' }}
                />
                {/* Hidden Canvas for processing */}
                <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
            </div>
            <p>Status: <strong>{status}</strong></p>
        </div>
    );
};

export default FaceRecognition;