"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Target date: September 19, 18:00:00 (current/next occurrence)
    const target = new Date("2026-09-19T18:00:00").getTime();

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

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
      <div className="flex flex-col items-center bg-white/60 backdrop-blur-xs border border-[#d4a359]/50 rounded-lg p-2 min-w-[58px] shadow-sm">
        <span className="font-mono font-bold text-2xl text-[#a47631] leading-none">
          {formatNumber(timeLeft.days)}
        </span>
        <span className="font-montserrat text-[0.65rem] font-semibold text-[#7d5b24] uppercase mt-1">
          Días
        </span>
      </div>

      <span className="text-[#be8e41] font-bold text-lg -mt-3">:</span>

      <div className="flex flex-col items-center bg-white/60 backdrop-blur-xs border border-[#d4a359]/50 rounded-lg p-2 min-w-[58px] shadow-sm">
        <span className="font-mono font-bold text-2xl text-[#a47631] leading-none">
          {formatNumber(timeLeft.hours)}
        </span>
        <span className="font-montserrat text-[0.65rem] font-semibold text-[#7d5b24] uppercase mt-1">
          Horas
        </span>
      </div>

      <span className="text-[#be8e41] font-bold text-lg -mt-3">:</span>

      <div className="flex flex-col items-center bg-white/60 backdrop-blur-xs border border-[#d4a359]/50 rounded-lg p-2 min-w-[58px] shadow-sm">
        <span className="font-mono font-bold text-2xl text-[#a47631] leading-none">
          {formatNumber(timeLeft.minutes)}
        </span>
        <span className="font-montserrat text-[0.65rem] font-semibold text-[#7d5b24] uppercase mt-1">
          Min
        </span>
      </div>

      <span className="text-[#be8e41] font-bold text-lg -mt-3">:</span>

      <div className="flex flex-col items-center bg-white/60 backdrop-blur-xs border border-[#d4a359]/50 rounded-lg p-2 min-w-[58px] shadow-sm">
        <span className="font-mono font-bold text-2xl text-[#a47631] leading-none">
          {formatNumber(timeLeft.seconds)}
        </span>
        <span className="font-montserrat text-[0.65rem] font-semibold text-[#7d5b24] uppercase mt-1">
          Seg
        </span>
      </div>
    </div>
  );
}
