import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/api";

const Attendance_cap = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastDetectionTime, setLastDetectionTime] = useState<Date | null>(null);
  const { toast } = useToast();

  // Automatic camera connection and detection
  useEffect(() => {
    let stream: MediaStream | null = null;
    let interval: NodeJS.Timeout | null = null;

    const startCamera = async () => {
      try {
        // Request camera permission
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' }  // Front camera for selfies
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            console.log('Camera connected, starting automatic detection');
            setIsCameraActive(true);
            // Start automatic detection every 2 seconds
            interval = setInterval(captureAndProcessFrame, 2000);
            setDetectionInterval(interval);
            toast({
              title: 'Camera Connected',
              description: 'Automatic face detection started. Stand in frame for check-in.',
            });
          };
        }
      } catch (error) {
        console.error('Camera access denied:', error);
        toast({
          title: 'Camera Error',
          description: 'Please allow camera access for automatic detection.',
          variant: 'destructive',
        });
      }
    };

    startCamera();

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (interval) clearInterval(interval);
    };
  }, [toast]);

  // Capture and send frame to backend for YOLO detection
  const captureAndProcessFrame = async () => {
    if (!isCameraActive || isProcessing || !videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);  // Base64 JPEG

        const response = await api.post('/api/face-recognition/', { image: imageData });
        setLastDetectionTime(new Date());

        if (response.data.attendance_updated) {
          toast({
            title: 'Check-in Successful!',
            description: response.data.message,
          });
        } else {
          console.log('No match:', response.data.message);  // Silent for unrecognized faces
        }
      }
    } catch (error: any) {
      console.error('Frame processing error:', error);
      toast({
        title: 'Detection Error',
        description: 'Failed to process frame. Retrying...',
        variant: 'destructive',
      });
      if (error.response?.status === 401) {
        if (detectionInterval) clearInterval(detectionInterval);
        setIsCameraActive(false);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Manual toggle
  const toggleDetection = () => {
    if (isCameraActive) {
      if (detectionInterval) {
        clearInterval(detectionInterval);
        setDetectionInterval(null);
      }
      setIsCameraActive(false);
      toast({ title: 'Detection Stopped', description: 'Camera stream stopped.' });
    } else {
      // Restart camera (re-triggers useEffect)
      setIsCameraActive(true);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Automatic Face Detection Attendance</h1>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: '100%',
            maxWidth: '640px',
            height: 'auto',
            borderRadius: '8px',
            border: '2px solid var(--border)',
            display: isCameraActive ? 'block' : 'none',
          }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!isCameraActive && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground">Click "Start Detection" to begin automatic check-ins.</p>
          </div>
        )}
      </div>
      <div className="flex justify-center gap-4">
        <Button onClick={toggleDetection} variant={isCameraActive ? 'destructive' : 'default'}>
          {isCameraActive ? 'Stop Detection' : 'Start Detection'}
        </Button>
        <Button onClick={captureAndProcessFrame} disabled={!isCameraActive || isProcessing}>
          {isProcessing ? 'Processing...' : 'Manual Check-in'}
        </Button>
      </div>
      {isCameraActive && (
        <p className="text-center text-sm text-muted-foreground">
          Automatic detection active (every 2 seconds). Last check: {lastDetectionTime ? new Date(lastDetectionTime).toLocaleTimeString() : 'None'}
        </p>
      )}
    </div>
  );
};

export default Attendance_cap;  // Fixed export