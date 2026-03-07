import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { getPageInfo } from "@/lib/Strapi/Data/page-metadata";
import { fetchCategories } from "@/lib/Strapi/Data/product-data";

import { getCurrentUser } from "@/lib/Strapi/strapi";
import { UserProvider } from "./providers";

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
    <html lang="en">
      <body className="text-black bg-amber-50">
        <UserProvider user={user}>
          <LayoutWrapper categories={categories}>{children}</LayoutWrapper>
        </UserProvider>
      </body>
    </html>
  );
}
