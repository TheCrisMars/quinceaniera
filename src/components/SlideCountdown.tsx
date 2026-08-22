"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function SlideCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Target date: September 19, 2026, 18:00:00 (or current year)
    let target = new Date("2026-09-19T18:00:00").getTime();
    if (isNaN(target) || target < Date.now()) {
      const nextYear = new Date().getFullYear();
      target = new Date(`${nextYear}-09-19T18:00:00`).getTime();
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (!mounted) {
    return (
      <div className="font-orbitron font-bold text-2xl sm:text-3xl md:text-4xl text-[#b88330] tracking-widest flex items-center justify-center gap-1 sm:gap-2">
        <span>00</span>:<span>00</span>:<span>00</span>:<span>00</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center select-none">
      {/* Digital segmented display matching slide 4 mockup */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 px-3 py-1.5 rounded-xl bg-white/70 backdrop-blur-xs border border-[#dfb56c]/60 shadow-[0_4px_15px_rgba(212,163,89,0.25)]">
        
        {/* Days */}
        <div className="flex flex-col items-center">
          <span className="font-orbitron font-extrabold text-xl sm:text-2xl md:text-3xl text-[#a87424] tracking-wider drop-shadow-xs">
            {pad(timeLeft.days)}
          </span>
          <span className="font-montserrat text-[9px] sm:text-[10px] font-bold text-[#8c6220] uppercase tracking-wider">
            Días
          </span>
        </div>

        <span className="font-orbitron font-bold text-lg sm:text-xl md:text-2xl text-[#cba158] -mt-3.5 animate-pulse">
          :
        </span>

        {/* Hours */}
        <div className="flex flex-col items-center">
          <span className="font-orbitron font-extrabold text-xl sm:text-2xl md:text-3xl text-[#a87424] tracking-wider drop-shadow-xs">
            {pad(timeLeft.hours)}
          </span>
          <span className="font-montserrat text-[9px] sm:text-[10px] font-bold text-[#8c6220] uppercase tracking-wider">
            Horas
          </span>
        </div>

        <span className="font-orbitron font-bold text-lg sm:text-xl md:text-2xl text-[#cba158] -mt-3.5 animate-pulse">
          :
        </span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <span className="font-orbitron font-extrabold text-xl sm:text-2xl md:text-3xl text-[#a87424] tracking-wider drop-shadow-xs">
            {pad(timeLeft.minutes)}
          </span>
          <span className="font-montserrat text-[9px] sm:text-[10px] font-bold text-[#8c6220] uppercase tracking-wider">
            Min
          </span>
        </div>

        <span className="font-orbitron font-bold text-lg sm:text-xl md:text-2xl text-[#cba158] -mt-3.5 animate-pulse">
          :
        </span>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <span className="font-orbitron font-extrabold text-xl sm:text-2xl md:text-3xl text-[#a87424] tracking-wider drop-shadow-xs">
            {pad(timeLeft.seconds)}
          </span>
          <span className="font-montserrat text-[9px] sm:text-[10px] font-bold text-[#8c6220] uppercase tracking-wider">
            Seg
          </span>
        </div>
      </div>
    </div>
  );
}
