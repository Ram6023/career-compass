import React, { useEffect, useState } from "react";

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export default function SplashScreen({ onFinish, durationMs = 5000 }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);
  const [phase, setPhase] = useState<1 | 2>(1);

  const variant = React.useMemo(() => {
    const palette = {
      name: "emerald",
      tileFrom: "from-emerald-500",
      tileVia: "via-teal-500",
      tileTo: "to-blue-600",
      textFrom: "from-emerald-600",
      textVia: "via-teal-600",
      textTo: "to-blue-600",
    } as const;
    const taglines = [
      "Navigate your future",
      "Intelligence for your career",
      "Chart. Compare. Conquer.",
      "Decisions made smarter",
      "Plan your path",
    ];
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
    return {
      palette,
      barSpeedMs: 2400 + Math.floor(Math.random() * 900),
      tagline: pick(taglines),
    };
  }, []);

  const line1 = "CAREER";
  const line2 = "COMPASS";

  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const max = 10; // degrees
    setTilt({ rx: -(dy * max), ry: dx * max });
  };
  const handleMouseLeave = () => setTilt({ rx: 0, ry: 0 });

  useEffect(() => {
    const started = Date.now();
    const minTotalMs = 4200; // cinematic minimum

    const inTimer = setTimeout(() => setAnimateIn(true), 60);
    const stepTimer = setTimeout(() => setPhase(2), 2000);

    const windowLoaded = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', () => resolve(), { once: true });
    });
    const fontsReady = (document as any).fonts?.ready ?? Promise.resolve();

    let outTimer: ReturnType<typeof setTimeout> | undefined;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;

    Promise.race([Promise.allSettled([windowLoaded, fontsReady]).then(() => undefined)]).then(() => {
      const elapsed = Date.now() - started;
      const wait = Math.max(0, minTotalMs - elapsed);
      outTimer = setTimeout(() => setAnimateOut(true), wait);
      finishTimer = setTimeout(() => {
        setVisible(false);
        onFinish();
      }, wait + 350);
    });

    // Hard fallback to avoid hanging splash if assets stall
    const forceTimer = setTimeout(() => {
      setAnimateOut(true);
      finishTimer = setTimeout(() => {
        setVisible(false);
        onFinish();
      }, 350);
    }, durationMs);

    return () => {
      clearTimeout(inTimer);
      clearTimeout(stepTimer);
      if (outTimer) clearTimeout(outTimer);
      if (finishTimer) clearTimeout(finishTimer);
      clearTimeout(forceTimer);
    };
  }, [onFinish, durationMs]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${animateOut ? 'opacity-0' : 'opacity-100'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <style>
        {`
          @keyframes scan { 0% { transform: translateX(-120%); opacity: 0.0; } 20% { opacity: 0.4; } 100% { transform: translateX(120%); opacity: 0.0; } }
          @keyframes bgShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0% { transform: scale(0.9); opacity: .6 } 50% { transform: scale(1.05); opacity: 1 } 100% { transform: scale(0.9); opacity: .6 } }
          @keyframes twinkle { 0%,100% { opacity: .2 } 50% { opacity: .6 } }
          @keyframes sway { 0% { transform: rotate(-8deg) } 50% { transform: rotate(8deg) } 100% { transform: rotate(-8deg) } }
        `}
      </style>

      {/* Animated gradient background (deep navy -> teal) */}
      <div className="absolute inset-0 -z-10" style={{
        background: "linear-gradient(120deg, #2C3E50, #0f3d4a, #00B894)",
        backgroundSize: "200% 200%",
        animation: "bgShift 8s ease-in-out infinite"
      }} />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 28 }).map((_, i) => {
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const size = Math.random() * 2 + 1;
          const delay = Math.random() * 3000;
          return (
            <span key={i} className="absolute rounded-full bg-white/40" style={{ top: `${top}%`, left: `${left}%`, width: size, height: size, animation: `twinkle ${2000 + Math.random() * 2000}ms ease-in-out ${Math.round(delay)}ms infinite` }} />
          );
        })}
      </div>

      {/* Content */}
      <div className={`relative flex flex-col items-center select-none text-white font-poppins transition-all duration-700 ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {/* Step 1: Title + Tagline (matches reference) */}
        {phase === 1 && (
          <div className="flex flex-col items-center" style={{ transform: `translate3d(${tilt.ry * 1.0}px, ${-tilt.rx * 1.0}px, 0)`, transition: 'transform 120ms ease-out' }}>
            <div className="flex items-center gap-6">
              <div className="text-left">
                <div className="text-[44px] md:text-[64px] font-extrabold leading-none drop-shadow-[0_0_18px_rgba(0,184,148,0.35)]">
                  {line1.split("").map((ch, i) => (
                    <span key={`l1-${i}`} className={`inline-block text-white transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`} style={{ textShadow: '0 0 18px rgba(0,184,148,0.45)', transitionDelay: `${i * 28}ms` }}>{ch}</span>
                  ))}
                </div>
                <div className="text-[44px] md:text-[64px] font-extrabold leading-tight drop-shadow-[0_0_18px_rgba(0,184,148,0.35)]">
                  {line2.split("").map((ch, i) => (
                    <span key={`l2-${i}`} className={`inline-block text-white transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`} style={{ textShadow: '0 0 18px rgba(0,184,148,0.45)', transitionDelay: `${(i + line1.length) * 28}ms` }}>{ch}</span>
                  ))}
                </div>
              </div>
              {/* Compass icon */}
              <div className="relative h-20 w-20 md:h-24 md:w-24">
                <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: '#00B894', boxShadow: '0 0 24px rgba(0,184,148,0.45)' }} />
                <div className="absolute inset-1 rounded-full" style={{ boxShadow: 'inset 0 0 24px rgba(0,184,148,0.15)' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-8 w-8" style={{ animation: 'sway 2400ms ease-in-out infinite' }}>
                    <svg viewBox="0 0 100 100" className="absolute inset-0" fill="#00B894">
                      <circle cx="50" cy="50" r="4" fill="#00B894" />
                      <path d="M50 16 L56 50 L50 46 L44 50 Z" fill="#00B894" />
                      <path d="M50 84 L44 50 L50 54 L56 50 Z" fill="#00B894" opacity="0.9" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mx-auto mt-5">
              <p className={`text-base md:text-lg text-white/90 transition-all duration-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
                Guiding You Toward Your Perfect Career Path
              </p>
              <span className="pointer-events-none absolute left-0 right-0 -bottom-2 h-6 bg-gradient-to-r from-white/0 via-white/25 to-white/0 animate-[scan_1400ms_ease-out_1]" />
            </div>
          </div>
        )}

        {/* Step 2: Same composition with animated loader under text */}
        {phase === 2 && (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-6">
              <div className="text-left">
                <div className="text-[44px] md:text-[64px] font-extrabold leading-none drop-shadow-[0_0_18px_rgba(0,184,148,0.35)]">
                  {line1}
                </div>
                <div className="text-[44px] md:text-[64px] font-extrabold leading-tight drop-shadow-[0_0_18px_rgba(0,184,148,0.35)]">
                  {line2}
                </div>
              </div>
              {/* Compass icon with gentle spin */}
              <div className="relative h-20 w-20 md:h-24 md:w-24">
                <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: '#00B894', boxShadow: '0 0 24px rgba(0,184,148,0.45)' }} />
                <div className="absolute inset-1 rounded-full" style={{ boxShadow: 'inset 0 0 24px rgba(0,184,148,0.15)' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-8 w-8" style={{ animation: 'spin 2600ms linear infinite' }}>
                    <svg viewBox="0 0 100 100" className="absolute inset-0" fill="#00B894">
                      <circle cx="50" cy="50" r="4" fill="#00B894" />
                      <path d="M50 16 L56 50 L50 46 L44 50 Z" fill="#00B894" />
                      <path d="M50 84 L44 50 L50 54 L56 50 Z" fill="#00B894" opacity="0.9" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm md:text-base text-white/80 tracking-wide">
              Preparing Your Personalized Career Journey…
            </p>
            <div className="mt-4 h-1.5 w-64 overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-full rounded-full bg-[#00B894] animate-[scan_2200ms_ease-in-out] opacity-70" />
            </div>
          </div>
        )}

        {/* Bottom credit */}
        <div className="absolute bottom-8 inset-x-0 text-center text-[#BDC3C7] text-xs">
          Built & Developed by Sriram
        </div>
      </div>
    </div>
  );
}
