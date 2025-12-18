import React, { useEffect, useState } from "react";

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export default function SplashScreen({ onFinish, durationMs = 5000 }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  const line1 = "CAREER";
  const line2 = "COMPASS";

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);

    const finishTimer = setTimeout(() => {
      setAnimateOut(true);
      setTimeout(() => {
        setVisible(false);
        onFinish();
      }, 500);
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${animateOut ? 'opacity-0' : 'opacity-100'}`}
      style={{ backgroundColor: '#000' }}
    >
      <style>
        {`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes sparkle { 
            0% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0); }
          }
          @keyframes textAppear { 
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => {
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const size = Math.random() * 4 + 1;
          const delay = Math.random() * 5000;
          const duration = Math.random() * 2000 + 1000;
          return (
            <span 
              key={i} 
              className="absolute rounded-full bg-white"
              style={{ 
                top: `${top}%`, 
                left: `${left}%`, 
                width: size, 
                height: size, 
                animation: `sparkle ${duration}ms ease-in-out ${delay}ms infinite`
              }} 
            />
          );
        })}
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center select-none text-white font-poppins">
        <div className="flex items-center gap-8">
          <div className="text-left">
            <div className="text-[60px] md:text-[80px] font-black leading-none" style={{
              animation: `textAppear 1000ms ease-out forwards`,
              opacity: 0
            }}>
              {line1.split("").map((ch, i) => (
                <span 
                  key={`l1-${i}`} 
                  className="inline-block"
                  style={{ 
                    animation: `textAppear 800ms ease-out forwards`,
                    animationDelay: `${i * 100}ms`,
                    opacity: 0
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>
            <div className="text-[60px] md:text-[80px] font-black leading-tight" style={{
              animation: `textAppear 1000ms ease-out forwards`,
              animationDelay: '300ms',
              opacity: 0
            }}>
              {line2.split("").map((ch, i) => (
                <span 
                  key={`l2-${i}`} 
                  className="inline-block"
                  style={{ 
                    animation: `textAppear 800ms ease-out forwards`,
                    animationDelay: `${300 + i * 100}ms`,
                    opacity: 0
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>
          
          {/* Rotating Compass */}
          <div className="relative h-24 w-24 md:h-32 md:w-32">
            <div className="absolute inset-0 rounded-full border-4 border-white" />
            <div className="absolute inset-2 rounded-full border-2 border-white/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-12 w-12 md:h-16 md:w-16" style={{ animation: 'spin 3000ms linear infinite' }}>
                <svg viewBox="0 0 100 100" className="absolute inset-0" fill="white">
                  <circle cx="50" cy="50" r="6" fill="white" />
                  <path d="M50 10 L60 50 L50 45 L40 50 Z" fill="white" />
                  <path d="M50 90 L40 50 L50 55 L60 50 Z" fill="white" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
