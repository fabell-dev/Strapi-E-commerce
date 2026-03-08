"use client";
import { useState } from "react";
import ButtonAnimated from "./ui/(me)ButtonAnimated";
import Link from "next/link";
import { ProductsGridProps, ProductCardProps } from "@/types/product.types";
import HeartWhishlist from "./HeartWhishlist";

const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_URL;

// Map de colores a valores hex
export const COLOR_MAP: Record<string, string> = {
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

  const hasVariants = product.variants && product.variants.length > 0;
  const currentImage =
    selectedVariantIndex === -1
      ? product.image
      : product.variants?.[selectedVariantIndex]?.image || product.image;

  const currentStock =
    selectedVariantIndex === -1
      ? product.stock
      : product.variants?.[selectedVariantIndex]?.stock || 0;
  const isInStock = currentStock > 0;

  const originalColor = getColorValue(product.color);
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg relative h-[43dvh] md:h-full hover:shadow-xl transition-shadow">
      <HeartWhishlist classname="absolute top-1 right-1 md:top-5 md:right-5" />
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
        {isInStock ? (
          <ButtonAnimated
            text="Add to Cart"
            classname="text-black md:mt-2 mt-3 mx-20 w-full sm:w-40 md:w-50  h-[5dvh] md:h-10 bg-amber-300 text-xs sm:text-sm cursor-pointer"
          />
        ) : (
          <ButtonAnimated
            text="Out of Stock"
            classname="text-black md:mt-2 mt-3 mx-20 w-full sm:w-40 md:w-50  h-[5dvh] md:h-10 bg-gray-400 text-xs sm:text-sm cursor-not-allowed"
          />
        )}

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
