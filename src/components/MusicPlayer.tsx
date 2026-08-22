"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Volume2, VolumeX, Play, Pause } from "lucide-react";

export default function MusicPlayer() {
  const [showPrompt, setShowPrompt] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Timestamp del último toggle — nada puede resetear esto
  const lastActionRef = useRef(0);

  const playBtnRef = useRef<HTMLButtonElement | null>(null);
  const declineBtnRef = useRef<HTMLButtonElement | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

  // Handler nativo para el botón "Sí, reproducir música"
  useEffect(() => {
    const btn = playBtnRef.current;
    if (!btn) return;

    const handler = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      const now = Date.now();
      if (now - lastActionRef.current < 1000) return;
      lastActionRef.current = now;

      const audio = audioRef.current;
      if (!audio) return;

      audio.muted = false;
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});

      setShowPrompt(false);
      setHasAnswered(true);
    };

    btn.addEventListener("touchend", handler, { passive: false });
    btn.addEventListener("click", handler);

    return () => {
      btn.removeEventListener("touchend", handler);
      btn.removeEventListener("click", handler);
    };
  }, [showPrompt]);

  // Handler nativo para el botón "No, continuar en silencio"
  useEffect(() => {
    const btn = declineBtnRef.current;
    if (!btn) return;

    const handler = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      const now = Date.now();
      if (now - lastActionRef.current < 1000) return;
      lastActionRef.current = now;

      const audio = audioRef.current;
      if (audio) audio.pause();

      setIsPlaying(false);
      setShowPrompt(false);
      setHasAnswered(true);
    };

    btn.addEventListener("touchend", handler, { passive: false });
    btn.addEventListener("click", handler);

    return () => {
      btn.removeEventListener("touchend", handler);
      btn.removeEventListener("click", handler);
    };
  }, [showPrompt]);

  // Handler nativo para el botón flotante play/pause
  useEffect(() => {
    const btn = toggleBtnRef.current;
    if (!btn) return;

    const handler = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      const now = Date.now();
      if (now - lastActionRef.current < 1000) return;
      lastActionRef.current = now;

      const audio = audioRef.current;
      if (!audio) return;

      // Leer el estado REAL del elemento de audio en el DOM
      if (audio.paused) {
        audio.muted = false;
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    };

    btn.addEventListener("touchend", handler, { passive: false });
    btn.addEventListener("click", handler);

    return () => {
      btn.removeEventListener("touchend", handler);
      btn.removeEventListener("click", handler);
    };
  }, [hasAnswered, isPlaying]);

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="auto"
        playsInline
        aria-hidden="true"
      >
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      {/* MODAL INICIAL */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#fffcf8] to-[#fff6e9] border-2 border-[#dfb56c] p-6 sm:p-7 shadow-[0_20px_50px_rgba(180,130,50,0.3)] text-center overflow-hidden"
            >
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#dfb56c]/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#e91e8c]/15 rounded-full blur-2xl" />

              <div className="relative mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-[#f0c268] to-[#e5b350] p-0.5 shadow-lg mb-4 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-white/90 flex items-center justify-center">
                  <Music className="w-8 h-8 text-[#cca048] animate-bounce" />
                </div>
              </div>

              <h2 className="font-montserrat font-extrabold text-[11px] sm:text-xs tracking-[3px] uppercase text-[#cca048] mb-1">
                Mis XV Años &bull; Almudena
              </h2>

              <h3 className="font-cormorant font-bold text-2xl sm:text-3xl text-[#2e1f14] leading-tight mb-2">
                ¿Deseas activar la música de fondo?
              </h3>

              <p className="font-montserrat text-xs text-[#6e543c] italic mb-6">
                &ldquo;NUEVAYoL&rdquo; &bull; Bad Bunny
              </p>

              <div className="flex flex-col gap-2.5">
                <button
                  ref={playBtnRef}
                  type="button"
                  className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-[#f0c268] via-[#e5b350] to-[#cca048] text-white font-montserrat font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer touch-manipulation select-none"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Sí, reproducir música</span>
                </button>

                <button
                  ref={declineBtnRef}
                  type="button"
                  className="w-full py-2.5 px-5 rounded-2xl border border-[#dfb56c]/60 hover:bg-[#dfb56c]/10 text-[#5d4037] font-montserrat font-semibold text-xs transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none"
                >
                  <VolumeX className="w-4 h-4 text-[#8d6e63]" />
                  <span>No, continuar en silencio</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTÓN FLOTANTE */}
      {hasAnswered && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="fixed bottom-5 right-5 z-40"
        >
          <button
            ref={toggleBtnRef}
            type="button"
            title={isPlaying ? "Pausar música" : "Reproducir música"}
            aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
            className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-full border-2 border-[#dfb56c] shadow-[0_8px_25px_rgba(180,130,50,0.35)] backdrop-blur-md transition-all duration-300 cursor-pointer touch-manipulation select-none ${
              isPlaying
                ? "bg-white/90 text-[#cca048] hover:bg-white"
                : "bg-white/80 text-[#8c6220] hover:bg-white/95"
            }`}
          >
            <div
              className={`relative w-7 h-7 rounded-full bg-gradient-to-tr from-[#cca048] to-[#f0c268] flex items-center justify-center ${
                isPlaying ? "animate-spin" : ""
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
