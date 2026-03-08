"use client";
import { Product } from "@/types/product.types";
import { useState } from "react";
import { Bell } from "lucide-react";
import HeartWhishlist from "./HeartWhishlist";
import VariantSelector from "./VariantSelector";
import StarRating from "./StarRating";

type Props = {
  product: Product;
};
const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_URL;

export default function ProductLayoutClient({ product }: Props) {
  // Variants
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(-1);
  const hasVariants = product.variants && product.variants.length > 0;
  const currentImage =
    selectedVariantIndex === -1
      ? product.image
      : product.variants?.[selectedVariantIndex]?.image || product.image;

  //Stock
  const currentStock =
    selectedVariantIndex === -1
      ? product.stock
      : product.variants?.[selectedVariantIndex]?.stock || 0;
  const isInStock = currentStock > 0;

  //Rating
  const rating = 4.5;
  const ratingCount = 18;

  return (
    <>
      <section className="flex mt-40 flex-col gap-y-5 px-10">
        <div className="flex justify-evenly relative w-full">
          <div className="flex flex-col mr-10">
            <p className="text-3xl font-bold text-left">{product.name}</p>
            <p className="text-xl font-bold text-gray-600 mt-3">
              ${product.price}
            </p>
            {/* Rating */}
            <div className="flex text-sm gap-x-2">
              <p>{rating}</p>
              <StarRating rating={rating} count={ratingCount} />
            </div>
          </div>
          <HeartWhishlist />
        </div>
        <img
          className="w-full rounded-4xl"
          src={`${STRAPI_HOST}${currentImage.url}`}
        ></img>
        <p>{product.description}</p>

        {/* -----Variants-----*/}
        {hasVariants && (
          <div className="">
            <p className="text-sm font-bold mb-2">Color</p>
            <div className="flex flex-row gap-2 md:flex-wrap items-center">
              <VariantSelector
                product={product}
                selectedVariantIndex={selectedVariantIndex}
                onVariantChange={setSelectedVariantIndex}
                size="large"
              />
              {/*-------Manejar validaciones con el Stock-----*/}
              <div className="ml-5">
                {currentStock === 0 ? (
                  <p className="text-red-600">Out of Stock</p>
                ) : currentStock < 5 ? (
                  <p className="text-red-500">
                    Only <span className="font-bold">{currentStock}</span> in
                    stock
                  </p>
                ) : (
                  <p className="invisible"></p>
                )}
              </div>
            </div>
          </div>
        )}

        {/*-------Buy Now / Restock Alert Buttons-----*/}
        <div className="py-4">
          {isInStock ? (
            <button className="w-full bg-black text-white py-3 rounded-lg font-bold text-lg transition hover:bg-gray-800 cursor-pointer">
              Buy Now
            </button>
          ) : (
            <button className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg font-bold text-lg cursor-not-allowed flex items-center justify-center">
              <Bell className="mr-4" />
              Restock Alert
            </button>
          )}
        </div>
        {/*------------You may also like---------*/}
        <div></div>
      </section>
    </>
  );
}
