"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Navigation, Clock } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

export default function LocationSection() {
  return (
    <section className="relative w-full py-4 sm:py-8 flex flex-col items-center" id="location">
      <div className="w-full max-w-5xl mx-auto px-4">
        
        {/* Section Header */}
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
          <h2 className="font-montserrat font-bold text-sm sm:text-base tracking-[4px] uppercase text-[#b88636] italic leading-relaxed">
            Tu camino hacia esta celebración comienza aquí
          </h2>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* Card 1: Venue & Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white/35 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#d4a359]/30 shadow-sm flex flex-col justify-between text-center"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#fce4ec] flex items-center justify-center text-[#d32f2f] mb-3 shadow-xs">
                <MapPin className="w-6 h-6" />
              </div>

              <h3 className="font-cormorant font-bold text-3xl sm:text-4xl text-[#33241d] tracking-wide mb-2">
                SALON DE EVENTOS &ldquo;ENA&rdquo;
              </h3>
              
              <p className="font-cormorant text-xl text-[#4d382c] max-w-xs mx-auto">
                Calle Benito Santos entre Colón y Salinas
              </p>
              
              <p className="font-cormorant text-lg text-[#c97d7d] font-bold mt-1 mb-6">
                18:00 hrs
              </p>

              {/* Map Button */}
              <a
                href="https://maps.google.com/?q=Calle+Benito+Santos+entre+Colon+y+Salinas"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white border-2 border-[#d48b8b] text-[#b33939] hover:bg-[#d32f2f] hover:text-white hover:border-[#d32f2f] transition-all duration-300 font-cormorant font-bold text-xl shadow-sm group"
              >
                <Navigation className="w-5 h-5 text-[#d32f2f] group-hover:text-white transition-colors" />
                Abrir en Google Maps
              </a>
            </div>

            <div className="mt-8 pt-4 border-t border-[#d4a359]/20 text-[#8c6220] font-cormorant italic text-base">
              Estacionamiento y seguridad privada disponible.
            </div>
          </motion.div>

          {/* Card 2: Gifts + Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="bg-white/35 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#d4a359]/30 shadow-sm flex flex-col justify-between text-center"
          >
            <div className="flex flex-col items-center space-y-6">
              
              {/* Gift Note */}
              <div className="w-full bg-white/50 border border-dashed border-[#d4a359]/60 rounded-2xl p-5 shadow-xs">
                <div className="flex justify-center mb-1 text-pink-500">
                  <span className="text-3xl animate-heart-pulse">💕</span>
                </div>
                <h4 className="font-montserrat font-bold text-xs tracking-[2.5px] uppercase text-[#b88636] italic mb-2">
                  Celebremos Juntos
                </h4>
                <p className="font-cormorant italic text-lg sm:text-xl text-[#4a3528] leading-relaxed">
                  &ldquo;Tu presencia es mi mejor regalo, pero si deseas tener un detalle conmigo, será bienvenido.&rdquo;
                </p>
                <span className="inline-block font-montserrat text-xs font-bold tracking-widest text-[#8c6220] uppercase mt-3 bg-[#fce4ec] px-4 py-1 rounded-full">
                  Lluvia de Sobres ✉️
                </span>
              </div>

              {/* Countdown Block */}
              <div className="w-full">
                <div className="inline-flex items-center gap-1.5 font-montserrat font-bold text-xs tracking-[2.5px] uppercase text-[#b88636] italic mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Nos vemos dentro de</span>
                </div>
                <CountdownTimer />
              </div>

            </div>

            <div className="mt-4 pt-4 border-t border-[#d4a359]/20 text-[#8c6220] font-cormorant italic text-base">
              ¡Contando los segundos para celebrar juntos!
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
