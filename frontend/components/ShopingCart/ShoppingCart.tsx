"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart } from "lucide-react";
import { CartPanel } from "./CartPanel";
import { useCart } from "./CartContext";
import { createPortal } from "react-dom";

interface ShoppingCartProps {
  products?: never;
}

export function ShoppingCartNew({}: ShoppingCartProps = {}) {
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  // Trigger animation cada vez que totalItems cambia
   
  useEffect(() => {
    if (totalItems > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimationKey((prev) => prev + 1);
    }
  }, [totalItems]);

  return (
    <div className="relative">
      {/* CART BUTTON */}
      <motion.button
        ref={cartButtonRef}
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-2 bg-gray-200 hover:bg-gray-300  text-white rounded-full px-4 py-2.5 transition-colors cursor-pointer select-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          key={animationKey}
          animate={totalItems > 0 ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <ShoppingCart className="w-5 h-5 stroke-black" />
        </motion.div>

        {/* Desktop label */}
        <span className="text-black  hidden sm:inline text-sm font-medium">
          Cart
        </span>

        {/* Badge */}
        <AnimatePresence mode="popLayout">
          {totalItems > 0 && (
            <motion.span
              key={totalItems}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
            >
              {totalItems > 9 ? "9+" : totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* CART DRAWER OVERLAY - Renderizado con Portal */}
      {isOpen &&
        createPortal(
          <AnimatePresence>
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />

              {/* Drawer — slides from right on desktop, from bottom on mobile */}
              <motion.div
                key="drawer"
                className="fixed z-50 bg-slate-900 flex flex-col
                         bottom-0 left-0 right-0 rounded-t-3xl max-h-[85vh]
                         sm:bottom-auto sm:top-0 sm:left-auto sm:right-0 sm:h-full sm:w-96 sm:rounded-none sm:rounded-l-3xl sm:max-h-full
                         border border-white/10"
                initial={{
                  y: "100%",
                }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                style={{ originX: 1, originY: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 35 }}
              >
                <CartPanel onClose={() => setIsOpen(false)} />
              </motion.div>
            </>
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
