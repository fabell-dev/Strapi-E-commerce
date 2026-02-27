"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Link from "next/link";
import { ShoppingCart, UserRound, Search } from "lucide-react";

type Props = {
  categories: string[];
};

export default function Navbar({ categories }: Props) {
  return (
    <nav className="fixed top-0 z-90 min-w-screen py-5 backdrop-filter backdrop-blur-sm bg-white/30 border-background border-b rounded-b-xl flex flex-col md:flex-row  items-center justify-evenly gap-y-5 md:px-20">
      <div className="flex items-center justify-evenly  max-w-80 w-full md:w-auto ">
        <Link className="font-bold text-sm md:text-xl" href="/">
          Your Little Store
        </Link>

        <Icons className="flex  md:hidden" />
      </div>
      <SearchBar className="flex md:hidden px-5 max-w-72 w-full" />

      <div className=" hidden md:flex gap-5  flex-2 items-center justify-center">
        {categories.map((item, index) => (
          <Link href={item} key={index}>
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
      <div className={`${className} justify-center items-center gap-x-5`}>
        <SearchBar className="md:flex hidden mr-5" />
        <button className="cursor-pointer">
          <UserRound className="md:scale-125 scale-100 shrink-0" />
        </button>
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
