
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const photos = [
    { src: "/images/galeria/foto-1.jpeg", alt: "Recuerdo 1" },
    { src: "/images/galeria/foto-2.jpeg", alt: "Recuerdo 2" },
    { src: "/images/galeria/foto-3.jpeg", alt: "Recuerdo 3" },
];

const INTERVAL = 5000;

export default function PhotoGallery() {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const touchStart = useRef(0);

    const previous = () => {
        setCurrent((i) => (i === 0 ? photos.length - 1 : i - 1));
    };

    const next = () => {
        setCurrent((i) => (i + 1) % photos.length);
    };

    useEffect(() => {
        if (paused) return;

        const id = setTimeout(() => {
            setCurrent((i) => (i + 1) % photos.length);
        }, INTERVAL);

        return () => clearTimeout(id);
    }, [current, paused]);

    return (
        <div
            className="relative h-full w-full overflow-hidden touch-pan-y select-none"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={(e) => {
                touchStart.current = e.touches[0].clientX;
                setPaused(true);
            }}

            onTouchEnd={(e) => {
                const diff =
                    touchStart.current - e.changedTouches[0].clientX;

                if (Math.abs(diff) > 45) {
                    if (diff > 0) next();
                    else previous();
                }

                setPaused(false);
            }}
        >
            {photos.map((photo, index) => (
                <Image
                    key={photo.src}
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 620px"
                    quality={90}
                    priority={index === 0}
                    draggable={false}
                    className={`object-cover transition-opacity duration-700 ${index === current ? "opacity-100" : "opacity-0"
                        }`}
                />
            ))}

            <button
                type="button"
                onClick={previous}
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white"
            >
                <ChevronLeft size={20} />
            </button>

            <button
                type="button"
                onClick={next}
                aria-label="Foto siguiente"
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white"
            >
                <ChevronRight size={20} />
            </button>


            {/* Indicador moderno de fotos */}
            <div className="absolute bottom-3 right-3 z-20
    flex items-center gap-2 rounded-full
    border border-white/30 bg-black/35
    px-3 py-1.5 text-white shadow-lg
    backdrop-blur-md sm:bottom-5 sm:right-5">

                <span className="text-sm font-semibold tabular-nums">
                    {String(current + 1).padStart(2, "0")}
                </span>

                <span className="h-3 w-px bg-white/50" />

                <span className="text-xs font-medium text-white/75 tabular-nums">
                    {String(photos.length).padStart(2, "0")}
                </span>
            </div>

        </div>
    );
}
