"use client";
import { useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProductsByCategory } from "@/lib/actions/product-actions";
import Link from "next/link";
import { ProductGridItem } from "@/types/product.types";
import { getImageUrl } from "@/lib/utils/image-url";

type Props = {
  category?: string;
  currentProductSlug?: string;
};

export default function ProductsSugestedCarrousel({
  category,
  currentProductSlug,
}: Props) {
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
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: isMobile ? 2 : 1,
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

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    getProductsByCategory(category)
      .then((data) => {
        // Filtrar el producto actual
        const filtered = currentProductSlug
          ? data.filter((p) => p.slug !== currentProductSlug)
          : data;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProducts(filtered);
      })
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-center">
        You may also like
      </h2>
      <div className="flex items-center gap-1 md:px-10 ">
        {/* Botón anterior - Solo mostrar si hay más de 2 productos */}
        {hasMoreThanTwo && (
          <button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className=" shrink-0 bg-black text-white rounded-full p-1 md:p-3 transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 ml-2"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Carrusel */}
        <div className="overflow-hidden flex-1" ref={emblaRef}>
          <div
            className={`flex ${products.length < 2 ? "justify-center " : ""} ${products.length === 2 ? "mx-5 justify-center" : ""}`}
          >
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="shrink-0 px-2 w-1/2  md:w-1/3 h-64 hover:opacity-60"
              >
                <div className="w-full h-full bg-gray-200 rounded-xl overflow-hidden ">
                  <img
                    src={getImageUrl(product.image.url)}
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
            className="shrink-0 bg-black text-white rounded-full p-1 md:p-3 transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 mr-2"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </>
  );
}
