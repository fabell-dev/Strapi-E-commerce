"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { Footer } from "./Footer";

type Props = {
  categories: string[];
  children: React.ReactNode;
};

export default function LayoutWrapper({ categories, children }: Props) {
  const pathname = usePathname();
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  return (
    <>
      {!isAuthRoute && <Navbar categories={categories} />}
      {children}
      {!isAuthRoute && <Footer />}
    </>
  );
}
