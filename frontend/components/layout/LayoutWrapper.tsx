"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { Footer } from "./Footer";

type Props = {
  categories: { name: string; description: string; image: unknown }[];
  children: React.ReactNode;
};

export default function LayoutWrapper({ categories, children }: Props) {
  const pathname = usePathname();
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthRoute && <Navbar categories={categories} />}
      <main className="flex-1">{children}</main>
      {!isAuthRoute && <Footer />}
    </div>
  );
}
