"use client";

import { motion, easeOut, easeInOut } from "motion/react";
import { CheckCircle2, Home, Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface props {
  cardLast4?: string;
  orderId?: string;
}

export function SuccessPayment({ cardLast4 = "****", orderId = "" }: props) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    setShowConfetti(true);

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="pt-50 md:pt-30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      {mounted && windowSize.width > 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400/20 rounded-full"
              initial={{
                x: Math.random() * windowSize.width,
                y: -20,
                scale: 0,
              }}
              animate={{
                y: windowSize.height + 20,
                scale: [0, 1, 1, 0],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      )}

      {/* Main content card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: easeOut }}
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 sm:p-8 relative z-10"
      >
        {/* Success icon with animation */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="relative"
          >
            <motion.div
              className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: easeInOut,
              }}
            />
            <CheckCircle2
              className="w-14 h-14 sm:w-20 sm:h-20 text-green-500 relative z-10"
              strokeWidth={1.5}
            />
          </motion.div>
        </div>

        {/* Success message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-4 sm:mb-6"
        >
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">
            ¡Pago Exitoso!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Tu transacción se ha completado correctamente
          </p>
        </motion.div>

        {/* Payment details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3.5 sm:p-5 mb-4 sm:mb-6 space-y-2 sm:space-y-2.5"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Número de orden</span>
            <span className="text-sm font-semibold text-gray-900">
              Order #{orderId || "Cargando..."}
            </span>
          </div>

          <div className="h-px bg-gray-300" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Método de pago</span>
            <span className="text-sm font-medium text-gray-900">
              •••• {cardLast4}
            </span>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-2 sm:space-y-2.5 "
        >
          <Link href={`/orders/${orderId}`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-linear-to-r from-green-500 to-emerald-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-shadow text-sm sm:text-base mb-2 cursor-pointer"
            >
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
              Ver detalles
            </motion.button>
          </Link>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white border-2 border-gray-200 text-gray-700 py-2.5 sm:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-sm sm:text-base cursor-pointer"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              Volver al inicio
            </motion.button>
          </Link>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-10 blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: easeInOut,
          }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-teal-400 to-green-500 rounded-full opacity-10 blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: easeInOut,
            delay: 1,
          }}
        />
      </motion.div>

      {/* Floating particles */}
      {mounted && windowSize.width > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {showConfetti &&
            [...Array(15)].map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                className={`absolute w-3 h-3 ${
                  i % 3 === 0
                    ? "bg-green-500"
                    : i % 3 === 1
                      ? "bg-emerald-500"
                      : "bg-teal-500"
                } rounded-full`}
                initial={{
                  x: windowSize.width / 2,
                  y: windowSize.height / 2,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: windowSize.width / 2 + (Math.random() - 0.5) * 600,
                  y: windowSize.height / 2 + (Math.random() - 0.5) * 600,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 1.5,
                  ease: easeOut,
                }}
              />
            ))}
        </div>
      )}
    </div>
  );
}
