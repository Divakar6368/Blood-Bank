"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const images = [
  "/img1.webp",
  "/img2.webp",
  "/img3.webp",
];

export default function MedicalImageSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div
      className="relative h-[550px] w-full overflow-hidden rounded-3xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="sync">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt="Healthcare"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{
            opacity: 0,
            scale: 1.05,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 1.02,
          }}
          transition={{
            opacity: {
              duration: 0.8,
            },
            scale: {
              duration: 3,
              ease: "easeOut",
            },
          }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Optional indicator */}
      <div className="absolute bottom-5 left-5 flex gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}