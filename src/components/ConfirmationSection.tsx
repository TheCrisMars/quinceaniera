"use client";

import { supabase, type Guest, type Rsvp } from "@/lib/supabase";
import confetti from "canvas-confetti";
import { CheckCircle, Edit3, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ConfirmationSectionProps {
  invitadoToken?: string | null;
  onOpenRsvp: () => void;
}

export default function ConfirmationSection({ invitadoToken, onOpenRsvp }: ConfirmationSectionProps) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [rsvp, setRsvp] = useState<Rsvp | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
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
        }
      }
    }
  };

  const maxTotalAllowed = guest ? guest.max_companions + 1 : 1;

  return (
    <section className="mt-10 text-center px-2 pb-8">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="h-[2px] w-24 bg-[#c25da1]" />
        <span className="text-[#c25da1] text-3xl">☀</span>
        <div className="h-[2px] w-24 bg-[#c25da1]" />
      </div>

      <h3 className="font-pinyon text-[#f3bf62] text-6xl leading-none">Confirmación de Asistencia</h3>
      <p className="font-cormorant text-[#b54b96] text-2xl leading-tight mt-4 max-w-[530px] mx-auto">
        Agradecemos confirmar su asistencia con 10 días de anticipación
      </p>

      <div className="mt-7 max-w-[540px] mx-auto">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-[#cca048]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="font-montserrat text-xs">Cargando tu invitación...</span>
          </div>
        ) : guest ? (
          <div className="flex flex-col items-center gap-2">
            <p className="font-cormorant text-3xl text-[#b54b96]">
              Hola, <span className="font-bold">{guest.name}</span>
            </p>

            {(!rsvp || showSelector) && (
              <div className="w-full flex flex-col items-center gap-2">
                {confirming ? (
                  <div className="flex items-center gap-2 py-1 text-[#cca048]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="font-montserrat text-xs font-semibold">Guardando confirmación...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center flex-wrap w-full px-1">
                    {maxTotalAllowed > 1 && (
                      <select
                        value={selectedAttending}
                        onChange={(e) => setSelectedAttending(Number(e.target.value))}
                        className="px-3 py-2 rounded-lg border border-[#efc067] bg-white font-montserrat font-bold text-xs text-[#5d4037] outline-none"
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
                      className="px-4 py-2 rounded-lg bg-[#fff] border border-[#efc067] text-[#b54b96] font-cormorant text-2xl hover:bg-[#fff4e1] transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Confirmar
                    </button>

                    <button
                      onClick={() => handleConfirmAction(0)}
                      className="px-4 py-2 rounded-lg border border-red-300 bg-red-50 text-red-700 font-cormorant text-2xl hover:bg-red-100 transition-colors flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> No asistiré
                    </button>
                  </div>
                )}
              </div>
            )}

            {rsvp && !showSelector && (
              <div className="flex flex-col items-center gap-1.5 mt-1">
                {rsvp.confirmed ? (
                  <div className="flex items-center gap-2 text-[#2e7d32] bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-montserrat font-bold text-xs">
                      ¡Asistencia confirmada! ({rsvp.companions_count + 1} personas)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                    <XCircle className="w-4 h-4" />
                    <span className="font-montserrat font-bold text-xs">Registrado: No asistirás</span>
                  </div>
                )}
                <button
                  onClick={() => setShowSelector(true)}
                  className="font-montserrat text-xs text-[#b54b96] underline inline-flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Cambiar mi respuesta
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenRsvp}
            type="button"
            className="px-7 py-2 rounded-xl border border-[#efc067] bg-white text-[#b54b96] font-cormorant text-4xl hover:bg-[#fff4e1] transition-colors"
          >
            CONFIRMAR AQUÍ
          </button>
        )}
      </div>
    </section>
  );
}
