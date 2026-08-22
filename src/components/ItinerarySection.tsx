"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import RsvpModal from "./RsvpModal";

const schedule = [
  { time: "18:00", event: "Recepción de Invitados", icon: "🥂" },
  { time: "19:00", event: "Entrada de la Quinceañera", icon: "👑" },
  { time: "20:00", event: "Sesión de Fotografía", icon: "📸" },
  { time: "21:00", event: "Vals y Apertura de Pista", icon: "💃" },
  { time: "23:00", event: "Banquete de Gala", icon: "🍽️" },
  { time: "00:00", event: "Gran Hora Loca", icon: "🎭" },
  { time: "02:00", event: "Despedida y Agradecimiento", icon: "✨" },
];

export default function ItinerarySection() {
  const [rsvpOpen, setRsvpOpen] = useState(false);

  return (
    <section className="relative w-full py-4 sm:py-8 flex flex-col items-center" id="itinerary">
      <div className="w-full max-w-4xl mx-auto px-4">

        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-3">
            <Image
              src="/crown.png"
              alt="Corona"
              width={140}
              height={90}
              className="w-24 sm:w-32 h-auto object-contain filter drop-shadow-md"
            />
          </div>
          <h2 className="font-montserrat font-bold text-sm sm:text-base tracking-[4px] uppercase text-[#b88636] italic">
            Itinerario de Actividades
          </h2>
          <p className="font-cormorant italic text-lg sm:text-xl text-[#6d4c41] mt-1">
            Cada instante preparado con todo el corazón para ti
          </p>
        </div>

        {/* Timeline */}
        <div className="relative my-4">
          {/* Vertical Line */}
          <div className="absolute top-0 bottom-0 left-6 md:left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-[#d4a359] to-transparent" />

          <div className="space-y-6 sm:space-y-8">
            {schedule.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className={`relative flex items-center ${isEven ? "md:flex-row-reverse" : "md:flex-row"
                    } gap-4 md:gap-8 pl-12 md:pl-0`}
                >
                  {/* Center Icon Node */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-tr from-[#a3752c] to-[#ffd978] p-[2px] shadow-md z-10">
                    <div className="w-full h-full rounded-full bg-[#fff8f9] flex items-center justify-center text-base">
                      {item.icon}
                    </div>
                  </div>

                  {/* Content Box */}
                  <div className={`w-full md:w-[calc(50%-2rem)] ${isEven ? "md:text-left" : "md:text-right"}`}>
                    <div className="bg-white/50 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-[#d4a359]/30 shadow-xs hover:shadow-md transition-shadow">
                      <div className={`flex items-center gap-3 ${isEven ? "md:justify-start" : "md:justify-end"}`}>
                        <span className="inline-block bg-gradient-to-r from-[#f5c277] to-[#e2a54b] text-white font-cormorant font-bold text-lg px-4 py-1 rounded-full shadow-xs">
                          {item.time}
                        </span>
                        <h4 className="font-cormorant font-bold text-xl sm:text-2xl text-[#3b2c24]">
                          {item.event}
                        </h4>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* RSVP Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-8 bg-white/50 backdrop-blur-md p-6 sm:p-10 rounded-3xl border border-[#d4a359]/40 shadow-sm text-center"
        >
          <div className="max-w-lg mx-auto">
            <span className="text-3xl mb-2 block">💌</span>

            <h3 className="font-montserrat font-bold text-base sm:text-lg tracking-[3px] uppercase text-[#b88636] italic mb-3">
              CONFIRMA TU ASISTENCIA
            </h3>

            <p className="font-cormorant text-xl sm:text-2xl text-[#4a3528] mb-6 leading-relaxed">
              Tu presencia es muy importante para nosotros. Por favor confírmanos antes de la fecha límite:
            </p>

            <div className="inline-block bg-[#fce4ec] border border-[#d4a359]/40 rounded-2xl px-6 py-3 mb-8 shadow-xs">
              <p className="font-cormorant font-bold text-xl sm:text-2xl text-[#3b2c24]">
                Miércoles 9 de Septiembre
              </p>
            </div>

            <div>
              <Button
                onClick={() => setRsvpOpen(true)}
                className="gold-btn-gradient text-white font-cormorant font-bold text-2xl sm:text-3xl px-12 py-8 rounded-full transition-all duration-300 shadow-xl hover:scale-105 active:scale-95"
              >
                <CheckCircle className="w-8 h-8 mr-3 text-white" />
                Confirmar aquí
              </Button>
            </div>

            <div className="mt-8 text-center text-[#7d5b24] font-cormorant italic text-lg sm:text-xl">
              <p>¡Te esperamos con los brazos abiertos para celebrar este día inolvidable!</p>
            </div>
          </div>
        </motion.div>

      </div>

      {/* RSVP Modal */}
      <RsvpModal open={rsvpOpen} onOpenChange={setRsvpOpen} />
    </section>
  );
}
