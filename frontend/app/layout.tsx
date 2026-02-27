import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { getPageInfo } from "@/lib/Strapi/Data/page-info";
import { getProductCategories } from "@/lib/Strapi/Data/product-data";

const { Page_Title, Page_Description, logo } = await getPageInfo();
const categories = await getProductCategories();

export const metadata: Metadata = {
  title: `${Page_Title}`,
  description: `${Page_Description}`,
  icons: {
    icon: logo,
    apple: logo, // Para Apple
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="text-black ">
        <LayoutWrapper categories={categories}>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
