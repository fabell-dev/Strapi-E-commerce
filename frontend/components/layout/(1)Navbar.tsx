"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Link from "next/link";
import { ShoppingCart, UserRound, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { AvatarDropdown } from "../AvatarDropdown";

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
    <nav className="fixed top-0 z-90 min-w-screen py-5 backdrop-filter backdrop-blur-sm bg-white/30 border-background border-b rounded-b-xl flex flex-col md:flex-row  items-center justify-evenly gap-5 md:px-40">
      <div className="flex items-center justify-evenly max-w-80 w-full md:w-auto">
        <Link
          className="font-bold text-sm md:text-xl "
          href="/"
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
          <Link href={`/${item}`} key={index}>
            {item}
          </Link>
        ))}
      </div>

      <Icons className="hidden md:flex flex-1" />
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

export function SearchBar({ className }: { className: string }) {
  return (
    <div className={`${className} min-w-36`}>
      <InputGroup className="max-w-xs">
        <InputGroupInput placeholder="Search for Products..." />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
