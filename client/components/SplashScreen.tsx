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
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-1000 ${animateOut ? 'opacity-0' : 'opacity-100'}`}
      style={{ 
        background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)',
        overflow: 'hidden'
      }}
    >
      <style>
        {`
          @keyframes cinematicEnter {
            0% { clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%); }
            100% { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%); }
          }
          
          @keyframes cinematicExit {
            0% { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%); }
            100% { clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes rotate3d {
            0% { transform: rotateY(0deg) rotateX(10deg); }
            100% { transform: rotateY(360deg) rotateX(10deg); }
          }
          
          @keyframes glowPulse {
            0%, 100% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.3); }
            50% { box-shadow: 0 0 60px rgba(255, 255, 255, 0.6); }
          }
          
          @keyframes particleFloat {
            0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 0.8; }
            100% { transform: translateY(-100vh) translateX(20px) rotate(360deg); opacity: 0; }
          }
          
          @keyframes textGlow {
            0%, 100% { text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
            50% { text-shadow: 0 0 30px rgba(255, 255, 255, 1), 0 0 60px rgba(255, 255, 255, 0.8); }
          }
          
          @keyframes letterEntrance {
            0% { opacity: 0; transform: translateY(50px) rotateX(90deg); }
            100% { opacity: 1; transform: translateY(0) rotateX(0); }
          }
        `}
      </style>

      {/* Cinematic overlay transition */}
      <div 
        className="absolute inset-0 z-50 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.8) 100%)',
          animation: animateOut ? 'cinematicExit 1000ms ease-in-out forwards' : 'cinematicEnter 1500ms ease-in-out forwards',
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => {
          const size = Math.random() * 6 + 2;
          const posX = Math.random() * 100;
          const delay = Math.random() * 5000;
          const duration = 8000 + Math.random() * 12000;
          
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: size,
                height: size,
                left: `${posX}%`,
                bottom: '-20px',
                animation: `particleFloat ${duration}ms linear ${delay}ms infinite`,
                opacity: 0
              }}
            />
          );
        })}
      </div>

      {/* Glowing rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="absolute rounded-full border border-white/20"
          style={{
            width: '400px',
            height: '400px',
            animation: 'glowPulse 4000ms ease-in-out infinite'
          }}
        />
        <div 
          className="absolute rounded-full border border-white/10"
          style={{
            width: '600px',
            height: '600px',
            animation: 'glowPulse 4000ms ease-in-out infinite reverse'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center select-none text-white z-10">
        <div className="flex items-center gap-12" style={{ perspective: '1000px' }}>
          <div className="text-left">
            <div 
              className="text-[70px] md:text-[90px] font-black leading-none tracking-wider"
              style={{
                fontFamily: 'monospace',
                animation: `textGlow 3000ms ease-in-out infinite`,
                transform: 'translateZ(50px)'
              }}
            >
              {line1.split("").map((ch, i) => (
                <span 
                  key={`l1-${i}`} 
                  className="inline-block"
                  style={{ 
                    animation: `letterEntrance 800ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`,
                    animationDelay: `${i * 150}ms`,
                    opacity: 0,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>
            <div 
              className="text-[70px] md:text-[90px] font-black leading-tight tracking-wider mt-2"
              style={{
                fontFamily: 'monospace',
                animation: `textGlow 3000ms ease-in-out infinite reverse`,
                transform: 'translateZ(30px)'
              }}
            >
              {line2.split("").map((ch, i) => (
                <span 
                  key={`l2-${i}`} 
                  className="inline-block"
                  style={{ 
                    animation: `letterEntrance 800ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`,
                    animationDelay: `${(line1.length * 150) + (i * 150) + 300}ms`,
                    opacity: 0,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>
          
          {/* 3D Rotating Compass */}
          <div 
            className="relative"
            style={{
              animation: 'float 6000ms ease-in-out infinite',
              transformStyle: 'preserve-3d'
            }}
          >
            <div 
              className="relative h-28 w-28 md:h-36 md:w-36"
              style={{
                animation: 'rotate3d 8000ms linear infinite',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Outer ring */}
              <div 
                className="absolute inset-0 rounded-full border-4 border-white"
                style={{
                  boxShadow: '0 0 30px rgba(255, 255, 255, 0.4)',
                  transform: 'translateZ(20px)'
                }}
              />
              
              {/* Inner ring */}
              <div 
                className="absolute inset-4 rounded-full border-2 border-white/70"
                style={{
                  transform: 'translateZ(10px)'
                }}
              />
              
              {/* Compass needle */}
              <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateZ(30px)' }}>
                <div className="relative h-20 w-20 md:h-24 md:w-24">
                  <svg viewBox="0 0 100 100" className="absolute inset-0" fill="white">
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge> 
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <circle cx="50" cy="50" r="8" fill="white" filter="url(#glow)" />
                    <path d="M50 5 L65 50 L50 40 L35 50 Z" fill="white" filter="url(#glow)" />
                    <path d="M50 95 L35 50 L50 60 L65 50 Z" fill="white" opacity="0.9" filter="url(#glow)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subtitle with cinematic reveal */}
        <div 
          className="mt-8 text-center"
          style={{
            opacity: 0,
            animation: 'letterEntrance 1000ms ease-out forwards',
            animationDelay: '2000ms'
          }}
        >
          <p className="text-xl md:text-2xl font-light tracking-widest opacity-80" style={{ letterSpacing: '8px' }}>
            NAVIGATING YOUR FUTURE
          </p>
        </div>
      </div>
    </div>
  );
}
