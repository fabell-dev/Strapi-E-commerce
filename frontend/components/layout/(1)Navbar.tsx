"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { AvatarDropdown } from "../AvatarDropdown";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { searchProducts } from "@/lib/actions/product-actions";

type Props = {
  categories: string[];
};

export default function Navbar({ categories }: Props) {
  const router = useRouter();

  const handleHeroClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push("/");
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 z-90 min-w-screen py-5 backdrop-filter backdrop-blur-sm bg-white/30 border-background border-b rounded-b-xl flex flex-col md:flex-row  items-center justify-evenly gap-5 md:px-40 ">
      <div className="flex items-center justify-evenly max-w-80 w-full md:w-auto ">
        <Link
          className="font-bold text-sm md:text-xl "
          href="/?page=1&pageSize=9"
          onClick={handleHeroClick}
        >
          <span className="block md:hidden">Your Little Store</span>
          <span className="hidden md:block lg:hidden">YLS</span>
          <span className="hidden lg:block">Your Little Store</span>
        </Link>

        <Icons className="flex  md:hidden" />
      </div>

      <SearchBar className="flex md:hidden" />

      <div className=" hidden md:flex gap-5  flex-2 items-center justify-center">
        {categories.map((item, index) => (
          <Link
            href={`/category/${item.toLowerCase().replace(/\s+/g, "-")}`}
            key={index}
          >
            {item}
          </Link>
        ))}
      </div>

      <Icons className="hidden md:flex flex-1" />
      <div className=" md:hidden flex gap-5  flex-2 items-center justify-center">
        {categories.map((item, index) => (
          <Link
            className="font-bold"
            href={`/category/${item.toLowerCase().replace(/\s+/g, "-")}`}
            key={index}
          >
            {item}
          </Link>
        ))}
      </div>
    </nav>
  );
}

function Icons({ className }: { className: string }) {
  return (
    <>
      <div className={`${className} justify-center items-center gap-x-5 `}>
        <SearchBar className="md:flex hidden mr-5" />
        <AvatarDropdown />

        <button className="cursor-pointer">
          <ShoppingCart className="md:scale-125 shrink-0" />
        </button>
      </div>
    </>
  );
}

// -------SearchBar---------
function SearchBar({ className }: { className: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detectar si estamos en una página de categoría
  const getCategoryFromPath = () => {
    const match = pathname.match(/^\/category\/(.+)$/);
    if (match) {
      // Convertir kebab-case a Title Case
      return match[1]
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return null;
  };

  // Detectar si estamos en una página de producto
  const getProductSlugFromPath = () => {
    const match = pathname.match(/^\/product\/(.+)$/);
    return match ? match[1] : null;
  };

  const currentCategory = getCategoryFromPath();
  const currentProductSlug = getProductSlugFromPath();

  const handleSearch = (value: string) => {
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const data = await searchProducts(
          value,
          currentCategory || undefined,
          currentProductSlug || undefined,
        );
        setResults(Array.isArray(data) ? data : []);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleSelectProduct = (slug: string) => {
    router.push(`/product/${slug}`);
    setSearchQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className={`${className} min-w-36 relative`}>
      <InputGroup className="max-w-xs">
        <InputGroupInput
          placeholder="Search for Products..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchQuery.trim().length >= 2 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      {isOpen &&
        (results?.length > 0 ||
          isLoading ||
          searchQuery.trim().length >= 2) && (
          <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Searching...
              </div>
            ) : results?.length > 0 ? (
              <ul className="max-h-80 overflow-y-auto">
                {results.map((product: any) => (
                  <li
                    key={product.id}
                    onMouseDown={() => handleSelectProduct(product.slug)}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 transition"
                  >
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <img
                          src={`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${product.image.url}`}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate text-black">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ${product.price}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No results found
              </div>
            )}
          </div>
        )}
    </div>
  );
}
