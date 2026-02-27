import Navbar from "@/components/layout/(1)Navbar";
import { getProductCategories } from "@/lib/Strapi/Data/product-data";

const categories = await getProductCategories();

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Navbar categories={categories} />
      {children}
    </main>
  );
}
