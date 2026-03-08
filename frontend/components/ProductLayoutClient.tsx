"use client";
import { Product } from "@/types/product";

type Props = {
  product: Product;
};
const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_URL;

export default function ProductLayoutClient({ product }: Props) {
  return <img src={`${STRAPI_HOST}${product.image.url}`}></img>;
}
