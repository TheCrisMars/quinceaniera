"use client";

import PhotoMarquee from "@/components/PhotoMarquee";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import MusicPlayer from "../components/MusicPlayer";
import PhotoGallery from "../components/PhotoGallery";
import { supabase } from "@/lib/supabase";

// ── Countdown overlay for section 3 ────────────────────────────────────────
// Target: Saturday 21 November 2026 at 19:00 (America/Guayaquil = UTC-5)
const TARGET = new Date("2026-11-21T19:00:00-05:00").getTime();

type StaticImageSectionProps = {
  src: string;
  number: number;
  priority?: boolean;
};

function StaticImageSection({ src, number, priority = false }: StaticImageSectionProps) {
  return (
    <section className="relative mb-4 aspect-[1240/1748] w-full overflow-hidden rounded-2xl bg-white shadow-md">
      <Image
        src={src}
        alt={`Sección ${number}`}
        fill
        sizes="(max-width: 768px) 100vw, 620px"
        className="object-contain"
        quality={100}
        priority={priority}
      />
    </section>
  );
}

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
      style={{ top: "79%", height: "15%", background: "white" }}
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
  const searchParams = useSearchParams();
  const [showAttendanceOptions, setShowAttendanceOptions] = useState(false);
  const [attendanceCount, setAttendanceCount] = useState(1);
  const [introOpen, setIntroOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [introStarted, setIntroStarted] = useState(false);
  const introVideoRef = useRef<HTMLVideoElement | null>(null);
  const guestToken = searchParams.get("invitado");
  const [guest, setGuest] = useState<{
    id: string;
    name: string;
    max_companions: number;
  } | null>(null);
  const [attendanceResponse, setAttendanceResponse] = useState<"pending" | "yes" | "no">("pending");
  const [savingRsvp, setSavingRsvp] = useState(false);
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [showBankCard, setShowBankCard] = useState(false);
  const [accountCopied, setAccountCopied] = useState(false);

  const saveRsvp = async (confirmed: boolean, companionsCount = 0) => {
    if (!guest?.id || savingRsvp) return;

    setSavingRsvp(true);
    setRsvpMessage("");

    const safeCount = Math.min(
      Math.max(1, companionsCount),
      Math.max(1, guest.max_companions)
    );

    try {
      const payload = {
        guest_id: guest.id,
        confirmed,
        companions_count: confirmed ? safeCount : 0,
      };

      const { data: existing, error: selectError } = await supabase
        .from("rsvps")
        .select("guest_id")
        .eq("guest_id", guest.id)
        .maybeSingle();

      if (selectError) throw selectError;

      const result = existing
        ? await supabase
          .from("rsvps")
          .update(payload)
          .eq("guest_id", guest.id)
        : await supabase.from("rsvps").insert(payload);

      if (result.error) throw result.error;

      setAttendanceResponse(confirmed ? "yes" : "no");
      setRsvpMessage(
        confirmed
          ? "¡Gracias por confirmar tu asistencia!"
          : "Lamentamos que no puedas acompañarnos. ¡Te tendremos presente en este día tan especial!"
      );
    } catch (error) {
      console.error("Error al guardar la respuesta:", error);
      setRsvpMessage("No pudimos guardar tu respuesta. Inténtalo nuevamente.");
    } finally {
      setSavingRsvp(false);
    }
  };


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

  useEffect(() => {
    async function loadGuest() {
      if (!guestToken) {
        setGuest(null);
        return;
      }

      const { data, error } = await supabase
        .from("guests")
        .select("id, name, max_companions")
        .eq("token", guestToken)
        .maybeSingle();

      if (error) {
        console.error("Error al cargar el invitado:", error);
        return;
      }

      setGuest(data);
    }

    loadGuest();
  }, [guestToken]);

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
              poster="/images/sobre-poster.jpg"
              preload="metadata"
              playsInline
              muted
              onLoadedMetadata={(event) => {
                event.currentTarget.muted = true; // fuerza el muted en iOS
                event.currentTarget.playbackRate = 1.4;
              }}
              onEnded={() => {
                setIntroOpen(true);
                setTimeout(() => setIntroDone(true), 450);
              }}
            >
              <source src="/video/animation.mp4#t=0.001" type="video/mp4" />
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
                  video.muted = true;
                  video.playbackRate = 1.4;
                  video.play().catch(() => {
                    setIntroOpen(true);
                    setTimeout(() => setIntroDone(true), 450);
                  });
                }}
              >
              </button>
            )}
          </div>
        </div>
      )}

      <main className="relative w-full max-w-[620px] mx-auto py-5 sm:py-8 px-2 sm:px-4">
        <StaticImageSection src="/images/1.png" number={1} priority />

        <StaticImageSection src="/images/2.png" number={2} />

        <section className="relative w-full aspect-[1240/1748] rounded-2xl overflow-hidden shadow-md bg-white mb-4">
          <Image src="/images/3.png" alt="Sección 3" fill sizes="(max-width: 768px) 100vw, 620px" className="object-contain" quality={100} />
          {/* Live countdown overlay — covers the static 00 numbers printed in the image */}
          <CountdownOverlay />

          {/* Invisible hotspot over SÁBADO 21 NOVIEMBRE 19:00 HRS date block */}
          <button
            type="button"
            onClick={addToCalendarSmart}
            aria-label="Agendar en tu calendario"
            className="absolute top-[50%] left-[8%] w-[84%] h-[11%] cursor-pointer"
          >
            <span className="sr-only">Agendar en tu calendario</span>
          </button>
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

          {/* Galería: de borde a borde y pegada al fondo */}
          <div className="absolute inset-x-0 top-[45%] bottom-0 z-10">
            <PhotoGallery />
          </div>
        </section>

        <StaticImageSection src="/images/5.png" number={5} />

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

        <StaticImageSection src="/images/7.png" number={7} />

        <section className="relative w-full aspect-[1240/1748] rounded-2xl overflow-hidden shadow-md bg-white mb-4">
          <Image
            src="/images/8.png"
            alt="Sección 8"
            fill
            sizes="(max-width: 768px) 100vw, 620px"
            className="object-contain"
            quality={100}
          />

          {/* Botón invisible: abrir datos bancarios */}
          <button
            type="button"
            onClick={() => setShowBankCard(true)}
            aria-label="Ver datos bancarios"
            className="absolute top-[37%] left-[10%] w-[80%] h-[8%] cursor-pointer"
          >
            <span className="sr-only">Ver datos bancarios</span>
          </button>

        </section>

        {showBankCard && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
            onClick={() => setShowBankCard(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="bank-card-title"
              className="relative w-full max-w-sm rounded-3xl border border-[#D8B56D] bg-[#FFFBFD] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowBankCard(false)}
                aria-label="Cerrar datos bancarios"
                className="absolute right-4 top-3 text-3xl text-[#75476F]"
              >
                &times;
              </button>

              <p className="mb-2 text-center text-sm tracking-[0.2em] text-[#B58B43]">
                INFORMACIÓN
              </p>

              <h2
                id="bank-card-title"
                className="mb-5 text-center font-serif text-2xl font-bold text-[#75476F]"
              >
                Datos bancarios
              </h2>

              <div className="space-y-3 rounded-2xl bg-white p-4 text-sm text-[#75476F]">
                <p><strong>Banco:</strong> Banco Guayaquil</p>
                <p><strong>Cedula:</strong> 1316913233</p>
                <p><strong>Titular:</strong> María Solorzano</p>
                <p><strong>Tipo de cuenta:</strong> Ahorros</p>
                <p><strong>N.º de cuenta:</strong> 62539105</p>
                <p>
                  <strong>Número para enviar el comprobante:</strong>{" "}
                  <a
                    href="https://wa.me/59398198900"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#B58B43] underline hover:text-[#75476F]"
                  >
                    098198900
                  </a>
                </p>
              </div>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText("62539105");
                    setAccountCopied(true);
                    setTimeout(() => setAccountCopied(false), 2500);
                  } catch (error) {
                    console.error("No se pudo copiar el número de cuenta:", error);
                  }
                }}
                className="mt-4 w-full rounded-full border border-[#D8B56D] bg-white px-4 py-3 font-semibold text-[#75476F] transition hover:bg-[#FFF3E0] active:scale-95"
              >
                {accountCopied ? "¡Número copiado! ✓" : "Copiar número de cuenta"}
              </button>

              <button
                type="button"
                onClick={() => setShowBankCard(false)}
                className="mt-5 w-full rounded-full bg-gradient-to-r from-[#C69BCB] to-[#D8B56D] px-4 py-3 font-semibold text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {guest && (
          <section
            className="relative w-full"
            id="seccion-9"
          >
            <Image
              src="/images/9.png"
              alt="Invitación especial"
              width={1080}
              height={1920}
              className="block h-auto w-full"
              priority={false}
            />
            <div className="absolute inset-x-0 top-[28%] flex justify-center px-3 sm:px-6">
              <div className="w-full max-w-[300px] origin-top scale-90 rounded-3xl border border-[#D8B56D] bg-[#FFFBFD]/90 px-4 py-4 text-center shadow-xl sm:max-w-xs">
                <p className="font-serif text-lg font-bold uppercase tracking-wide text-[#75476F]">
                  {guest.name}
                </p>

                <p className="mt-5 font-serif text-xs tracking-[0.2em] text-[#96728E]">
                  HEMOS RESERVADO
                </p>

                <p className="mt-2 font-serif text-6xl text-[#B58B43]">
                  {guest.max_companions}
                </p>

                <p className="font-serif text-2xl tracking-[0.18em] text-[#75476F]">
                  PASES
                </p>

                <p className="mt-3 font-serif text-xs tracking-[0.18em] text-[#96728E]">
                  EN SU HONOR
                </p>

                <div className="mx-auto my-6 flex w-3/4 items-center gap-3">
                  <div className="h-px flex-1 bg-[#E8D4B0]" />
                  <span className="text-sm text-[#C49A50]">✦</span>
                  <div className="h-px flex-1 bg-[#E8D4B0]" />
                </div>

                <p className="mb-4 text-sm text-[#75476F]">
                  ¿Nos acompañarás en este día especial?
                </p>

                {attendanceResponse === "pending" ? (
                  <>
                    <div className="flex w-full gap-2">
                      <button
                        type="button"
                        disabled={savingRsvp}
                        onClick={() => setShowAttendanceOptions(true)}
                        className="flex-1 rounded-full border border-[#B99ACD] bg-[#F2E8F7] px-3 py-3 text-sm font-medium text-[#75476F] transition hover:bg-[#E8D7F0] active:scale-95 disabled:opacity-60"
                      >
                        Sí, asistiré
                      </button>
                      <button
                        type="button"
                        disabled={savingRsvp}
                        onClick={() => saveRsvp(false)}
                        className="flex-1 rounded-full border border-[#E4B4C9] bg-[#FCEAF1] px-3 py-3 text-sm font-medium text-[#98516F] transition hover:bg-[#F7DCE8] active:scale-95 disabled:opacity-60"
                      >
                        No podré asistir
                      </button>
                    </div>

                    {showAttendanceOptions && (
                      <div className="mt-5 rounded-2xl border border-[#E8D4B0] bg-white/80 p-4">
                        <label htmlFor="attendance-count" className="block text-sm font-medium text-[#75476F]">
                          ¿Cuántas personas asistirán?
                        </label>
                        <select
                          id="attendance-count"
                          value={attendanceCount}
                          onChange={(e) => setAttendanceCount(Number(e.target.value))}
                          className="mt-3 w-full rounded-xl border border-[#D8B56D] bg-white px-4 py-3 text-center text-[#75476F] outline-none focus:ring-2 focus:ring-[#B99ACD]"
                        >
                          {Array.from({ length: Math.max(1, guest.max_companions) }, (_, i) => i + 1).map((count) => (
                            <option key={count} value={count}>
                              {count} {count === 1 ? "persona" : "personas"}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          disabled={savingRsvp}
                          onClick={() => saveRsvp(true, attendanceCount)}
                          className="mt-3 w-full rounded-full bg-gradient-to-r from-[#C69BCB] to-[#D8B56D] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95 disabled:opacity-60"
                        >
                          {savingRsvp ? "Guardando..." : "Confirmar asistencia"}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-5 rounded-2xl border border-[#E8D4B0] bg-white/80 p-4">
                    <p className="font-serif text-lg font-semibold text-[#75476F]">
                      {attendanceResponse === "yes" ? "¡Gracias por confirmar! 💖" : "¡Te extrañaremos!"}
                    </p>
                    <p className="mt-2 text-sm text-[#75476F]">{rsvpMessage}</p>
                  </div>
                )}

                {attendanceResponse === "pending" && rsvpMessage && (
                  <p role="alert" className="mt-3 text-sm text-red-700">{rsvpMessage}</p>
                )}

                <p className="mt-4 text-xs text-[#A18478]">
                  Será un placer compartir este momento contigo.
                </p>
              </div>
            </div>
          </section>
        )}


      </main>

      <footer className="relative z-10 mx-auto mt-2 w-full max-w-[620px] px-4 pb-8 pt-5 text-center">
        <div className="mx-auto mb-3 flex max-w-[180px] items-center gap-3">
          <span className="h-px flex-1 bg-[#D8B56D]/70" />
          <span className="text-sm text-[#B58B43]">✦</span>
          <span className="h-px flex-1 bg-[#D8B56D]/70" />
        </div>
        <p className="font-serif text-sm text-[#75476F]">
          Página hecha con cariño por
        </p>
        <p className="mt-1 text-xs font-semibold tracking-[0.18em] text-[#A66B91]">
          OC INVITACIONES DIGITALES
        </p>
        <p className="mt-1 text-xs font-semibold tracking-[0.18em] text-[#A66B91]">
          +593995528671
        </p>
      </footer>

      <MusicPlayer start={introOpen} />
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
