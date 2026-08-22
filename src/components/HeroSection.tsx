"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full text-center flex flex-col items-center pt-4 sm:pt-8 pb-4" id="hero">
      {/* Floating Animated Butterflies with staggered positions & angles */}
      <motion.div 
        animate={{ y: [0, -12, 0], rotate: [0, 6, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-6 left-[8%] sm:left-[15%] md:left-[22%] w-14 sm:w-18 h-14 sm:h-18 pointer-events-none z-20"
      >
        <Image 
          src="/butterfly.png" 
          alt="Mariposa" 
          width={72} 
          height={72} 
          className="w-full h-full object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.15)]" 
        />
      </motion.div>

      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [12, 18, 8, 12] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-10 right-[8%] sm:right-[15%] md:right-[22%] w-14 sm:w-18 h-14 sm:h-18 pointer-events-none z-20"
      >
        <Image 
          src="/butterfly.png" 
          alt="Mariposa" 
          width={72} 
          height={72} 
          className="w-full h-full object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.15)]" 
        />
      </motion.div>

      <motion.div 
        animate={{ y: [0, -10, 0], rotate: [-8, -2, -12, -8] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="hidden md:block absolute top-48 left-[10%] w-12 h-12 pointer-events-none z-20 opacity-80"
      >
        <Image 
          src="/butterfly.png" 
          alt="Mariposa" 
          width={48} 
          height={48} 
          className="w-full h-full object-contain filter drop-shadow-md" 
        />
      </motion.div>

      {/* Royal Tiara Crown */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="mb-2 relative"
      >
        <div className="absolute inset-0 bg-[#ffd700]/20 blur-2xl rounded-full -z-10" />
        <Image
          src="/crown.png"
          alt="Corona de Quinceañera"
          width={300}
          height={200}
          priority
          className="w-48 sm:w-64 md:w-80 h-auto object-contain filter drop-shadow-[0_10px_20px_rgba(180,130,40,0.45)] transition-transform hover:scale-105 duration-300"
        />
      </motion.div>

      {/* Number 15 & Años layered arrangement */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="leading-none select-none"
        >
          <span className="font-cormorant font-bold text-[9rem] sm:text-[12rem] md:text-[15rem] gold-number-gradient block tracking-tight">
            15
          </span>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-alex-brush text-7xl sm:text-8xl md:text-9xl gold-text-gradient -mt-10 sm:-mt-16 md:-mt-24 font-normal select-none"
        >
          Años
        </motion.h2>
      </div>

      {/* Quinceañera Name with decorative flourishes */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-2 relative px-4"
      >
        <div className="inline-flex items-center gap-3 text-[#cba158]/70 text-sm font-montserrat tracking-[4px] uppercase mb-2">
          <span>✦</span>
          <span>Nuestra Quinceañera</span>
          <span>✦</span>
        </div>

        <h1 className="font-alex-brush text-6xl sm:text-7xl md:text-8xl gold-text-gradient leading-none tracking-wide font-normal">
          Almudena
          <span className="block text-5xl sm:text-6xl md:text-7xl mt-1">
            Vera Viteri
          </span>
        </h1>
      </motion.div>

      {/* Scroll Down Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-6 sm:mt-8"
      >
        <a
          href="#photo"
          className="group inline-flex flex-col items-center gap-1 text-[#8c6220] hover:text-[#5c4015] transition-colors"
          aria-label="Ver invitación"
        >
          <span className="font-montserrat text-xs font-semibold tracking-widest uppercase">Ver Invitación</span>
          <div className="w-10 h-10 rounded-full border border-[#d4a359]/70 bg-white/70 backdrop-blur-xs flex items-center justify-center group-hover:bg-[#d4a359] group-hover:text-white transition-all duration-300 shadow-md animate-bounce">
            <ChevronDown className="w-5 h-5" />
          </div>
        </a>
      </motion.div>
    </section>
  );
}
