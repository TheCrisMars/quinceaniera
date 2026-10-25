"use client";

import PhotoMarquee from "@/components/PhotoMarquee";
import { CalendarPlus, MapPin } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import MusicPlayer from "../components/MusicPlayer";
import PhotoGallery from "../components/PhotoGallery";
import RsvpModal from "../components/RsvpModal";

// ── Countdown overlay for section 3 ────────────────────────────────────────
// Target: Saturday 21 November 2026 at 19:00 (America/Guayaquil = UTC-5)
const TARGET = new Date("2026-11-21T19:00:00-05:00").getTime();


function CountdownOverlay() {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function calc() {
      const diff = Math.max(0, TARGET - Date.now());
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
      setReady(true);
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  if (!ready) return null;

  const units = [
    { value: pad(time.d), label: "DÍAS" },
    { value: pad(time.h), label: "HORAS" },
    { value: pad(time.m), label: "MINUTOS" },
    { value: pad(time.s), label: "SEGUNDOS" },
  ];

  return (
    /* White banner that completely covers the static "OO | OO | OO | OO"
       numbers + labels printed in image 3 (starts ~79%, ends ~94%) */
    <div
      className="absolute left-0 right-0 flex items-center justify-center pointer-events-none select-none"
      style={{ top: "77%", height: "15%", background: "white" }}
    >
      <div className="w-full h-full flex items-center justify-center px-[6%]">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center" style={{ flex: 1 }}>
            {/* Column: number + label */}
            <div className="flex flex-col items-center w-full">
              <span
                className="font-serif italic leading-none"
                style={{
                  fontSize: "clamp(1.4rem, 5.5vw, 3rem)",
                  color: "#b8a0b8",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                }}
              >
                {unit.value}
              </span>
              <span
                style={{
                  fontSize: "clamp(0.45rem, 1.6vw, 0.75rem)",
                  color: "#9e82a0",
                  letterSpacing: "0.2em",
                  fontFamily: "sans-serif",
                  fontWeight: 600,
                  marginTop: "4px",
                }}
              >
                {unit.label}
              </span>
            </div>

            {/* Separator — shown between units, not after the last */}
            {i < units.length - 1 && (
              <span
                style={{
                  color: "#c8b0c8",
                  fontSize: "clamp(1rem, 4vw, 2rem)",
                  lineHeight: 1,
                  padding: "0 2px",
                  alignSelf: "center",
                  marginBottom: "14px",
                }}
              >
                |
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
function HomeContent() {
  useSearchParams();
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [introStarted, setIntroStarted] = useState(false);
  const introVideoRef = useRef<HTMLVideoElement | null>(null);

  /** Detects the OS and opens the right calendar without asking */
  const addToCalendarSmart = () => {
    const ua = navigator.userAgent;
    const isApple = /iPhone|iPad|iPod/i.test(ua);

    if (isApple) {
      // iOS → download .ics so it opens directly in Apple Calendar
      const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//XV Mar\u00eda Sol//ES",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:xv-mariasol-20261121@quinces`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z/, "Z")}`,
        "DTSTART;TZID=America/Guayaquil:20261121T190000",
        "DTEND;TZID=America/Guayaquil:20261122T030000",
        "SUMMARY:Mis XV \u00b7 Mar\u00eda Sol",
        "DESCRIPTION:Ser\u00e1 un honor contar con tu presencia en mis XV a\u00f1os.\\nFecha: S\u00e1bado 21 de noviembre de 2026 \u00b7 19:00 HRS.",
        "LOCATION:Club 24 de Julio\\, Av. Eloy Alfaro y Vicente Andrade\\, Chone",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");
      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "xv-mariasol.ics";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else {
      // Android, Windows, Mac, Linux → Google Calendar (works everywhere)
      const p = new URLSearchParams({
        action: "TEMPLATE",
        text: "Mis XV \u00b7 Mar\u00eda Sol",
        details: "Ser\u00e1 un honor contar con tu presencia en mis XV a\u00f1os.\nFecha: S\u00e1bado 21 de noviembre de 2026 \u00b7 19:00 HRS.",
        location: "Club 24 de Julio, Av. Eloy Alfaro y Vicente Andrade, Chone",
        dates: "20261121T190000/20261122T030000",
      });
      window.open(`https://calendar.google.com/calendar/render?${p.toString()}`, "_blank");
    }
  };

  const handleOpenMaps = () => {
    window.open("https://maps.app.goo.gl/CqPYjP24PRMffWpG6", "_blank");
  };

  return (
    <div className="relative min-h-screen w-full bg-pink-watercolor text-[#b04f94] overflow-x-hidden pb-10">
      {!introDone && (
        <div
          className={`fixed inset-0 z-50 bg-[#8d5c78] transition-opacity duration-500 ${introOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <div className="envelope-box">
            <video
              ref={introVideoRef}
              className="h-full w-full object-contain"
              preload="auto"
              playsInline
              muted
              onLoadedMetadata={(event) => {
                event.currentTarget.playbackRate = 1.4;
              }}
              onEnded={() => {
                setIntroOpen(true);
                setTimeout(() => setIntroDone(true), 450);
              }}
            >
              <source src="/video/animation.mp4" type="video/mp4" />
            </video>

            {!introOpen && !introStarted && (
              <button
                type="button"
                aria-label="Abrir la invitación"
                className="envelope-hotspot"
                onClick={() => {
                  const video = introVideoRef.current;
                  if (!video) return;
                  setIntroStarted(true);
                  video.currentTime = 0;
                  video.playbackRate = 1.4;
                  video.play().catch(() => { });
                }}
              >
              </button>
            )}
          </div>
        </div>
      )}

      <main className="relative w-full max-w-[620px] mx-auto py-5 sm:py-8 px-2 sm:px-4">
        <section className="relative w-full aspect-[1240/1748] rounded-2xl overflow-hidden shadow-md bg-white mb-4">
          <Image src="/images/1.png" alt="Sección 1" fill sizes="(max-width: 768px) 100vw, 620px" className="object-contain" quality={100} priority />
        </section>

        <section className="relative w-full aspect-[1240/1748] rounded-2xl overflow-hidden shadow-md bg-white mb-4">
          <Image src="/images/2.png" alt="Sección 2" fill sizes="(max-width: 768px) 100vw, 620px" className="object-contain" quality={100} />
          {/* Invisible hotspot over SÁBADO 21 NOVIEMBRE 19:00 HRS date block */}
          <button
            type="button"
            onClick={addToCalendarSmart}
            aria-label="Agendar en tu calendario"
            className="absolute top-[75%] left-[8%] w-[84%] h-[11%] cursor-pointer"
          >
            <span className="sr-only">Agendar en tu calendario</span>
          </button>
        </section>

        <section className="relative w-full aspect-[1240/1748] rounded-2xl overflow-hidden shadow-md bg-white mb-4">
          <Image src="/images/3.png" alt="Sección 3" fill sizes="(max-width: 768px) 100vw, 620px" className="object-contain" quality={100} />
          {/* Live countdown overlay — covers the static 00 numbers printed in the image */}
          <CountdownOverlay />
        </section>


        <section className="relative w-full aspect-[1240/1748] rounded-2xl overflow-hidden shadow-md bg-white mb-4">
          <Image
            src="/images/4.png"
            alt="Sección 4"
            fill
            sizes="(max-width: 768px) 100vw, 620px"
            className="object-contain"
            quality={100}
          />

          {/* Botón del calendario */}
          <button
            type="button"
            onClick={addToCalendarSmart}
            aria-label="Añadir al calendario"
            className="absolute top-[7%] left-[24%] w-[52%] h-[8%] rounded-lg"
          >
            <span className="sr-only">Añadir al calendario</span>
            <CalendarPlus className="w-4 h-4 opacity-0" />
          </button>

          {/* Galería: de borde a borde y pegada al fondo */}
          <div className="absolute inset-x-0 top-[49%] bottom-0 z-10">
            <PhotoGallery />
          </div>
        </section>

        <section className="relative w-full aspect-[1240/1748] rounded-2xl overflow-hidden shadow-md bg-white mb-4">
          <Image src="/images/5.png" alt="Sección 5" fill sizes="(max-width: 768px) 100vw, 620px" className="object-contain" quality={100} />
        </section>

        <section className="relative w-full aspect-[1240/1748] rounded-2xl overflow-hidden shadow-md bg-white mb-4">
          <Image
            src="/images/6.png"
            alt="Sección 6"
            fill
            sizes="(max-width: 800px) 100vw, 620px"
            className="object-contain"
            quality={100}
          />

          {/* Carrusel superior */}
          <div className="absolute inset-x-0 top-0 h-[40%] z-10">
            <PhotoMarquee />
          </div>

          <button
            type="button"
            onClick={handleOpenMaps}
            aria-label="Abrir Google Maps"
            className="absolute bottom-[2%] left-[25%] w-[50%] h-[5.7%] rounded-lg"
          >
            <span className="sr-only">Abrir Google Maps</span>
            <MapPin className="w-4 h-4 opacity-0" />
          </button>
        </section>

        <section className="relative w-full aspect-[1240/1748] rounded-2xl overflow-hidden shadow-md bg-white mb-4">
          <Image src="/images/7.png" alt="Sección 7" fill sizes="(max-width: 768px) 100vw, 620px" className="object-contain" quality={100} />
        </section>

        <section className="relative w-full aspect-[1240/1748] rounded-2xl overflow-hidden shadow-md bg-white mb-4">
          <Image src="/images/8.png" alt="Sección 8" fill sizes="(max-width: 768px) 100vw, 620px" className="object-contain" quality={100} />
          <button
            type="button"
            onClick={() => setRsvpOpen(true)}
            aria-label="Confirmar asistencia"
            className="absolute top-[31.5%] left-[33%] w-[34%] h-[5.6%] rounded-lg"
          >
            <span className="sr-only">Confirmar asistencia</span>
          </button>
        </section>
      </main>

      <RsvpModal open={rsvpOpen} onOpenChange={setRsvpOpen} />
      <MusicPlayer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
