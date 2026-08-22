"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle, XCircle, Loader2, Edit3 } from "lucide-react";
import { supabase, type Guest, type Rsvp } from "@/lib/supabase";

interface ItineraryCardProps {
  onOpenRsvp: () => void;
  invitadoToken?: string | null;
}

const itineraryItems = [
  { time: "18:00", label: "Recepción" },
  { time: "19:00", label: "Entrada de la Quinceañera" },
  { time: "20:00", label: "Fotografía" },
  { time: "21:00", label: "Apertura de la pista de baile" },
  { time: "23:00", label: "Banquete" },
  { time: "00:00", label: "Hora Loca" },
  { time: "02:00", label: "Despedida" },
];

export default function ItineraryCard({ onOpenRsvp, invitadoToken }: ItineraryCardProps) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [rsvp, setRsvp] = useState<Rsvp | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  // Selected number of people attending (default to max capacity)
  const [selectedAttending, setSelectedAttending] = useState(1);

  useEffect(() => {
    if (!invitadoToken) return;

    async function loadGuestData() {
      setLoading(true);
      const { data: guestData } = await supabase
        .from("guests")
        .select("*")
        .eq("token", invitadoToken)
        .single();

      if (guestData) {
        setGuest(guestData as Guest);
        const maxCap = (guestData as Guest).max_companions + 1;
        setSelectedAttending(maxCap);

        const { data: rsvpData } = await supabase
          .from("rsvps")
          .select("*")
          .eq("guest_id", guestData.id)
          .single();

        if (rsvpData) {
          setRsvp(rsvpData as Rsvp);
          if ((rsvpData as Rsvp).confirmed) {
            setSelectedAttending((rsvpData as Rsvp).companions_count + 1);
          }
        }
      }
      setLoading(false);
    }

    loadGuestData();
  }, [invitadoToken]);

  // Handle confirm with specific count (0 = decline)
  const handleConfirmAction = async (attendingCount: number) => {
    if (!guest) return;
    setConfirming(true);

    const isAttending = attendingCount > 0;
    const companionsCount = isAttending ? Math.max(0, attendingCount - 1) : 0;

    const rsvpPayload = {
      guest_id: guest.id,
      confirmed: isAttending,
      companions_count: companionsCount,
      message: null,
    };

    const { data, error } = await supabase
      .from("rsvps")
      .upsert(rsvpPayload, { onConflict: "guest_id" })
      .select()
      .single();

    setConfirming(false);

    if (!error && data) {
      setRsvp(data as Rsvp);
      setShowSelector(false);

      if (isAttending) {
        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.7 },
            colors: ["#dfb56c", "#f48fb1", "#ffd700", "#e91e8c"],
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const maxTotalAllowed = guest ? guest.max_companions + 1 : 1;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
      className="relative w-full aspect-[640/896] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(180,130,50,0.18)] border border-[#dfb56c]/40 bg-white select-none"
    >
      <Image
        src="/slide_template.png"
        alt="Plantilla Itinerario y Confirmación"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 620px"
        className="object-cover"
      />

      {/* 1. Title: ITINERARIO DE ACTIVIDADES */}
      <div className="absolute top-[28%] left-0 right-0 flex justify-center px-6">
        <h2 className="font-montserrat font-extrabold text-[12px] sm:text-sm md:text-[15px] tracking-[3px] sm:tracking-[4px] uppercase text-[#cca048] italic text-center drop-shadow-xs">
          ITINERARIO DE ACTIVIDADES
        </h2>
      </div>

      {/* 2. List of 7 Events */}
      {itineraryItems.map((item, idx) => (
        <div
          key={idx}
          className="absolute left-0 right-0 flex justify-center px-8"
          style={{ top: `${33.5 + idx * 4.3}%` }}
        >
          <div className="w-full max-w-[290px] sm:max-w-[340px] flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-[60px] sm:w-[72px] py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-[#f0c268] to-[#e5b350] text-white font-montserrat font-extrabold text-[9px] sm:text-xs text-center shadow-xs flex-shrink-0">
              {item.time}
            </div>
            <div className="font-cormorant font-bold text-xs sm:text-base md:text-lg text-[#3b2b24] tracking-wide truncate">
              {item.label}
            </div>
          </div>
        </div>
      ))}

      {/* 3. Title: CONFIRMA TU ASISTENCIA */}
      <div className="absolute top-[63.5%] left-0 right-0 flex justify-center px-4">
        <h3 className="font-montserrat font-extrabold text-[10px] sm:text-xs md:text-sm tracking-[2px] sm:tracking-[3px] uppercase text-[#cca048] italic text-center drop-shadow-xs">
          CONFIRMA TU ASISTENCIA
        </h3>
      </div>

      {/* 4. Personalized Guest Section OR Generic RSVP Button */}
      <div className="absolute top-[67%] left-0 right-0 flex justify-center px-3">
        {loading ? (
          <div className="flex items-center gap-2 text-[#cca048]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="font-montserrat text-xs">Cargando tu invitación...</span>
          </div>
        ) : guest ? (
          /* PERSONALIZED RSVP FOR LOGGED IN GUEST */
          <div className="w-full max-w-[340px] flex flex-col items-center gap-1 text-center">
            {/* Greeting */}
            <p className="font-cormorant font-bold text-sm sm:text-base text-[#2e1f14] leading-tight px-2 truncate max-w-full">
              ¡Hola, <span className="text-[#cca048]">{guest.name}</span>!
            </p>

            {/* If RSVP not completed yet OR changing response */}
            {(!rsvp || showSelector) && (
              <div className="w-full flex flex-col items-center justify-center gap-1">
                {confirming ? (
                  <div className="flex items-center gap-2 py-1 text-[#cca048]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="font-montserrat text-xs font-semibold">Guardando confirmación...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 justify-center flex-wrap w-full px-1">
                    {maxTotalAllowed > 1 && (
                      /* SELECT DROPDOWN FOR MULTIPLE PEOPLE */
                      <select
                        value={selectedAttending}
                        onChange={(e) => setSelectedAttending(Number(e.target.value))}
                        className="px-2 py-1 rounded-lg border-2 border-[#dfb56c] bg-white font-montserrat font-bold text-[11px] sm:text-xs text-[#5d4037] shadow-xs outline-none cursor-pointer focus:border-[#cca048]"
                      >
                        {Array.from({ length: maxTotalAllowed }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? "persona" : "personas"}
                          </option>
                        ))}
                      </select>
                    )}

                    <button
                      onClick={() => handleConfirmAction(maxTotalAllowed === 1 ? 1 : selectedAttending)}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#f0c268] to-[#cca048] hover:from-[#e5b350] hover:to-[#b88c38] text-white font-montserrat font-bold text-[11px] sm:text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Confirmar</span>
                    </button>

                    <button
                      onClick={() => handleConfirmAction(0)}
                      className="px-2 py-1 rounded-lg border border-red-300 bg-red-50/90 text-red-700 font-montserrat font-bold text-[11px] sm:text-xs hover:bg-red-100 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                    >
                      <XCircle className="w-3.5 h-3.5 text-red-500" />
                      <span>No asistiré</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* If RSVP already submitted */}
            {rsvp && !showSelector && (
              <div className="flex flex-col items-center gap-0.5">
                {rsvp.confirmed ? (
                  <div className="flex items-center gap-1 text-[#2e7d32] bg-green-50 px-2.5 py-1 rounded-full border border-green-200 shadow-xs">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                    <span className="font-montserrat font-bold text-[11px] sm:text-xs">
                      ¡Asistencia confirmada! ({rsvp.companions_count + 1} {rsvp.companions_count + 1 === 1 ? "persona" : "personas"})
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200 shadow-xs">
                    <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    <span className="font-montserrat font-bold text-[11px] sm:text-xs">Registrado: No podrás asistir</span>
                  </div>
                )}
                <button
                  onClick={() => setShowSelector(true)}
                  className="font-montserrat font-semibold text-[10px] sm:text-[11px] text-[#cca048] hover:text-[#8c6220] underline cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  Cambiar mi respuesta
                </button>
              </div>
            )}
          </div>
        ) : (
          /* GENERIC VISITOR RSVP BUTTON */
          <button
            onClick={onOpenRsvp}
            type="button"
            className="px-6 sm:px-8 py-1.5 sm:py-2 rounded-xl border border-[#a87f3b] bg-white/95 hover:bg-[#a87f3b] text-[#3f2b21] hover:text-white font-cormorant font-bold text-lg sm:text-xl shadow-xs transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Confirmar aquí</span>
          </button>
        )}
      </div>

      {/* 5. Subtext */}
      <div className="absolute top-[78.5%] left-0 right-0 flex justify-center px-6">
        <p className="font-cormorant text-[11px] sm:text-xs text-[#4a3528] text-center max-w-[280px] sm:max-w-[340px] leading-tight">
          Agradecemos que confirmes tu asistencia hasta el <span className="font-bold">Miércoles 9 de Septiembre</span>
        </p>
      </div>

      {/* 6. Closing message */}
      <div className="absolute top-[84.5%] left-0 right-0 flex flex-col items-center justify-center px-6 gap-0.5">
        <p className="font-cormorant italic text-[10px] sm:text-xs text-[#5d4037] text-center max-w-[290px] sm:max-w-[340px] leading-snug">
          &ldquo;Que esta noche sea tan inolvidable para ti como lo será para nosotros.&rdquo;
        </p>
        <p className="font-montserrat font-bold text-[9px] sm:text-[10px] tracking-[1.5px] uppercase text-[#cca048] mt-0.5">
          Ser Puntuales
        </p>
        <p className="font-cormorant font-bold text-sm sm:text-base text-[#2e1f14]">
          ¡Muchas Gracias!
        </p>
      </div>
    </motion.section>
  );
}
