"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ProductsGridProps, ProductCardProps } from "@/types/product.types";
import VariantSelector from "./VariantSelector";
import AddToCartButton from "./ShopingCart/AddToCartButton";

interface FlyingItem {
  id: string;
  x: number;
  y: number;
}

const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_URL;

export default function ProductsGrid({
  products,
  strapiHost = STRAPI_HOST,
}: ProductsGridProps) {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

  return (
    <>
      {/* Flying dot animations */}
      <AnimatePresence>
        {flyingItems.map((fly) => (
          <motion.div
            key={fly.id}
            className="fixed z-9999 w-4 h-4 rounded-full bg-amber-400 pointer-events-none"
            style={{ top: fly.y - 8, left: fly.x - 8 }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{
              top: 20,
              left: "calc(100% - 60px)",
              scale: 0.3,
              opacity: 0,
            }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        ))}
      </AnimatePresence>

      <section className="pb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products
            .filter((product) => product.stock > 0)
            .map((product, i) => (
              <ProductCard
                i={i}
                product={product}
                key={product.id}
                strapiHost={strapiHost}
                onAddToCart={(e) => {
                  if (!e) return;
                  const flyId = `${Date.now()}-${product.id}`;
                  setFlyingItems((prev) => [
                    ...prev,
                    { id: flyId, x: e.clientX, y: e.clientY },
                  ]);
                  setTimeout(() => {
                    setFlyingItems((prev) =>
                      prev.filter((f) => f.id !== flyId),
                    );
                  }, 700);
                }}
              />
            ))}
        </div>
      </section>
    </>
  );
}

export function ProductCard({
  product,
  strapiHost,
  i,
  onAddToCart,
}: ProductCardProps & {
  onAddToCart: (e?: React.MouseEvent<HTMLElement>) => void;
}) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(-1);

  const hasVariants = product.variants && product.variants.length > 0;
  const currentImage =
    selectedVariantIndex === -1
      ? product.image
      : product.variants?.[selectedVariantIndex]?.image || product.image;

  const currentStock =
    selectedVariantIndex === -1
      ? product.stock
      : product.variants?.[selectedVariantIndex]?.stock || 0;

  const selectedColor =
    selectedVariantIndex !== -1
      ? product.variants?.[selectedVariantIndex]?.color
      : product.color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.1 + i * 0.08,
        type: "spring",
        stiffness: 200,
      }}
      whileHover={{ y: -10 }}
      className="border rounded-lg overflow-hidden shadow-lg relative h-[43dvh] md:h-full hover:shadow-xl transition-shadow"
    >
      {currentImage && (
        <div className="overflow-hidden w-full h-[15vh] md:h-64">
          <Link href={`/product/${product.slug}`} key={product.id}>
            <motion.img
              src={`${strapiHost}${currentImage.url}`}
              alt={product.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
          </Link>
        </div>
      )}
      <div className="p-4  flex flex-col items-center">
        <Link
          href={`/product/${product.slug}`}
          key={product.id}
          className=" text-gray-900 text-xs sm:text-sm md:text-xl font-light   min-h-[5vh] text-center hover:underline"
        >
          {product.name}
        </Link>
        <p className="text-xl  md:text-2xl font-bold ">${product.price}</p>

        {currentStock === 0 ? (
          <p className="invisible text-xs md:text-sm md:mt-2">placeholder</p>
        ) : currentStock < 5 ? (
          <p className="text-red-500 text-xs md:text-sm md:mt-2">
            Only <span className="font-bold">{currentStock}</span> in stock
          </p>
        ) : (
          <p className="invisible text-xs md:text-sm md:mt-2">placeholder</p>
        )}

        {/*-------Buy Now / Restock Alert Buttons-----*/}
        <AddToCartButton
          classname="mt-2"
          product={product}
          currentStock={currentStock}
          currentImage={currentImage}
          selectedColor={selectedColor}
          onAnimationTrigger={onAddToCart}
        />

        {/* Variants */}
        {hasVariants && (
          <div className="flex flex-row gap-2 md:flex-wrap mt-5">
            <VariantSelector
              product={product}
              selectedVariantIndex={selectedVariantIndex}
              onVariantChange={setSelectedVariantIndex}
              size="small"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
