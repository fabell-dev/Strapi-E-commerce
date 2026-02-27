"use client";

import { usePathname } from "next/navigation";
import Navbar from "./layout/(1)Navbar";
import { Footer } from "./layout/(4)Footer";

type Props = {
  categories: string[];
  children: React.ReactNode;
};

export default function LayoutWrapper({ categories, children }: Props) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/login");

  return (
    <>
      {!isAuthRoute && <Navbar categories={categories} />}
      {children}
      {!isAuthRoute && <Footer />}
    </>
  );
}
