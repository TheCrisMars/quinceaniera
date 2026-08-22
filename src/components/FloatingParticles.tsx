"use client";

import { useEffect, useState } from "react";

interface Sparkle {
  id: number;
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
}

export default function FloatingParticles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    // Generate static random positions on client mount to avoid hydration mismatch
    const items: Sparkle[] = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.floor(Math.random() * 5) + 3,
      duration: Math.random() * 4 + 4,
      delay: Math.random() * 3,
    }));
    setSparkles(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: "radial-gradient(circle, #fff 20%, #ffd700 80%, transparent 100%)",
            boxShadow: "0 0 8px #ffe57f, 0 0 16px #ffca28",
            animation: `floatSparkle ${s.duration}s infinite ease-in-out ${s.delay}s`,
            opacity: 0,
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes floatSparkle {
          0% { transform: translateY(0) scale(0.4); opacity: 0; }
          50% { opacity: 0.85; transform: translateY(-35px) scale(1.1); }
          100% { transform: translateY(-70px) scale(0.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
