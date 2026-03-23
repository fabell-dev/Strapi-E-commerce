import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import NavbarServer from "@/components/layout/NavbarServer";
import { getPageInfo } from "@/lib/Strapi/Data/page-metadata";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

import { getCurrentUser } from "@/lib/Strapi/strapi";
import { UserProvider } from "./providers";
import { CartProvider } from "@/components/ShopingCart/CartContext";

const { Page_Title, Page_Description } = await getPageInfo();

export const metadata: Metadata = {
  title: `${Page_Title}` || "E-Commerce Store",
  description: `${Page_Description}` || "A web made with Nextjs and Strapi",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return (
    <html lang="en" className={montserrat.className}>
      <body className="text-black bg-amber-50 flex flex-col min-h-screen">
        <CartProvider>
          <UserProvider user={user}>
            <LayoutWrapper navbar={<NavbarServer />}>{children}</LayoutWrapper>
          </UserProvider>
        </CartProvider>
      </body>
    </html>
  );
}
