import { motion } from "motion/react";
import { useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { Product } from "@/types/product.types";

interface CartItem extends Product {
  quantity: number;
}

// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   image: string;
//   category: string;
// }

// const PRODUCTS: Product[] = [
//   {
//     id: 1,
//     name: "Air Runner Pro",
//     price: 129.99,
//     image:
//       "https://images.unsplash.com/photo-1622760807301-4d2351a5a942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
//     category: "Sneakers",
//   },
//   {
//     id: 2,
//     name: "SoundWave ANC",
//     price: 249.99,
//     image:
//       "https://images.unsplash.com/photo-1578517581165-61ec5ab27a19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
//     category: "Headphones",
//   },
//   {
//     id: 3,
//     name: "Pulse Watch X",
//     price: 399.99,
//     image:
//       "https://images.unsplash.com/photo-1758348844348-acaf8d854665?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
//     category: "Wearable",
//   },
//   {
//     id: 4,
//     name: "Shade Elite",
//     price: 89.99,
//     image:
//       "https://images.unsplash.com/photo-1764333327297-0ebfd9fda541?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
//     category: "Sunglasses",
//   },
// ];

type ShopingCartIconProps = {
  cartproducts: Product;
};

export default function ShopingCartIcon({ products }: ShopingCartIconProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <>
      <motion.button
        ref={cartButtonRef}
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-4 py-2.5 transition-colors cursor-pointer select-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={totalItems > 0 ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <ShoppingCart className="w-5 h-5" />
        </motion.div>

        {/* Desktop label */}
        <span className="hidden sm:inline text-sm font-medium">Cart</span>

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
    </>
  );
}
