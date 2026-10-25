"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays } from "lucide-react";

interface CalendarModalProps {
  open: boolean;
  onClose: () => void;
}

// ── Event data ──────────────────────────────────────────────
const EVENT = {
  title: "Mis XV · María Sol",
  description:
    "Será un honor contar con tu presencia en mis XV años.\nFecha: Sábado 21 de noviembre de 2026 · 19:00 HRS.",
  location: "Club 24 de Julio, Av. Eloy Alfaro y Vicente Andrade, Chone",
  startLocal: "20261121T190000",
  endLocal: "20261122T030000",
};

// ── Calendar URL builders ────────────────────────────────────
function googleUrl() {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT.title,
    details: EVENT.description,
    location: EVENT.location,
    dates: `${EVENT.startLocal}/${EVENT.endLocal}`,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

function outlookUrl() {
  const p = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: EVENT.title,
    body: EVENT.description,
    location: EVENT.location,
    startdt: "2026-11-21T19:00:00",
    enddt: "2026-11-22T03:00:00",
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${p.toString()}`;
}

function generateIcs() {
  const uid = `xv-mariasol-20261121@quinces`;
  const now = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z/, "Z");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//XV María Sol//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=America/Guayaquil:${EVENT.startLocal}`,
    `DTEND;TZID=America/Guayaquil:${EVENT.endLocal}`,
    `SUMMARY:${EVENT.title}`,
    `DESCRIPTION:${EVENT.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${EVENT.location}`,
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
}

// ── Option cards ─────────────────────────────────────────────
const OPTIONS = [
  {
    id: "google",
    label: "Google Calendar",
    sublabel: "Android · PC",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" aria-hidden="true">
        <rect x="6" y="6" width="36" height="36" rx="4" fill="#fff" stroke="#e5e7eb" strokeWidth="1.5" />
        <rect x="6" y="6" width="36" height="13" rx="4" fill="#4285F4" />
        <rect x="6" y="15" width="36" height="4" fill="#4285F4" />
        <text x="24" y="37" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1a1a1a" fontFamily="Arial">21</text>
        <text x="24" y="22" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#fff" fontFamily="Arial">NOV</text>
        <circle cx="15" cy="9" r="2" fill="#fff" opacity=".9" />
        <circle cx="33" cy="9" r="2" fill="#fff" opacity=".9" />
      </svg>
    ),
    action: () => window.open(googleUrl(), "_blank"),
    bg: "from-[#4285F4]/10 to-[#34A853]/10",
    border: "border-[#4285F4]/30",
    hover: "hover:border-[#4285F4]/60 hover:shadow-[0_4px_20px_rgba(66,133,244,0.25)]",
  },
  {
    id: "apple",
    label: "Apple Calendar",
    sublabel: "iPhone · iPad · Mac",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" aria-hidden="true">
        <rect x="6" y="6" width="36" height="36" rx="8" fill="#fff" stroke="#e5e7eb" strokeWidth="1.5" />
        <rect x="6" y="6" width="36" height="13" rx="4" fill="#FF3B30" />
        <rect x="6" y="15" width="36" height="4" fill="#FF3B30" />
        <text x="24" y="37" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1a1a1a" fontFamily="Arial">21</text>
        <text x="24" y="22" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#fff" fontFamily="Arial">NOV</text>
        <circle cx="15" cy="9" r="2" fill="#fff" opacity=".9" />
        <circle cx="33" cy="9" r="2" fill="#fff" opacity=".9" />
      </svg>
    ),
    action: generateIcs,
    bg: "from-[#FF3B30]/10 to-[#FF9500]/10",
    border: "border-[#FF3B30]/30",
    hover: "hover:border-[#FF3B30]/60 hover:shadow-[0_4px_20px_rgba(255,59,48,0.2)]",
  },
  {
    id: "outlook",
    label: "Outlook / PC",
    sublabel: "Windows · Web",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" aria-hidden="true">
        <rect x="6" y="6" width="36" height="36" rx="6" fill="#0072C6" />
        <rect x="14" y="13" width="20" height="22" rx="2" fill="#fff" />
        <rect x="14" y="13" width="20" height="8" rx="2" fill="#0072C6" />
        <text x="24" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0072C6" fontFamily="Arial">21</text>
        <text x="24" y="22" textAnchor="middle" fontSize="6" fontWeight="600" fill="#fff" fontFamily="Arial">NOV</text>
      </svg>
    ),
    action: () => window.open(outlookUrl(), "_blank"),
    bg: "from-[#0072C6]/10 to-[#00B4F0]/10",
    border: "border-[#0072C6]/30",
    hover: "hover:border-[#0072C6]/60 hover:shadow-[0_4px_20px_rgba(0,114,198,0.25)]",
  },
];

// ── Component ────────────────────────────────────────────────
export default function CalendarModal({ open, onClose }: CalendarModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
          style={{ background: "rgba(120,60,90,0.55)", backdropFilter: "blur(6px)" }}
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        >
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#b04f94] to-[#d4609f] px-6 pt-6 pb-5 text-white text-center relative">
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5" />
                </div>
              </div>
              <h2 className="font-bold text-lg leading-tight">Agendar Evento</h2>
              <p className="text-white/80 text-sm mt-0.5">
                Sábado 21 · Noviembre 2026 · 19:00 HRS
              </p>
            </div>

            {/* Options */}
            <div className="p-5 flex flex-col gap-3">
              <p className="text-center text-[#6b3d5a] text-xs font-medium mb-1">
                Selecciona tu calendario
              </p>
              {OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    opt.action();
                    onClose();
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl border bg-gradient-to-r ${opt.bg} ${opt.border} ${opt.hover} transition-all duration-200 cursor-pointer active:scale-[0.97] text-left`}
                >
                  <div className="flex-shrink-0">{opt.icon}</div>
                  <div>
                    <p className="font-semibold text-[#2d1a26] text-sm leading-tight">
                      {opt.label}
                    </p>
                    <p className="text-[#8a5070] text-xs mt-0.5">{opt.sublabel}</p>
                  </div>
                  <svg
                    className="ml-auto w-4 h-4 text-[#c090b0] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Footer note */}
            <p className="text-center text-[#c090b0] text-[11px] pb-5 px-6 -mt-1">
              Apple Calendar descargará un archivo .ics compatible
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
