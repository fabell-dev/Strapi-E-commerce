"use client";
import { Product } from "@/types/product.types";
import { useState, useContext } from "react";
import { UserContext } from "@/app/providers";
import { motion } from "motion/react";
import { Heart, Star } from "lucide-react";

type Props = {
  product: Product;
};
const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_URL;
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

export default function ProductLayoutClient({ product }: Props) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(-1);
  const user = useContext(UserContext);

  const hasVariants = product.variants && product.variants.length > 0;
  const currentImage =
    selectedVariantIndex === -1
      ? product.image
      : product.variants?.[selectedVariantIndex]?.image || product.image;

  const originalColor = getColorValue(product.color);
  const [isLiked, setIsLiked] = useState(false);
  const getHeartFill = () =>
    isLiked ? "fill-red-500 stroke-0" : "fill-white/70 stroke-2";

  return (
    <>
      <section className="flex mt-40 flex-col gap-y-5 px-10">
        <div className="flex justify-evenly relative w-full">
          <div className="flex flex-col mr-10">
            <p className="text-3xl font-bold text-left">{product.name}</p>
            <p className="text-xl font-bold text-gray-600 mt-3">
              ${product.price}
            </p>
            {/* Temporary */}
            <div className="flex">
              <p>4.4</p>
              <Star className="fill-yellow-400 stroke-0" />
              <Star className="fill-yellow-400 stroke-0" />
              <Star className="fill-yellow-400 stroke-0" />
              <Star className="fill-yellow-400 stroke-0" />
              <Star className="fill-yellow-400 stroke-0" />
              <p>(18)</p>
            </div>
          </div>

          {user && (
            <motion.button
              onClick={() => setIsLiked(!isLiked)}
              animate={isLiked ? { scale: 1.2 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              whileTap={{ scale: 0.9 }}
              className=""
            >
              <Heart className={`cursor-pointer ${getHeartFill()}`} />
            </motion.button>
          )}
        </div>
        <img
          className="w-full rounded-4xl"
          src={`${STRAPI_HOST}${product.image.url}`}
        ></img>
        <p className="">{product.description}</p>

        {/* -----Variants-----*/}
        {hasVariants && (
          <div className="">
            <p className="text-sm font-bold mb-2">Color</p>
            <div className="flex flex-row gap-2 md:flex-wrap  ">
              <button
                onClick={() => setSelectedVariantIndex(-1)}
                style={{
                  backgroundColor: originalColor,
                  borderColor:
                    selectedVariantIndex === -1 ? "#000000" : "transparent",
                  borderWidth: selectedVariantIndex === -1 ? "2px" : "0px",
                }}
                className="w-[5dvh] h-[5dvh] md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-medium transition cursor-pointer hover:opacity-80"
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
                      borderWidth:
                        selectedVariantIndex === index ? "2px" : "0px",
                    }}
                    className="w-[5dvh] h-[5dvh] md:w-10 md:h-10  rounded-full flex items-center justify-center text-xs font-medium transition cursor-pointer hover:opacity-80"
                    title={variant.color}
                  />
                );
              })}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
