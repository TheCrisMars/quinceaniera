"use client";

import Image from "next/image";

const photos = [
    { src: "/images/ruleta/foto-1.jpeg", alt: "Foto 0" },
    { src: "/images/ruleta/foto-2.jpeg", alt: "Foto 1" },
    { src: "/images/ruleta/foto-3.jpeg", alt: "Foto 2" },
    { src: "/images/ruleta/foto-4.jpeg", alt: "Foto 3" },
    { src: "/images/ruleta/foto-5.jpeg", alt: "Foto 4" },
    { src: "/images/ruleta/foto-6.jpeg", alt: "Foto 5" },
    { src: "/images/ruleta/foto-9.jpeg", alt: "Foto 6" },
    { src: "/images/ruleta/foto-10.jpeg", alt: "Foto 7" }
];

export default function PhotoMarquee() {
    // Se duplica la lista para que el bucle no tenga saltos
    const loop = [...photos, ...photos];

    return (
        <div className="relative h-full w-full overflow-hidden">
            <div className="marquee-track flex h-full w-max gap-2">
                {loop.map((photo, i) => (
                    <div
                        key={i}
                        className="relative h-full aspect-[3/4] shrink-0 overflow-hidden rounded-md"
                    >
                        <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            sizes="200px"
                            quality={85}
                            draggable={false}
                            className="object-cover"
                            priority={i < photos.length}
                        />
                    </div>
                ))}
            </div>

            <style jsx>{`
        .marquee-track {
          animation: marquee 25s linear infinite;
        }
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            /* la mitad exacta (una vuelta de la lista original) + media separación */
            transform: translateX(calc(-50% - 0.25rem));
          }
        }
      `}</style>
        </div>
    );
}