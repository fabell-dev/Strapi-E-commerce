"use client";

import { Raleway } from "next/font/google";
import { motion } from "motion/react";
import ButtonAnimated from "./ui/(me)ButtonAnimated";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
});

interface PageInfo {
  title: string;
  description: string;
  imageURL: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const imageVariants = {
  hidden: { scale: 1.1, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function Hero({ pageInfo }: { pageInfo: PageInfo }) {
  const { title, description, imageURL } = pageInfo;

  return (
    <>
      <section
        className="h-[45vh] md:h-[calc(100vh-200px)] relative mt-50 md:mt-30 overflow-hidden mx-5 md:mx-40 rounded-xl scroll-mt-35"
        id="hero"
      >
        {/* Imagen de fondo con animación */}
        <motion.img
          src={imageURL}
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          alt={title}
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        />

        {/* Overlay oscuro */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/20 z-10" />

        {/* Contenido con animaciones en cascada */}
        <motion.div
          className="relative z-20 h-full flex flex-col justify-center items-start px-4 sm:px-8 md:px-16 lg:px-20 text-center text-white"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className={`text-4xl sm:text-2xl md:text-4xl font-bold mb-2 sm:mb-4 md:mb-6 text-black max-w-100 text-left ${raleway.className}`}
          >
            {title}
          </motion.h1>

          <motion.div className="text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl max-w-2xl text-gray-600">
            <p>{description}</p>
          </motion.div>

          <motion.div>
            <ButtonAnimated
              text="Start Shoping"
              classname="bg-black text-white md:mt-5 mt-3 md:h-10 md:w-50 h-8 w-43 cursor-pointer"
              onClick={() => {
                const mainGrid = document.getElementById("mainGrid");
                if (mainGrid) {
                  mainGrid.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
