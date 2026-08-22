"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative w-full aspect-[640/896] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(180,130,50,0.18)] border border-[#dfb56c]/40 bg-white select-none"
    >
      {/* Exact Blank Template (Tiara, Butterflies, Frame & Watercolor) */}
      <Image
        src="/slide_template.png"
        alt="Portada Mis 15 Años Almudena"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 620px"
        className="object-cover"
      />

      {/* 1. Large Bold 3D Gold Number 15 (Grand, Bold & Majestic) */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-[20%] left-0 right-0 flex justify-center pointer-events-none z-10"
      >
        <span className="font-playfair font-black text-[9.5rem] sm:text-[12rem] md:text-[14rem] leading-none tracking-normal gold-number-gradient select-none">
          15
        </span>
      </motion.div>

      {/* 2. Cursive Script "Años" (Placed right at the bottom base of the 15) */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute top-[43.5%] left-0 right-0 flex justify-center pointer-events-none z-20"
      >
        <span className="font-alex-brush text-7xl sm:text-8xl md:text-9xl gold-text-gradient font-normal select-none tracking-wide">
          Años
        </span>
      </motion.div>

      {/* 3. Name: Almudena Vera Viteri (Balanced in the lower half) */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute top-[63%] left-0 right-0 flex flex-col items-center text-center leading-none pointer-events-none z-10"
      >
        <h1 className="font-alex-brush text-6xl sm:text-7xl md:text-8xl gold-text-gradient font-normal select-none">
          Almudena
        </h1>
        <h2 className="font-alex-brush text-5xl sm:text-6xl md:text-7xl gold-text-gradient font-normal select-none mt-2 sm:mt-3">
          Vera Viteri
        </h2>
      </motion.div>
    </motion.section>
  );
}
