"use client";
import { motion } from "motion/react";

export default function () {
  return (
    <motion.button
      className="bg-black rounded-4xl text-white md:mt-5 mt-3 md:h-12 md:w-60 h-8 w-43"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.9, y: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <a href="#portfolio" className="w-100% md:text-xl  text-balance">
        Start Shoping
      </a>
    </motion.button>
  );
}
