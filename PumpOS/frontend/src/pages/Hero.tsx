import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-foreground to-secondary relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl animate-spin"></div>
      </div>
      
      <div className="text-center z-10 animate-fade-in">
        <div className="mb-8 space-y-6">
          <div className="relative">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 animate-scale-in bg-gradient-to-r from-white via-primary-foreground to-white bg-clip-text text-transparent">
              GymPro
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl animate-pulse rounded-full"></div>
          </div>
          <p className="text-xl md:text-2xl text-white/90 font-light animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Complete Fitness Management System
          </p>
          <div className="flex items-center justify-center space-x-2 animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="w-64 mx-auto">
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-100 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-white/80 text-sm mt-2">Loading... {progress}%</p>
          </div>
          
          {/* Loading Spinner */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-white/30 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-2 border-secondary/50 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;