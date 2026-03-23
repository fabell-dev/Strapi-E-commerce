import Navbar from "./Navbar";
import { fetchCategories } from "@/lib/Strapi/Data/product-data";

export default async function NavbarServer() {
  const categories = await fetchCategories();
  console.log(categories, "ARRPZ");

  return <Navbar categories={categories} />;
}
