"use client";
import { useState } from "react";
import ButtonAnimated from "./ui/(me)ButtonAnimated";
import { Heart } from "lucide-react";

interface ProductImage {
  id: number;
  documentId: string;
  name: string;
  url: string;
}

interface ProductVariant {
  id: number;
  color: string;
  image: ProductImage;
}

interface Product {
  id: number;
  documentId: string;
  name: string;
  price: number;
  stock: number;
  image: ProductImage;
  color?: string;
  variants?: ProductVariant[];
}

interface ProductsGridProps {
  products: Product[];
  strapiHost?: string;
}

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
    <section className="p-10 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            strapiHost={strapiHost}
          />
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  strapiHost,
}: {
  product: Product;
  strapiHost?: string;
}) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(-1);

  const hasVariants = product.variants && product.variants.length > 0;
  const currentImage =
    selectedVariantIndex === -1
      ? product.image
      : product.variants?.[selectedVariantIndex]?.image || product.image;

  const originalColor = getColorValue(product.color);

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg relative">
      <Heart className="absolute top-5 right-5 cursor-pointer fill-red-500 stroke-0" />
      {currentImage && (
        <img
          src={`${strapiHost}${currentImage.url}`}
          alt={product.name}
          className="w-full h-64 object-cover "
        />
      )}
      <div className="p-4  flex flex-col items-center">
        <h3 className=" text-gray-900 text-xl font-light mb-2">
          {product.name}
        </h3>
        <p className="text-2xl font-bold">${product.price}</p>
        <ButtonAnimated
          text="Add to Cart"
          classname="text-black md:mt-5 mt-3 md:h-10 md:w-50 h-8 w-43 bg-amber-300"
        />

        {/* Variants */}
        {hasVariants && (
          <div className="flex gap-2 flex-wrap mt-5 ">
            <button
              onClick={() => setSelectedVariantIndex(-1)}
              style={{
                backgroundColor: originalColor,
                borderColor:
                  selectedVariantIndex === -1 ? "#000000" : "transparent",
                borderWidth: selectedVariantIndex === -1 ? "2px" : "0px",
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition cursor-pointer hover:opacity-80"
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
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium transition cursor-pointer hover:opacity-80"
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
