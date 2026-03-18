import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { getPageInfo } from "@/lib/Strapi/Data/page-metadata";
import { fetchCategories } from "@/lib/Strapi/Data/product-data";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

import { getCurrentUser } from "@/lib/Strapi/strapi";
import { UserProvider } from "./providers";
import { CartProvider } from "@/components/ShopingCart/CartContext";
import { StripeProvider } from "@/components/Checkout/StripeProvider";

const { Page_Title, Page_Description, logo } = await getPageInfo();
const categories = await fetchCategories();

export const metadata: Metadata = {
  title: `${Page_Title}`,
  description: `${Page_Description}`,
  icons: {
    icon: logo,
    apple: logo, // Para Apple
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return (
    <html lang="en" className={montserrat.className}>
      <body className="text-black bg-amber-50">
        <StripeProvider>
          <CartProvider>
            <UserProvider user={user}>
              <LayoutWrapper categories={categories}>{children}</LayoutWrapper>
            </UserProvider>
          </CartProvider>
        </StripeProvider>
      </body>
    </html>
  );
}
