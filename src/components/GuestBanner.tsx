"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Users, Heart, Loader2, X } from "lucide-react";
import { supabase, type Guest, type Rsvp } from "@/lib/supabase";

interface GuestBannerProps {
  token: string;
}

export default function GuestBanner({ token }: GuestBannerProps) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [existingRsvp, setExistingRsvp] = useState<Rsvp | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [companions, setCompanions] = useState(0);
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadGuest() {
      setLoading(true);
      // Fetch guest by token
      const { data: guestData, error: guestError } = await supabase
        .from("guests")
        .select("*")
        .eq("token", token)
        .single();

      if (guestError || !guestData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setGuest(guestData as Guest);

      // Check if RSVP already exists
      const { data: rsvpData } = await supabase
        .from("rsvps")
        .select("*")
        .eq("guest_id", guestData.id)
        .single();

      if (rsvpData) {
        setExistingRsvp(rsvpData as Rsvp);
        if ((rsvpData as Rsvp).confirmed) {
          setConfirmed(true);
          setCompanions((rsvpData as Rsvp).companions_count);
        } else {
          setDeclined(true);
        }
      }

      setLoading(false);
    }

    loadGuest();
  }, [token]);

  const handleConfirm = async (attending: boolean) => {
    if (!guest) return;
    setConfirming(true);

    const rsvpPayload = {
      guest_id: guest.id,
      confirmed: attending,
      companions_count: attending ? companions : 0,
      message: message || null,
    };

    // Upsert so guest can update their response
    const { error } = await supabase
      .from("rsvps")
      .upsert(rsvpPayload, { onConflict: "guest_id" });

    setConfirming(false);

    if (!error) {
      if (attending) {
        setConfirmed(true);
        setDeclined(false);
      } else {
        setDeclined(true);
        setConfirmed(false);
      }
      setShowForm(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-[620px] flex justify-center py-6">
        <Loader2 className="w-6 h-6 text-[#cca048] animate-spin" />
      </div>
    );
  }

  if (notFound) return null; // Silent fail — not a valid guest token

  if (!guest) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="banner"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", damping: 20 }}
        className="w-full max-w-[620px] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#dfb56c]/70 shadow-[0_8px_30px_rgba(180,130,50,0.2)] bg-gradient-to-b from-[#fffcf8] to-[#fff6e9]"
      >
        {/* Header strip */}
        <div className="bg-gradient-to-r from-[#f0c268] via-[#e5b350] to-[#cca048] px-5 py-3 flex items-center gap-2.5">
          <Heart className="w-4 h-4 text-white fill-white flex-shrink-0" />
          <p className="font-montserrat font-bold text-xs text-white tracking-[2px] uppercase">
            Invitación Personal &bull; Mis XV Años
          </p>
        </div>

        <div className="px-5 sm:px-7 py-5 sm:py-6 flex flex-col gap-4">
          {/* Saludo */}
          <div>
            <h2 className="font-cormorant font-bold text-2xl sm:text-3xl text-[#2e1f14] leading-tight">
              ¡Hola, <span className="text-[#cca048]">{guest.name}</span>!
            </h2>
            <p className="font-cormorant text-base sm:text-lg text-[#5d4037] mt-1 leading-snug">
              Estás cordialmente invitad@ a celebrar mis XV Años.<br />
              <span className="font-semibold">¿Puedes acompañarme?</span>
            </p>
            {guest.max_companions > 0 && (
              <p className="font-montserrat text-xs text-[#8c6220] mt-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Tienes lugar para <span className="font-bold">{guest.max_companions} acompañante{guest.max_companions !== 1 ? "s" : ""}</span>
              </p>
            )}
          </div>

          {/* Already confirmed / declined */}
          {confirmed && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col gap-2 p-4 rounded-2xl bg-[#e8f5e9] border border-[#a5d6a7]"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#2e7d32]" />
                <p className="font-montserrat font-bold text-sm text-[#1b5e20]">
                  ¡Confirmado! Te esperamos el 19 de Septiembre 🎉
                </p>
              </div>
              {companions > 0 && (
                <p className="font-montserrat text-xs text-[#388e3c]">
                  Asistirás con <strong>{companions}</strong> acompañante{companions !== 1 ? "s" : ""}
                  {" "}({companions + 1} persona{companions + 1 !== 1 ? "s" : ""} en total)
                </p>
              )}
              {companions === 0 && (
                <p className="font-montserrat text-xs text-[#388e3c]">Solo tú, ¡te esperamos!</p>
              )}
              <button
                onClick={() => { setConfirmed(false); setDeclined(false); setShowForm(true); }}
                className="font-montserrat text-xs text-[#5d4037] underline cursor-pointer mt-1 text-left"
              >
                Cambiar respuesta
              </button>
            </motion.div>
          )}

          {declined && !confirmed && (
            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-[#fce4ec] border border-[#f48fb1]">
              <p className="font-montserrat font-bold text-sm text-[#880e4f]">
                Registramos que no podrás asistir 😢
              </p>
              <button
                onClick={() => { setDeclined(false); setConfirmed(false); setShowForm(true); }}
                className="font-montserrat text-xs text-[#5d4037] underline cursor-pointer mt-1 text-left"
              >
                Cambiar respuesta
              </button>
            </div>
          )}

          {/* Action Buttons (no response yet, or changing) */}
          {!confirmed && !declined && !showForm && (
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => setShowForm(true)}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#f0c268] to-[#cca048] text-white font-montserrat font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Confirmar asistencia
              </button>
              <button
                onClick={() => handleConfirm(false)}
                disabled={confirming}
                className="flex-1 py-3 px-4 rounded-2xl border border-[#dfb56c]/60 text-[#5d4037] font-montserrat font-semibold text-sm hover:bg-[#dfb56c]/10 transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                {confirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                No podré asistir
              </button>
            </div>
          )}

          {/* RSVP Form */}
          <AnimatePresence>
            {showForm && !confirmed && !declined && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-3 overflow-hidden"
              >
                {/* Companions selector */}
                {guest.max_companions > 0 && (
                  <div>
                    <label className="font-montserrat font-semibold text-xs text-[#5d4037] block mb-2">
                      ¿Con cuántos acompañantes asistirás?
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {Array.from({ length: guest.max_companions + 1 }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setCompanions(i)}
                          className={`w-10 h-10 rounded-full font-montserrat font-bold text-sm border-2 transition-all duration-200 cursor-pointer ${
                            companions === i
                              ? "bg-[#cca048] border-[#cca048] text-white shadow-md"
                              : "bg-white border-[#dfb56c]/60 text-[#5d4037] hover:border-[#cca048]"
                          }`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                    <p className="font-montserrat text-xs text-[#8c6220] mt-1">
                      Total: {companions + 1} persona{companions + 1 !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}

                {/* Optional message */}
                <div>
                  <label className="font-montserrat font-semibold text-xs text-[#5d4037] block mb-1.5">
                    Mensaje para la quinceañera (opcional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    rows={2}
                    className="w-full text-sm font-cormorant rounded-xl border border-[#dfb56c]/60 bg-white/70 px-3 py-2 outline-none focus:border-[#cca048] focus:ring-1 focus:ring-[#cca048]/30 resize-none text-[#2e1f14] placeholder:text-[#9e9e9e]"
                  />
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => handleConfirm(true)}
                    disabled={confirming}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#f0c268] to-[#cca048] text-white font-montserrat font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {confirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    ¡Confirmar!
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-3 rounded-2xl border border-[#dfb56c]/60 text-[#5d4037] font-montserrat text-sm cursor-pointer hover:bg-[#dfb56c]/10 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
