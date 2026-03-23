"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

type Props = {
  navbar: React.ReactNode;
  children: React.ReactNode;
};

export default function LayoutWrapper({ navbar, children }: Props) {
  const pathname = usePathname();
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthRoute && navbar}
      <main className="flex-1">{children}</main>
      {!isAuthRoute && <Footer />}
    </div>
  );
}
