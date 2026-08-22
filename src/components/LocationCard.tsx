"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Heart, ExternalLink } from "lucide-react";
import SlideCountdown from "@/components/SlideCountdown";

const MAPS_EXACT_URL = "https://maps.app.goo.gl/37HsfC9fbxeEwe1B8";
const MAPS_EMBED = "https://maps.google.com/maps?q=-0.7013161,-80.0927517&z=16&output=embed";

export default function LocationCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
      className="relative w-full aspect-[640/896] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(180,130,50,0.18)] border border-[#dfb56c]/40 bg-white select-none"
    >
      {/* Background Template (Tiara, Frame & Watercolor) */}
      <Image
        src="/slide_template.png"
        alt="Sección Ubicación"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 620px"
        className="object-cover"
      />

      {/* 1. Title */}
      <div className="absolute top-[29%] left-0 right-0 flex justify-center px-8">
        <h2 className="font-montserrat font-extrabold text-[10.5px] sm:text-[12px] tracking-[2px] uppercase text-[#cca048] italic text-center leading-tight">
          TU CAMINO HACIA ESTA<br />CELEBRACIÓN COMIENZA AQUÍ
        </h2>
      </div>

      {/* 2. Venue Name */}
      <div className="absolute top-[34%] left-0 right-0 flex justify-center px-8">
        <h3 className="font-montserrat font-black text-sm sm:text-base md:text-lg text-[#2e1f14] text-center tracking-wide">
          SALON DE EVENTOS &ldquo;ENA&rdquo;
        </h3>
      </div>

      {/* 3. Address */}
      <div className="absolute top-[38.2%] left-0 right-0 flex justify-center px-8">
        <p className="font-cormorant font-semibold text-xs sm:text-sm text-[#2e1f14] text-center leading-snug">
          Calle Benito Santos entre Colón y Salinas
          <br />
          <span className="text-[#cca048] font-bold">18:00 pm</span>
        </p>
      </div>

      {/* 4. Map Container */}
      <div className="absolute top-[43.5%] left-0 right-0 flex justify-center px-8">
        <a
          href={MAPS_EXACT_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir ubicación en Google Maps"
          className="w-full max-w-[280px] rounded-xl overflow-hidden border-2 border-[#dfb56c]/80 shadow-[0_4px_16px_rgba(180,130,50,0.22)] hover:scale-[1.02] active:scale-100 transition-all duration-300 cursor-pointer block bg-[#fcf8f2]"
        >
          {/* Map iframe */}
          <div className="w-full relative overflow-hidden" style={{ height: "55px" }}>
            <iframe
              src={MAPS_EMBED}
              width="100%"
              height="100%"
              style={{ border: 0, pointerEvents: "none" }}
              loading="lazy"
              title="Mapa Salón ENA"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <MapPin className="w-5 h-5 text-[#d32f2f] fill-[#d32f2f] drop-shadow-lg" />
            </div>
          </div>
          {/* Button bar */}
          <div className="w-full bg-white py-1 px-3 flex items-center justify-between border-t border-[#dfb56c]/40">
            <span className="font-montserrat font-semibold text-[9px] sm:text-[10px] text-[#5d4037] truncate max-w-[55%]">
              Salón de Eventos ENA
            </span>
            <span className="bg-[#2e7d32] text-white font-montserrat text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs whitespace-nowrap">
              <ExternalLink className="w-2 h-2" />
              Ver Mapa
            </span>
          </div>
        </a>
      </div>

      {/* 5. CELEBREMOS JUNTOS title — pushed further down to 60.5% */}
      <div className="absolute top-[60.5%] left-0 right-0 flex justify-center px-8">
        <h3 className="font-montserrat font-extrabold text-[11px] sm:text-[12px] tracking-[2px] uppercase text-[#cca048] italic text-center">
          CELEBREMOS JUNTOS
        </h3>
      </div>

      {/* 6. Hearts & Gift Text — pushed down to 64.5% */}
      <div className="absolute top-[64.5%] left-0 right-0 flex justify-center px-8">
        <div className="w-full max-w-[300px] flex items-center gap-3">
          <div className="flex-shrink-0 relative w-9 h-8">
            <Heart className="absolute top-0 left-0 w-6 h-6 text-[#f48fb1] fill-[#f48fb1]" />
            <Heart className="absolute top-1.5 left-4 w-5 h-5 text-[#e91e8c] fill-[#e91e8c]" />
          </div>
          <p className="font-cormorant font-semibold text-xs sm:text-sm text-[#2e1f14] text-center leading-tight flex-1">
            Tu presencia es mi mejor regalo, pero si deseas tener un detalle conmigo, será bienvenido.
          </p>
        </div>
      </div>

      {/* 7. NOS VEMOS DENTRO DE — at 76.5% */}
      <div className="absolute top-[76.5%] left-0 right-0 flex justify-center px-8">
        <h3 className="font-montserrat font-extrabold text-[11px] sm:text-[12px] tracking-[2px] uppercase text-[#cca048] italic text-center">
          NOS VEMOS DENTRO DE
        </h3>
      </div>

      {/* 8. Live Countdown — at 80.5% */}
      <div className="absolute top-[80.5%] left-0 right-0 flex justify-center px-8">
        <SlideCountdown />
      </div>
    </motion.section>
  );
}
