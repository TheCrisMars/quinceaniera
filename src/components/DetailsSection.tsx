"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DetailsSection() {
  const handleAddToCalendar = () => {
    const title = encodeURIComponent("15 Años de Almudena Vera Viteri");
    const details = encodeURIComponent(
      "Celebración de los XV Años de Almudena Vera Viteri. Salón de Eventos 'ENA', Calle Benito Santos entre Colón y Salinas. Vestimenta: Gala (Color rojo reservado)."
    );
    const location = encodeURIComponent("Salón de Eventos ENA, Calle Benito Santos entre Colón y Salinas");
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=20260919T180000/20260920T020000`;
    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <section className="relative w-full py-4 sm:py-8 flex flex-col items-center" id="details">
      <div className="w-full max-w-5xl mx-auto px-4">
        
        {/* Section Title */}
        <div className="text-center mb-5 sm:mb-8">
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
            Ceremonia y Celebración
          </h2>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* Card 1: Blessing & Godmother */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white/35 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#d4a359]/30 shadow-sm flex flex-col justify-between text-center"
          >
            <div className="space-y-6">
              {/* Parents Blessing */}
              <div>
                <div className="inline-flex items-center gap-2 text-[#9c7328] font-montserrat text-xs font-bold tracking-[3px] uppercase mb-2">
                  <span>🕊️</span>
                  <span>Con la bendición de Dios y mis padres</span>
                  <span>🕊️</span>
                </div>
                <p className="font-cormorant font-bold text-2xl sm:text-3xl gold-text-gradient tracking-wide mt-1">
                  FRANK VERA GARCIA
                </p>
                <span className="text-[#8c6220] font-serif text-lg">&</span>
                <p className="font-cormorant font-bold text-2xl sm:text-3xl gold-text-gradient tracking-wide">
                  AMALIA VITERI LOOR
                </p>
              </div>

              <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-[#d4a359] to-transparent" />

              {/* Godmother */}
              <div>
                <div className="inline-flex items-center gap-1.5 text-[#9c7328] font-montserrat text-xs font-bold tracking-[2.5px] uppercase mb-1">
                  <span>✨</span>
                  <span>Mi Madrina</span>
                  <span>✨</span>
                </div>
                <p className="font-cormorant font-bold text-2xl sm:text-3xl gold-text-gradient tracking-wide mt-1">
                  KAREN ABAD CORONEL
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#d4a359]/20 text-[#8c6220] font-cormorant italic text-lg">
              &ldquo;Guiada por su amor, comienzo esta nueva y maravillosa etapa.&rdquo;
            </div>
          </motion.div>

          {/* Card 2: Date, Calendar & Dress Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="bg-white/35 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#d4a359]/30 shadow-sm flex flex-col justify-between text-center"
          >
            <div className="flex flex-col items-center">
              <span className="font-montserrat text-xs font-bold tracking-[3px] uppercase text-[#b88636] italic mb-3">
                Fecha del Evento
              </span>

              {/* Date Box */}
              <div className="w-full flex items-center justify-center gap-3 sm:gap-4 my-2">
                <div className="flex-1 border-y border-[#dca0a0]/70 py-2.5">
                  <span className="font-cormorant font-bold text-lg sm:text-xl tracking-widest text-[#4a3528]">
                    SÁBADO
                  </span>
                </div>
                <div className="px-2">
                  <span className="font-cormorant font-bold text-6xl sm:text-7xl text-[#3b2c24] leading-none">
                    19
                  </span>
                </div>
                <div className="flex-1 border-y border-[#dca0a0]/70 py-2.5">
                  <span className="font-cormorant font-bold text-lg sm:text-xl tracking-wider text-[#4a3528]">
                    18:00 HRS.
                  </span>
                </div>
              </div>

              <p className="font-cormorant font-bold text-2xl tracking-[6px] text-[#4a3528] mt-1 mb-4 uppercase">
                SEPTIEMBRE
              </p>

              {/* Add to Calendar Button */}
              <Button
                onClick={handleAddToCalendar}
                variant="outline"
                className="border-[#cba158] text-[#8c6220] bg-white/80 hover:bg-[#cba158] hover:text-white rounded-full font-montserrat text-xs font-semibold px-6 py-2.5 h-auto mb-6 gap-2 transition-all duration-300 shadow-xs"
              >
                <CalendarPlus className="w-4 h-4" />
                Guardar en mi Calendario
              </Button>

              {/* Dress Code */}
              <div className="w-full bg-[#fff0f3]/80 p-4 rounded-2xl border border-[#d4a359]/20 flex items-center justify-center gap-4">
                <div className="flex gap-2 text-3xl">
                  <span title="Traje formal">👔</span>
                  <span title="Vestido de noche">👗</span>
                </div>
                <div className="text-left">
                  <p className="font-cormorant font-bold text-lg text-[#3b2c24] tracking-wider leading-none">
                    VESTIMENTA: GALA
                  </p>
                  <p className="font-cormorant text-sm text-[#4a3528] mt-1 leading-tight">
                    Amablemente el color <span className="text-[#d32f2f] font-bold">Rojo</span> está reservado para la quinceañera.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
