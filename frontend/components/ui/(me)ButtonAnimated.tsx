"use client";
import { motion } from "motion/react";

interface ButtonAnimatedProps {
  text: string;
  classname: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export default function ButtonAnimated({
  text,
  classname,
  type,
  onClick,
}: ButtonAnimatedProps) {
  const isOutOfStock = text === "Out of Stock";

  if (isOutOfStock) {
    return (
      <button className={`rounded-4xl ${classname}`} onClick={onClick}>
        <span className="w-100% md:text-xl text-balance">{text}</span>
      </button>
    );
  }

  return (
    <motion.button
      type={type}
      className={`rounded-4xl ${classname}`}
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95, y: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
      }}
    >
      <span className="sm:text-sm lg:text-xl text-balance">{text}</span>
    </motion.button>
  );
}
