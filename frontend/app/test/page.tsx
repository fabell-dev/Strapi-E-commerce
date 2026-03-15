import { fetchProducts } from "@/lib/Strapi/Data/product-data";
import { ShoppingCartNew } from "@/components/ShopingCart/ShoppingCart";

const { data: products } = await fetchProducts(1, 5);

export default function page() {
  return (
    <>
      <ShoppingCartNew />
    </>
  );
}
