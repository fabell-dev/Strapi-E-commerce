"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { ShoppingCart, UserRound, Search } from "lucide-react";

type Props = {
  categories: string[];
};

export default function Navbar({ categories }: Props) {
  return (
    <nav className="fixed top-0 z-10 min-w-screen py-5 backdrop-filter backdrop-blur-sm bg-white/30 border-background border-b rounded-b-xl flex flex-col md:flex-row  items-center justify-evenly gap-y-5 md:px-5 ">
      <div className="flex items-center justify-evenly px-10 max-w-80 w-full md:w-auto ">
        <Link className="font-bold text-sm" href="/">
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

function SearchBar({ className }: { className: string }) {
  return (
    <>
      <form
        className={`${className} bg-gray-200 border border-black px-2 py-1 rounded-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-gray-700`}
      >
        <input
          className=" text-sm text-black text-bold w-full  min-w-36 px-2 focus:outline-0"
          type="text"
          name="search"
          placeholder="Search for Products..."
        />
        <button type="submit" className="ml-3 ">
          <Search />
        </button>
      </form>
    </>
  );
}

function Icons({ className }: { className: string }) {
  return (
    <>
      <div className={`${className} justify-center items-center gap-x-5`}>
        <SearchBar className="md:flex hidden mr-5" />
        <UserRound className="md:scale-125 scale-100 shrink-0" />
        <ShoppingCart className="md:scale-125 shrink-0" />
      </div>
    </>
  );
}
