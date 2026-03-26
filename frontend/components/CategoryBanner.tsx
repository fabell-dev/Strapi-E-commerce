"use client";

import { motion } from "motion/react";
import { getImageUrl } from "@/lib/utils/image-url";

interface CategoryBannerProps {
  image: string;
  name: string;
  description: string;
}

const imageVariants = {
  hidden: { scale: 1.1, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "ease-out",
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "ease-out",
      delay: 0.2,
    },
  },
};

export default function CategoryBanner({
  image,
  name,
  description,
}: CategoryBannerProps) {
  return (
    <div className="relative h-64 md:h-80 overflow-hidden">
      {/* Imagen con animación */}
      <motion.img
        src={getImageUrl(image)}
        alt={name}
        className="w-full h-full object-cover"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-black/70 to-black/40 flex items-center">
        {/* Contenido con animación */}
        <motion.div
          className="container mx-auto px-4"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-2xl text-white">
            <motion.h1 className="text-4xl md:text-5xl mb-4">{name}</motion.h1>
            <motion.p className="text-lg md:text-xl opacity-90">
              {description}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
