"use client";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProductsByCategory } from "@/lib/actions/product-actions";
import Link from "next/link";
import { ProductGridItem } from "@/types/product.types";

const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_URL;

type Props = {
  category?: string;
  currentProductSlug?: string;
};

export default function ProductsSugestedCarrousel({
  category,
  currentProductSlug,
}: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 2,
  });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [products, setProducts] = useState<ProductGridItem[]>([]);
  const [loading, setLoading] = useState(false);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  // Fetch productos por categoría
  useEffect(() => {
    if (!category) return;

    setLoading(true);
    getProductsByCategory(category)
      .then((data) => {
        // Filtrar el producto actual
        const filtered = currentProductSlug
          ? data.filter((p) => p.slug !== currentProductSlug)
          : data;
        setProducts(filtered);
      })
      .finally(() => setLoading(false));
  }, [category, currentProductSlug]);

  // Actualizar estado de botones
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setPrevBtnDisabled(!emblaApi.canScrollPrev());
      setNextBtnDisabled(!emblaApi.canScrollNext());
    };

    onSelect();

    emblaApi.on("init", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("init", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-gray-500">Cargando productos sugeridos...</p>
      </div>
    );
  }

  if (!products.length) {
    return null;
  }

  const hasMoreThanTwo = products.length > 2;

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-center">You may also like</h2>
      <div className="flex items-center gap-1 ">
        {/* Botón anterior - Solo mostrar si hay más de 2 productos */}
        {hasMoreThanTwo && (
          <button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className="shrink-0 bg-black text-white rounded-full p-1 transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 ml-2"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Carrusel */}
        <div className="overflow-hidden flex-1" ref={emblaRef}>
          <div
            className={`flex ${products.length < 2 ? "justify-center " : ""} ${products.length === 2 ? "mx-5" : ""}`}
          >
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="shrink-0 px-2 w-1/2 h-64 hover:opacity-60"
              >
                <div className="w-full h-full bg-gray-200 rounded-xl overflow-hidden ">
                  <img
                    src={`${STRAPI_HOST}${product.image.url}`}
                    alt={product.name}
                    className="w-full h-4/5 object-cover rounded-t-xl"
                  />
                  <div className="h-1/5 bg-black/60 text-white rounded-b-xl flex flex-col justify-center">
                    <p className="font-bold truncate px-2 text-xs text-center">
                      {product.name}
                    </p>
                    <p className="text-sm font-bold text-center text-white/80">
                      ${product.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Botón siguiente - Solo mostrar si hay más de 2 productos */}
        {hasMoreThanTwo && (
          <button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className="shrink-0 bg-black text-white rounded-full p-1 transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 mr-2"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </>
  );
}
