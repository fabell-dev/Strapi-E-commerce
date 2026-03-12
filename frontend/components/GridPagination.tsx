"use client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface GridPaginationProps {
  currentpage: number;
  pageSize: number;
  totalpages: number;
  classname?: string;
}

export default function GridPagination({
  currentpage,
  pageSize,
  totalpages,
  classname,
}: GridPaginationProps) {
  const router = useRouter();
  const handlePageChange = (newPage: number) => {
    router.push(`?page=${newPage}&pageSize=${pageSize}`);
    setTimeout(() => {
      const mainGrid = document.getElementById("mainGrid");
      if (mainGrid) {
        mainGrid.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };
  return (
    <div className={`${classname} `}>
      <Pagination>
        <PaginationContent>
          <PaginationPrevious
            onClick={() => currentpage > 1 && handlePageChange(currentpage - 1)}
            className={
              currentpage === 1
                ? " opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }
          />
          {Array.from({ length: totalpages }).map((_, i) => (
            <PaginationItem key={i + 1} className="cursor-pointer">
              <PaginationLink
                onClick={() => handlePageChange(i + 1)}
                isActive={currentpage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationNext
            onClick={() =>
              currentpage < totalpages && handlePageChange(currentpage + 1)
            }
            className={
              currentpage === totalpages
                ? " opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }
          />
        </PaginationContent>
      </Pagination>
    </div>
  );
}
