"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { Product } from "@/types/product.types";
import { useCart } from "./CartContext";

interface AddToCartButtonProps {
  classname?: string;
  product: Product;
  currentStock: number;
  currentImage: Product["image"];
  selectedColor?: string;
  onAnimationTrigger?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function AddToCartButton({
  classname,
  product,
  currentStock,
  currentImage,
  selectedColor,
  onAnimationTrigger,
}: AddToCartButtonProps) {
  const [addedId, setAddedId] = useState<number | null>(null);
  const { addToCart } = useCart();
  const isInStock = currentStock > 0;

  const handleAddToCart = (e?: React.MouseEvent<HTMLElement>) => {
    if (!isInStock) return;

    // Set added feedback
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 600);

    // Trigger flying dot animation
    if (onAnimationTrigger && e) {
      onAnimationTrigger(e as React.MouseEvent<HTMLButtonElement>);
    }

    // Add to cart with selected variant info
    const cartProduct: Product = {
      ...product,
      stock: currentStock,
      image: currentImage,
      ...(selectedColor && { color: selectedColor }),
    };
    addToCart(cartProduct);
  };

  return (
    <>
      {isInStock ? (
        <motion.button
          onClick={handleAddToCart}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all cursor-pointer select-none text-black
                    ${
                      addedId === product.id
                        ? "bg-green-500 "
                        : "bg-yellow-300 hover:bg-yellow-400 "
                    }${classname}`}
          whileTap={{ scale: 0.95 }}
          animate={addedId === product.id ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {addedId === product.id ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-1"
              >
                ✓ Added!
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      ) : (
        <motion.button
          disabled
          className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold cursor-not-allowed select-none bg-gray-400 text-white"
        >
          Out of Stock
        </motion.button>
      )}
    </>
  );
}
