"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";
import FloatingParticles from "@/components/FloatingParticles";
import HeroCard from "@/components/HeroCard";
import LocationCard from "@/components/LocationCard";
import ItineraryCard from "@/components/ItineraryCard";
import RsvpModal from "@/components/RsvpModal";
import MusicPlayer from "@/components/MusicPlayer";

export default function Home() {
  const [rsvpOpen, setRsvpOpen] = useState(false);

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
    <div className="relative min-h-screen w-full flex flex-col items-center py-4 sm:py-8 px-2 sm:px-4">
      {/* Background Floating Sparkles */}
      <FloatingParticles />

      {/* Main Sequential Slides Container */}
      <main className="relative w-full max-w-[620px] flex flex-col items-center gap-6 sm:gap-10 z-10">

        {/* =========================================================
            SLIDE 1: PORTADA / HERO (Corona, 15 Años, Almudena)
           ========================================================= */}
        <HeroCard />

        {/* =========================================================
            SLIDE 2: FOTO DE LA QUINCEAÑERA & DEDICATORIA
           ========================================================= */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="relative w-full aspect-[726/1024] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(180,130,50,0.18)] border border-[#dfb56c]/40 bg-white"
        >
          <Image
            src="/slide2.jpg"
            alt="Foto Almudena Vera Viteri - Mis XV Años"
            fill
            sizes="(max-width: 768px) 100vw, 620px"
            className="object-cover"
          />
        </motion.section>

        {/* =========================================================
            SLIDE 3: BENDICIÓN, PADRES, FECHA Y VESTIMENTA
           ========================================================= */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="relative w-full aspect-[726/1024] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(180,130,50,0.18)] border border-[#dfb56c]/40 bg-white"
        >
          <Image
            src="/slide3.png"
            alt="Ceremonia, Padres, Padrinos, Fecha y Vestimenta"
            fill
            sizes="(max-width: 768px) 100vw, 620px"
            className="object-cover"
          />

          {/* Interactive Tap Area: Add to Google Calendar (Completely transparent) */}
          <button
            onClick={handleAddToCalendar}
            title="Guardar fecha en Google Calendar"
            aria-label="Guardar fecha en Google Calendar"
            className="absolute top-[54%] left-[16%] w-[68%] h-[8.5%] rounded-xl cursor-pointer"
          />
        </motion.section>

        {/* =========================================================
            SLIDE 4: UBICACIÓN, REGALOS Y CONTADOR EN VIVO (CÓDIGO PURO)
           ========================================================= */}
        <LocationCard />

        {/* =========================================================
            SLIDE 5: ITINERARIO DE ACTIVIDADES & CONFIRMACIÓN (CÓDIGO PURO)
           ========================================================= */}
        <ItineraryCard onOpenRsvp={() => setRsvpOpen(true)} />

        {/* Footer */}
        <footer className="w-full text-center py-6 font-cormorant text-[#8c6220] flex flex-col items-center gap-2 border-t border-[#dfb56c]/30 mt-2">
          <p className="font-montserrat text-xs text-[#6e543c] leading-relaxed max-w-md px-4">
            Página hecha por <span className="font-bold text-[#8c6220]">Lic. Odalys Sonoza</span> e <span className="font-bold text-[#8c6220]">Ing. Cristhian Ortiz</span>
            <br />
            En caso de adquirir una invitación personalizada contactar al{" "}
            <a
              href="https://wa.me/593995528671?text=Hola,%20deseo%20informaci%C3%B3n%20para%20adquirir%20una%20p%C3%A1gina%20web%20personalizada"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#25d366] hover:underline inline-flex items-center gap-1 bg-[#25d366]/10 px-2 py-0.5 rounded-md border border-[#25d366]/30 transition-colors"
            >
              0995528671
            </a>
          </p>
        </footer>
      </main>

      {/* RSVP WhatsApp Modal */}
      <RsvpModal open={rsvpOpen} onOpenChange={setRsvpOpen} />

      {/* Background Music Prompt & Floating Controller */}
      <MusicPlayer />
    </div>
  );
}
