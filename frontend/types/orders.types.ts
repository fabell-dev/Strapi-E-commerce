export interface OrderImageData {
  id: number;
  documentId: string;
  url: string;
  name: string;
}

export interface OrderVariant {
  id: number;
  color: string;
  stock: number;
  image: OrderImageData;
}

export interface OrderItem {
  id: number;
  documentId: string;
  name: string;
  price: number;
  stock: number;
  color: string | null;
  slug: string;
  image: OrderImageData;
  variants: OrderVariant[];
  quantity: number;
  variantIndex?: number;
}

export interface ShippingAddress {
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface Order {
  id: number;
  documentId: string;
  items: OrderItem[];
  totalAmount: number;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "completed";
  shippingAddress: ShippingAddress | null;
  createdAt: string;
  stripePaymentId: string;
  cardLastFour?: string | null;
  cardBrand?: string | null;
}

export interface OrdersResponse {
  data: Order[];
}
