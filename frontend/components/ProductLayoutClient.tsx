"use client";
import { motion } from "motion/react";
import { Product } from "@/types/product.types";
import { useState, useEffect } from "react";
import { Bell, Star, ChevronDown } from "lucide-react";
import HeartWhishlist from "./HeartWhishlist";
import VariantSelector from "./VariantSelector";
import StarRating from "./StarRating";
import ProductsSugestedCarrousel from "./ProductsSugestedCarrousel";
import ReviewForm from "./ReviewForm";
import Reviews from "./Reviews";

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

  //Reviews and Rating
  const [numberToShow, setnumberToShow] = useState(3);
  function addMoreReviews() {
    setnumberToShow(numberToShow + 3);
  }
  const ratingCount = product.reviews?.length || 0;
  let rating =
    ratingCount > 0
      ? Number(
          (
            product.reviews!.reduce((sum, review) => sum + review.rating, 0) /
            ratingCount
          ).toFixed(1),
        )
      : 0;

  // Responsive
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isMobile = width < 768 ? true : false;

  return (
    <>
      <section className="flex mt-50 md:mt-30 flex-col gap-y-5 px-10 md:px-40  md:flex-row md:gap-x-10 ">
        <div className="flex justify-evenly w-full md:w-1/2 ">
          <div className="flex flex-col md:w-full h-full md:flex-1">
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-left md:flex md:items-center  justify-between">
              <span className="text-3xl md:text-3xl lg:text-4xl xl:text-5xl">
                {product.name}
              </span>
              {!isMobile && (
                <HeartWhishlist classname=" h-full scale-150 px-10  " />
              )}
            </p>

            <p className="text-xl md:text-3xl  font-bold text-gray-600 mt-3">
              ${product.price}
            </p>
            {/* Rating */}
            {(product.reviews?.length || 0) > 0 && (
              <div className="flex text-sm gap-x-2 md:mt-5 ">
                <p className="">{rating}</p>
                <StarRating rating={rating} count={ratingCount} />
              </div>
            )}
            {!isMobile && (
              <p className="my-5 text-sm md:text-sm lg:text-xl xl:text-2xl">
                {product.description}.
              </p>
            )}

            {/* Conditional Rendering only for Dekstop */}
            {!isMobile && (
              <>
                <div className=" w-full  place-content-end">
                  {hasVariants && (
                    <>
                      <Variants
                        product={product}
                        selectedVariantIndex={selectedVariantIndex}
                        onVariantChange={setSelectedVariantIndex}
                      />
                      <BuyOrRestockButton
                        product={product}
                        selectedVariantIndex={selectedVariantIndex}
                      />
                    </>
                  )}
                  {!hasVariants && (
                    <>
                      <BuyOrRestockButton
                        product={product}
                        selectedVariantIndex={selectedVariantIndex}
                        classname="mt-10"
                      />
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          {isMobile && (
            <HeartWhishlist classname="self-start scale-150 mt-2 ml-5" />
          )}
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img
            className="w-full md:h-[55dvh] md:object-contain rounded-4xl"
            src={`${STRAPI_HOST}${currentImage.url}`}
          ></img>
        </div>

        {/* Conditional Rendering only for mobile */}
        {isMobile && (
          <>
            {hasVariants && (
              <Variants
                product={product}
                selectedVariantIndex={selectedVariantIndex}
                onVariantChange={setSelectedVariantIndex}
              />
            )}

            <BuyOrRestockButton
              product={product}
              selectedVariantIndex={selectedVariantIndex}
            />
          </>
        )}
        {/*------------You may also like---------*/}
      </section>
      <section className="w-full mt-10 md:mt-40">
        <ProductsSugestedCarrousel
          category={product.subCategory?.category?.name}
          currentProductSlug={product.slug}
        />
      </section>

      {/*--------Review Section-------*/}
      <section className="flex flex-col mt-10 mx-10 gap-y-10 md:items-center">
        <div className="flex flex-col items-start md:items-center md:mt-10  ">
          <p className="font-bold text-2xl md:text-4xl">Product Reviews</p>
          {(product.reviews?.length || 0) > 0 && (
            <div className="flex gap-x-2 items-center ">
              <Star className="fill-black" />
              <p className="font-bold text-xl">{rating}</p>
              <p className="text-xs">( {ratingCount} reviews)</p>
            </div>
          )}
        </div>
        {/* Review Form */}
        <ReviewForm productID={product.id} />
        <Reviews reviews={product.reviews} numberToShow={numberToShow} />
        {numberToShow < (product.reviews?.length || 0) ? (
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95, y: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
            }}
            className="border-2 border-black/70 w-1/2 self-center rounded-2xl font-bold cursor-pointer flex justify-center md:w-1/7 md:py-3"
            onClick={addMoreReviews}
          >
            <p> Show More</p>
            <ChevronDown />
          </motion.button>
        ) : (
          <></>
        )}
      </section>
    </>
  );
}

// Variants
type VariantsProps = {
  product: Product;
  selectedVariantIndex: number;
  onVariantChange: (index: number) => void;
};

function Variants({
  product,
  selectedVariantIndex,
  onVariantChange,
}: VariantsProps) {
  const currentStock =
    selectedVariantIndex === -1
      ? product.stock
      : product.variants?.[selectedVariantIndex]?.stock || 0;

  return (
    <>
      <div className="">
        <p className="text-sm font-bold mb-2">Color</p>
        <div className="flex flex-row gap-2 md:flex-wrap items-center">
          <VariantSelector
            product={product}
            selectedVariantIndex={selectedVariantIndex}
            onVariantChange={onVariantChange}
            size="large"
          />
          <div className="ml-5">
            {currentStock === 0 ? (
              <p className="text-red-600">Out of Stock</p>
            ) : currentStock < 5 ? (
              <p className="text-red-500">
                Only <span className="font-bold">{currentStock}</span> in stock
              </p>
            ) : (
              <p className="invisible"></p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Button
type BuyOrRestockButtonProps = {
  product: Product;
  selectedVariantIndex: number;
  classname?: string;
};

function BuyOrRestockButton({
  product,
  selectedVariantIndex,
  classname,
}: BuyOrRestockButtonProps) {
  //Stock
  const currentStock =
    selectedVariantIndex === -1
      ? product.stock
      : product.variants?.[selectedVariantIndex]?.stock || 0;
  const isInStock = currentStock > 0;
  return (
    <>
      <div className={`py-4 ${classname}`}>
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
    </>
  );
}
