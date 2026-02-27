import Navbar from "@/components/Navbar";
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
