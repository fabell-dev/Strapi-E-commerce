"use client";
import { motion } from "motion/react";

interface ButtonAnimatedProps {
  text: string;
  classname: string;
}

export default function ButtonAnimated({
  text,
  classname,
}: ButtonAnimatedProps) {
  return (
    <motion.button
      className={`rounded-4xl ${classname}`}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95, y: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
      }}
    >
      <a href="#portfolio" className="w-100% md:text-xl  text-balance">
        {text}
      </a>
    </motion.button>
  );
}
