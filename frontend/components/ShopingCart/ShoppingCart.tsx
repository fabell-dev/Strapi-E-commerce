import { useState, useRef } from "react";
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

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Air Runner Pro",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1622760807301-4d2351a5a942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "Sneakers",
  },
  {
    id: 2,
    name: "SoundWave ANC",
    price: 249.99,
    image:
      "https://images.unsplash.com/photo-1578517581165-61ec5ab27a19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "Headphones",
  },
  {
    id: 3,
    name: "Pulse Watch X",
    price: 399.99,
    image:
      "https://images.unsplash.com/photo-1758348844348-acaf8d854665?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "Wearable",
  },
  {
    id: 4,
    name: "Shade Elite",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1764333327297-0ebfd9fda541?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "Sunglasses",
  },
];

// Flying item animation state
interface FlyingItem {
  id: string;
  x: number;
  y: number;
}

export function ShoppingCartDemo() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [addedId, setAddedId] = useState<number | null>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const addToCart = (product: Product, e: React.MouseEvent) => {
    // Flying dot animation from click to cart button
    const cartRect = cartButtonRef.current?.getBoundingClientRect();
    if (cartRect) {
      const flyId = `${Date.now()}-${product.id}`;
      const startX = e.clientX;
      const startY = e.clientY;
      setFlyingItems((prev) => [...prev, { id: flyId, x: startX, y: startY }]);
      setTimeout(() => {
        setFlyingItems((prev) => prev.filter((f) => f.id !== flyId));
      }, 700);
    }

    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 600);

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0),
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const cartButtonRect = cartButtonRef.current?.getBoundingClientRect();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex flex-col">
      {/* Flying dot animations */}
      <AnimatePresence>
        {flyingItems.map((fly) => (
          <motion.div
            key={fly.id}
            className="fixed z-[9999] w-4 h-4 rounded-full bg-indigo-400 pointer-events-none"
            style={{ top: fly.y - 8, left: fly.x - 8 }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{
              top:
                (cartButtonRect?.top ?? 0) +
                (cartButtonRect?.height ?? 0) / 2 -
                8,
              left: (cartButtonRect?.right ?? 0) - 24,
              scale: 0.3,
              opacity: 0,
            }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        ))}
      </AnimatePresence>

      {/* NAVBAR */}
      <nav className="relative z-50 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/10 backdrop-blur-sm bg-white/5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-white font-black text-xl tracking-tight"
        >
          <span className="text-indigo-400">APEX</span>STORE
        </motion.div>

        {/* Cart Button */}
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
      </nav>

      {/* PRODUCTS GRID */}
      <main className="flex-1 px-4 sm:px-8 py-10 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-white text-3xl font-black mb-1">
            Featured Products
          </h1>
          <p className="text-white/40 text-sm">
            Click "Add to Cart" and watch the magic happen ✨
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRODUCTS.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1 + i * 0.08,
                type: "spring",
                stiffness: 200,
              }}
              whileHover={{ y: -4 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm group"
            >
              <div className="relative h-44 overflow-hidden bg-white/5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold text-sm mb-1">
                  {product.name}
                </h3>
                <p className="text-indigo-300 font-black text-lg mb-3">
                  ${product.price.toFixed(2)}
                </p>

                <motion.button
                  onClick={(e) => addToCart(product, e)}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all cursor-pointer select-none
                    ${
                      addedId === product.id
                        ? "bg-green-500 text-white"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white"
                    }`}
                  whileTap={{ scale: 0.95 }}
                  animate={
                    addedId === product.id ? { scale: [1, 1.08, 1] } : {}
                  }
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
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* CART DRAWER OVERLAY */}
      <AnimatePresence>
        {isOpen && (
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
              className="fixed z-50 bg-slate-900 border-white/10 flex flex-col
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
              // Override for desktop: slide from right
            >
              {/* Using CSS for responsive animation direction */}
              <CartPanel
                cartItems={cartItems}
                totalItems={totalItems}
                totalPrice={totalPrice}
                onClose={() => setIsOpen(false)}
                onUpdateQty={updateQty}
                onRemove={removeItem}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile floating cart button (visible when cart has items) */}
      <AnimatePresence>
        {totalItems > 0 && !isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 sm:hidden bg-indigo-600 text-white rounded-full px-5 py-3.5 shadow-2xl shadow-indigo-900/60 flex items-center gap-3 cursor-pointer"
            whileTap={{ scale: 0.92 }}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="font-bold text-sm">
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </span>
            <span className="text-indigo-200 font-semibold text-sm">
              ${totalPrice.toFixed(2)}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Cart Panel ──────────────────────────────────────────────────────────────

function CartPanel({
  cartItems,
  totalItems,
  totalPrice,
  onClose,
  onUpdateQty,
  onRemove,
}: {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  onClose: () => void;
  onUpdateQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}) {
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
                key={item.id}
                layout
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">
                    {item.name}
                  </p>
                  <p className="text-indigo-300 text-sm font-bold">
                    ${item.price.toFixed(2)}
                  </p>
                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => onUpdateQty(item.id, -1)}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </motion.button>
                    <motion.span
                      key={item.quantity}
                      initial={{ scale: 1.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-white text-sm font-bold w-5 text-center"
                    >
                      {item.quantity}
                    </motion.span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => onUpdateQty(item.id, 1)}
                      className="w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </motion.button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-white/70 text-xs font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => onRemove(item.id)}
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
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-indigo-900/40"
            >
              Checkout <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
