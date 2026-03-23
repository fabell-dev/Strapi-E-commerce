"use client";
import { motion, AnimatePresence } from "motion/react";
import { getImageUrl } from "@/lib/utils/image-url";
import { Product } from "@/types/product.types";
import { useState, useEffect } from "react";
import { Star, ChevronDown } from "lucide-react";
import HeartWhishlist from "./HeartWhishlist";
import VariantSelector from "../VariantSelector";
import StarRating from "./StarRating";
import ProductsSugestedCarrousel from "./Carrousel";
import ReviewForm from "./ReviewForm";
import Reviews from "./Reviews";
import AddToCartButton from "../ShopingCart/AddToCartButton";
import { useCart } from "../ShopingCart/CartContext";

type Props = {
  product: Product;
};
const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_URL;

interface FlyingItem {
  id: string;
  x: number;
  y: number;
}

export default function ProductLayout({ product }: Props) {
  // Flying items for animation
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

  // Cart context
  const { cartItems } = useCart();

  // Variants
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

  // Calculate quantity already in cart for this product+variant
  const quantityInCart = cartItems.reduce((sum, item) => {
    if (item.id === product.id) {
      // For products without variants: match items with undefined variantIndex
      // For products with variants: match items with the selected variantIndex
      const itemVariantIndex = hasVariants ? selectedVariantIndex : undefined;
      if (item.variantIndex === itemVariantIndex) {
        return sum + item.quantity;
      }
    }
    return sum;
  }, 0);

  //Reviews and Rating
  const [numberToShow, setnumberToShow] = useState(3);
  function addMoreReviews() {
    setnumberToShow(numberToShow + 3);
  }
  const ratingCount = product.reviews?.length || 0;
  const rating =
    ratingCount > 0
      ? Number(
          (
            product.reviews!.reduce((sum, review) => sum + review.rating, 0) /
            ratingCount
          ).toFixed(1),
        )
      : 0;

  // Responsive
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 0,
  );
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isMobile = width < 768 ? true : false;

  const handleAddToCartAnimation = (e?: React.MouseEvent<HTMLElement>) => {
    if (!e) return;
    const flyId = `${Date.now()}-${product.id}`;
    setFlyingItems((prev) => [
      ...prev,
      { id: flyId, x: e.clientX, y: e.clientY },
    ]);
    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((f) => f.id !== flyId));
    }, 700);
  };

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

      <section className="flex mt-50 md:mt-30 flex-col gap-y-5 px-10 md:px-40  md:flex-row md:gap-x-10 ">
        <div className="flex justify-evenly w-full md:w-1/2 ">
          <div className="flex flex-col md:w-full h-full md:flex-1">
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-left md:flex md:items-center  justify-between">
              <span className="text-3xl md:text-3xl lg:text-4xl xl:text-5xl ">
                {product.name}
              </span>
              {!isMobile && (
                <HeartWhishlist classname=" h-full scale-150 px-5 " />
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
                    </>
                  )}

                  <>
                    <div className="mt-10 w-full flex  justify-center ">
                      <AddToCartButton
                        classname="scale-y-125 max-w-80 "
                        product={product}
                        currentStock={currentStock}
                        currentImage={currentImage}
                        selectedColor={selectedColor}
                        selectedVariantIndex={selectedVariantIndex}
                        quantityInCart={quantityInCart}
                        onAnimationTrigger={handleAddToCartAnimation}
                      />
                    </div>
                  </>
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
            src={getImageUrl(currentImage.url)}
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

            {/*-------Buy Now / Restock Alert Buttons-----*/}
            <AddToCartButton
              product={product}
              currentStock={currentStock}
              currentImage={currentImage}
              selectedColor={selectedColor}
              selectedVariantIndex={selectedVariantIndex}
              quantityInCart={quantityInCart}
              onAnimationTrigger={handleAddToCartAnimation}
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
