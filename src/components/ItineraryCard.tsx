"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ItineraryCardProps {
  onOpenRsvp: () => void;
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

export default function ItineraryCard({ onOpenRsvp }: ItineraryCardProps) {
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

      {/* 2. List of 7 Events — each ~4.7% apart */}
      {itineraryItems.map((item, idx) => (
        <div
          key={idx}
          className="absolute left-0 right-0 flex justify-center px-8"
          style={{ top: `${33.5 + idx * 4.7}%` }}
        >
          <div className="w-full max-w-[290px] sm:max-w-[340px] flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-[66px] sm:w-[78px] py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-[#f0c268] to-[#e5b350] text-white font-montserrat font-extrabold text-[10.5px] sm:text-xs text-center shadow-xs flex-shrink-0">
              {item.time}
            </div>
            <div className="font-cormorant font-bold text-sm sm:text-base md:text-lg text-[#3b2b24] tracking-wide truncate">
              {item.label}
            </div>
          </div>
        </div>
      ))}

      {/* 3. Title: CONFIRMA TU ASISTENCIA (after last item at 33.5 + 6*4.7 = 61.7%) */}
      <div className="absolute top-[66%] left-0 right-0 flex justify-center px-4">
        <h3 className="font-montserrat font-extrabold text-[11px] sm:text-xs md:text-sm tracking-[2.5px] sm:tracking-[3px] uppercase text-[#cca048] italic text-center drop-shadow-xs">
          CONFIRMA TU ASISTENCIA
        </h3>
      </div>

      {/* 4. Button: Confirmar aquí */}
      <div className="absolute top-[71%] left-0 right-0 flex justify-center px-4">
        <button
          onClick={onOpenRsvp}
          type="button"
          className="px-6 sm:px-8 py-1.5 sm:py-2 rounded-xl border border-[#a87f3b] bg-white/95 hover:bg-[#a87f3b] text-[#3f2b21] hover:text-white font-cormorant font-bold text-lg sm:text-xl md:text-2xl shadow-xs transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>Confirmar aquí</span>
        </button>
      </div>

      {/* 5. Subtext */}
      <div className="absolute top-[79%] left-0 right-0 flex justify-center px-8">
        <p className="font-cormorant text-xs sm:text-sm text-[#4a3528] text-center max-w-[290px] sm:max-w-[340px] leading-tight">
          Agradecemos que confirmes tu asistencia hasta el <span className="font-bold">Miércoles 9 de Septiembre</span>
        </p>
      </div>
    </motion.section>
  );
}
