import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { getHomePageInfo } from "@/lib/Strapi/Data/home-page";
import { fetchProductInfo } from "@/lib/Strapi/Data/product-data";
import Hero from "@/components/Hero";
import ProductsGrid from "@/components/ProductsGrid";

const { STRAPI_HOST } = process.env;

export default async function Home() {
  const pageInfo = await getHomePageInfo();
  const products = await fetchProductInfo();

  return (
    <>
      <main className="h-screen bg-amber-50">
        <Hero pageInfo={pageInfo}></Hero>
        <div className="flex flex-col">
          <SortingSelect className=" self-end mr-10" />
          <ProductsGrid products={products} strapiHost={STRAPI_HOST} />
          <PaginationP />
        </div>
      </main>
    </>
  );
}
export function PaginationP({ className }: { className?: string }) {
  return (
    <div className={`${className} bg-red-500`}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export function SortingSelect({ className }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <NativeSelect>
        <NativeSelectOption value="">Select status</NativeSelectOption>
        <NativeSelectOption value="todo">Todo</NativeSelectOption>
        <NativeSelectOption value="in-progress">In Progress</NativeSelectOption>
        <NativeSelectOption value="done">Done</NativeSelectOption>
        <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
