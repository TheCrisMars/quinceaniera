"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function PhotoSection() {
  return (
    <section className="relative w-full py-4 sm:py-8 flex flex-col items-center" id="photo">
      {/* Floating Butterflies */}
      <motion.div 
        animate={{ y: [0, -10, 0], rotate: [-6, 2, -6] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 left-[4%] sm:left-[12%] w-12 sm:w-16 h-12 sm:h-16 pointer-events-none z-20"
      >
        <Image src="/butterfly.png" alt="Mariposa" width={64} height={64} className="object-contain filter drop-shadow-md" />
      </motion.div>

      <motion.div 
        animate={{ y: [0, -12, 0], rotate: [10, 18, 10] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute top-12 right-[4%] sm:right-[12%] w-12 sm:w-16 h-12 sm:h-16 pointer-events-none z-20"
      >
        <Image src="/butterfly.png" alt="Mariposa" width={64} height={64} className="object-contain filter drop-shadow-md" />
      </motion.div>

      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Photo with oval gold frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex justify-center items-center"
          >
            <div className="relative w-[250px] sm:w-[300px] md:w-[330px] h-[320px] sm:h-[380px] md:h-[420px] rounded-[50%/45%] p-3 bg-gradient-to-tr from-[#a3752c] via-[#ffd978] to-[#91621a] shadow-[0_20px_45px_rgba(100,65,20,0.35)]">
              
              {/* Crown ornament on top */}
              <div className="absolute -top-9 sm:-top-11 left-1/2 -translate-x-1/2 w-20 sm:w-26 z-30 filter drop-shadow-lg">
                <Image src="/crown.png" alt="Corona" width={100} height={65} className="w-full h-auto object-contain" />
              </div>

              {/* Inner oval photo */}
              <div className="w-full h-full rounded-[50%/45%] overflow-hidden border-2 border-[#fff0f3] bg-[#f8bbd0] shadow-inner relative group">
                <Image
                  src="/photo.jpg"
                  alt="Almudena Vera Viteri"
                  fill
                  priority
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </motion.div>

          {/* Dedication text */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fce4ec]/80 border border-[#d4a359]/40 text-[#8c6220] font-montserrat text-xs font-semibold tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#d4a359]" />
              <span>Celebración Especial</span>
            </div>

            <h2 className="font-great-vibes text-6xl sm:text-7xl md:text-8xl gold-text-gradient font-normal leading-none">
              Mis
            </h2>
            <h3 className="font-alex-brush text-7xl sm:text-8xl md:text-9xl gold-text-gradient -mt-4 sm:-mt-6 font-normal">
              XV años
            </h3>

            <p className="font-cormorant italic text-xl sm:text-2xl text-[#4a3528] mt-4 leading-relaxed max-w-md">
              &ldquo;Hay momentos en la vida que son irrepetibles, pero compartirlos con las personas que más quiero los hace inolvidables.&rdquo;
            </p>

            <div className="mt-6 flex items-center gap-3 text-[#cba158]">
              <div className="h-[1px] w-12 bg-[#cba158]" />
              <span className="font-alex-brush text-3xl text-[#8c6220]">Almudena</span>
              <div className="h-[1px] w-12 bg-[#cba158]" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
