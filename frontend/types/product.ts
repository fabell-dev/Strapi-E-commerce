export interface ProductImage {
  id: number;
  documentId: string;
  name: string;
  url: string;
}

export interface ProductVariant {
  id: number;
  color: string;
  image: ProductImage;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  price: number;
  stock: number;
  image: ProductImage;
  variants?: ProductVariant[];
}
