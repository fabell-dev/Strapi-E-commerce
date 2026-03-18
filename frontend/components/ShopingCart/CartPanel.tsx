import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useCart } from "./CartContext";
import Link from "next/link";

const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_URL;

export function CartPanel({ onClose }: { onClose: () => void }) {
  const { cartItems, totalItems, totalPrice, updateQty, removeItem } =
    useCart();

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-5 h-5 text-indigo-400" />
          <h2 className="text-white font-bold text-lg">Your Cart</h2>
          {totalItems > 0 && (
            <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors cursor-pointer p-1"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence initial={false}>
          {cartItems.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 gap-4 text-white/30"
            >
              <ShoppingBag className="w-16 h-16 opacity-30" />

              <p className="text-sm">Your cart is empty</p>
            </motion.div>
          ) : (
            cartItems.map((item) => (
              <motion.div
                key={`${item.id}-${item.variantIndex ?? "main"}`}
                layout
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3"
              >
                <img
                  src={`${STRAPI_HOST}${item.image.url}`}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-xl shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">
                    {item.variantIndex !== undefined && item.color
                      ? `${item.name} - ${item.color}`
                      : item.name}
                  </p>

                  <p className="text-indigo-300 text-sm font-bold">
                    ${item.price.toFixed(2)}
                  </p>
                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => updateQty(item.id, -1, item.variantIndex)}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </motion.button>
                    <motion.span
                      key={item.quantity}
                      initial={{ scale: 1.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-white text-sm font-bold w-5 text-center "
                    >
                      {item.quantity}
                    </motion.span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      disabled={item.quantity >= item.stock ? true : false}
                      onClick={() => updateQty(item.id, 1, item.variantIndex)}
                      className={`w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-colors cursor-pointer  ${item.quantity >= item.stock ? "cursor-not-allowed! bg-gray-500!" : ""}`}
                    >
                      <Plus className="w-3 h-3" />
                    </motion.button>
                    {item.quantity >= item.stock ? (
                      <p className="text-red-500 ">Out Stock</p>
                    ) : (
                      false
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-white/70 text-xs font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => removeItem(item.id, item.variantIndex)}
                    className="text-white/30 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <AnimatePresence>
        {cartItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-6 py-5 border-t border-white/10 space-y-4"
          >
            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Subtotal</span>
              <span className="text-white font-bold">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Shipping</span>
              <span className="text-green-400 font-semibold">Free</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex items-center justify-between">
              <span className="text-white font-bold">Total</span>
              <motion.span
                key={totalPrice}
                initial={{ scale: 1.1, color: "#818cf8" }}
                animate={{ scale: 1, color: "#ffffff" }}
                className="text-white font-black text-lg"
              >
                ${totalPrice.toFixed(2)}
              </motion.span>
            </div>

            {/* Checkout button */}
            <Link href="/checkout" onClick={onClose}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-indigo-900/40"
              >
                Checkout <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
