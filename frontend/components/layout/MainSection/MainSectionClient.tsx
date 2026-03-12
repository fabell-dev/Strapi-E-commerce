"use client";
import { useState, useMemo, useEffect } from "react";
import { SortSelector } from "../../SortSelector";
import ProductsGrid from "../../ProductsGrid";
import GridPagination from "../../GridPagination";
import { ProductGridItem } from "@/types/product.types";
import { useRouter } from "next/navigation";

interface PaginationData {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface MainSectionClientProps {
  pagination: PaginationData;
  products: ProductGridItem[];
  strapiHost?: string;
}

type SortOption = "name-asc" | "name-desc" | "price-low" | "price-high";

export function MainSectionClient({
  pagination,
  products,
  strapiHost,
}: MainSectionClientProps) {
  const router = useRouter();
  //Pagination
  const [currentPage, setcurrentPage] = useState(pagination.page);
  useEffect(() => {
    setcurrentPage(pagination.page);
  }, [pagination.page]);

  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar sort desde localStorage al montar
  useEffect(() => {
    const savedSort = localStorage.getItem("productSort") as SortOption | null;
    if (
      savedSort &&
      ["name-asc", "name-desc", "price-low", "price-high"].includes(savedSort)
    ) {
      setSortBy(savedSort);
    }
    setIsLoaded(true);
  }, []);

  // Guardar sort en localStorage cuando cambia
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("productSort", sortBy);
    }
  }, [sortBy, isLoaded]);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];

    switch (sortBy) {
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  }, [products, sortBy]);

  // Adjust page size based on screen width
  useEffect(() => {
    const width = window.innerWidth;
    const newPageSize = width < 640 ? 4 : width < 1024 ? 6 : 9;

    if (newPageSize !== pagination.pageSize) {
      router.push(`?page=1&pageSize=${newPageSize}`);
    }
  }, []);

  return (
    <>
      <section
        className="flex flex-col md:mx-40 mx-5 pt-50 sm:pt-20 md:pt-20 scroll-mt-35 "
        id="mainGrid"
      >
        <div className="0"></div>
        <SortSelector
          className="self-center lg:self-end lg:mr-10 mb-5 "
          onSortChange={setSortBy}
          currentSort={sortBy}
        />
        <ProductsGrid products={sortedProducts} strapiHost={strapiHost} />
        {pagination.pageCount > 1 && (
          <GridPagination
            currentpage={currentPage}
            pageSize={pagination.pageSize}
            totalpages={pagination.pageCount}
          />
        )}
      </section>
    </>
  );
}
