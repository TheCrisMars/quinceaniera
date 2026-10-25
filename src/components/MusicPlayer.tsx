"use client";

import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.8;

    const tryAutoPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      } finally {
        setReady(true);
      }
    };

    tryAutoPlay();
  }, []);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  return (
    <>
      <audio ref={audioRef} loop preload="auto" playsInline aria-hidden="true">
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      {ready && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="fixed bottom-5 right-5 z-40"
        >
          <button
            onClick={toggleAudio}
            type="button"
            title={isPlaying ? "Pausar música" : "Reproducir música"}
            aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
            className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-full border-2 border-[#dfb56c] shadow-[0_8px_25px_rgba(180,130,50,0.35)] backdrop-blur-md transition-all duration-300 cursor-pointer select-none ${isPlaying
              ? "bg-white/90 text-[#cca048] hover:bg-white"
              : "bg-white/80 text-[#8c6220] hover:bg-white/95"
              }`}
          >
            <div
              className={`relative w-7 h-7 rounded-full bg-gradient-to-tr from-[#cca048] to-[#f0c268] flex items-center justify-center ${isPlaying ? "animate-spin" : ""
                }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>

            {isPlaying ? (
              <Pause className="w-4 h-4 text-[#cca048]" />
            ) : (
              <Play className="w-4 h-4 text-[#cca048] fill-[#cca048] ml-0.5" />
            )}

            <span className="font-montserrat font-bold text-[11px] text-[#4a3528] hidden sm:inline-block pr-1">
              {isPlaying ? "Música Sonando" : "Música Pausada"}
            </span>

            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#cca048] opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#cca048]" />
              </span>
            )}
          </button>
        </motion.div>
      )}
    </>
  );
}
