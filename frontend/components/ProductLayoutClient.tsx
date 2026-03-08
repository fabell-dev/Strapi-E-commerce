"use client";
import { Product } from "@/types/product";

type Props = {
  product: Product;
};
const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_URL;

export default function ProductLayoutClient({ product }: Props) {
  return (
    <>
      <div className="flex mt-50 items-center justify-center gap-10">
        <img
          className="w-80 h-80"
          src={`${STRAPI_HOST}${product.image.url}`}
        ></img>
        <p className="font-bold">{product.name}</p>
      </div>
    </>
  );
}
