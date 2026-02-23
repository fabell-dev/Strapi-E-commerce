"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { ShoppingCart, UserRound, Search } from "lucide-react";

type Props = {
  categories: string[];
};

export default function Navbar({ categories }: Props) {
  return (
    <nav className="fixed top-0 z-10 min-w-screen py-3 backdrop-filter md:backdrop-blur-lg bg-background md:bg-transparent border-background border-b rounded-b-xl flex justify-between items-center px-4">
      <Link className="" href="/">
        Home
      </Link>
      <div className="flex gap-5">
        {categories.map((item, index) => (
          <Link href={item} key={index}>
            {item}
          </Link>
        ))}
      </div>
      <form className="flex">
        <input type="text" name="search" placeholder="Search for Products..." />
        <button type="submit">
          <Search />
        </button>
      </form>
      <div className="flex">
        <UserRound />
        <ShoppingCart />
      </div>

      <ThemeToggle />
    </nav>
  );
}
