"use client";
import { useState } from "react";
import { motion } from "motion/react";
import ButtonAnimated from "./ui/(me)ButtonAnimated";
import { Heart } from "lucide-react";
import { useContext } from "react";
import { UserContext } from "@/app/providers";
import Link from "next/link";
import { ProductsGridProps, ProductCardProps } from "@/types/product.types";

const { STRAPI_HOST } = process.env;

// Map de colores a valores hex
const COLOR_MAP: Record<string, string> = {
  red: "#ef4444",
  black: "#000000",
  white: "#ffffff",
  blue: "#3b82f6",
  green: "#10b981",
  yellow: "#eab308",
  purple: "#a855f7",
  pink: "#ec4899",
  orange: "#f97316",
  gray: "#6b7280",
};

function getColorValue(colorName?: string): string {
  if (!colorName) return "#9ca3af";
  return COLOR_MAP[colorName.toLowerCase()] || "#9ca3af";
}

export default function ProductsGrid({
  products,
  strapiHost = STRAPI_HOST,
}: ProductsGridProps) {
  return (
    <section className="pb-10">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {products
          .filter((product) => product.stock > 0)
          .map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              strapiHost={strapiHost}
            />
          ))}
      </div>
    </section>
  );
}

export function ProductCard({ product, strapiHost }: ProductCardProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(-1);
  const [isLiked, setIsLiked] = useState(false);
  const user = useContext(UserContext);

  const hasVariants = product.variants && product.variants.length > 0;
  const currentImage =
    selectedVariantIndex === -1
      ? product.image
      : product.variants?.[selectedVariantIndex]?.image || product.image;

  const originalColor = getColorValue(product.color);

  const getHeartFill = () =>
    isLiked ? "fill-red-500 stroke-0" : "fill-white/70 stroke-2";

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg relative h-[43dvh] md:h-full hover:shadow-xl transition-shadow">
      {user && (
        <motion.button
          onClick={() => setIsLiked(!isLiked)}
          animate={isLiked ? { scale: 1.2 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-1 right-1 md:top-5 md:right-5"
        >
          <Heart className={`cursor-pointer ${getHeartFill()}`} />
        </motion.button>
      )}
      {currentImage && (
        <Link href={`/product/${product.slug}`} key={product.id}>
          <img
            src={`${strapiHost}${currentImage.url}`}
            alt={product.name}
            className="w-full h-[15vh] md:h-64 object-cover "
          />
        </Link>
      )}
      <div className="p-4  flex flex-col items-center">
        <h3 className=" text-gray-900 text-xs sm:text-sm md:text-xl font-light   min-h-[5vh] text-center">
          {product.name}
        </h3>
        <p className="text-xl  md:text-2xl font-bold ">${product.price}</p>

        {product.stock < 5 ? (
          <p className="text-red-500 text-xs md:text-sm mt-2">
            Only {product.stock} in stock
          </p>
        ) : (
          <p className="invisible md:mt-2">placeholder</p>
        )}

        <ButtonAnimated
          text="Add to Cart"
          classname="text-black md:mt-2 mt-3 mx-20 w-full sm:w-40 md:w-50  h-[5dvh] md:h-10 bg-amber-300 text-xs sm:text-sm cursor-pointer"
        />

        {/* Variants */}
        {hasVariants && (
          <div className="flex flex-row gap-2 md:flex-wrap mt-5 ">
            <button
              onClick={() => setSelectedVariantIndex(-1)}
              style={{
                backgroundColor: originalColor,
                borderColor:
                  selectedVariantIndex === -1 ? "#000000" : "transparent",
                borderWidth: selectedVariantIndex === -1 ? "2px" : "0px",
              }}
              className="w-[3dvh] h-[3dvh] md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-medium transition cursor-pointer hover:opacity-80"
              title={product.color || "Original"}
            />
            {product.variants!.map((variant, index) => {
              const variantColor = getColorValue(variant.color);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedVariantIndex(index)}
                  style={{
                    backgroundColor: variantColor,
                    borderColor:
                      selectedVariantIndex === index
                        ? "#000000"
                        : "transparent",
                    borderWidth: selectedVariantIndex === index ? "2px" : "0px",
                  }}
                  className="w-[3dvh] h-[3dvh] md:w-10 md:h-10  rounded-full flex items-center justify-center text-xs font-medium transition cursor-pointer hover:opacity-80"
                  title={variant.color}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
