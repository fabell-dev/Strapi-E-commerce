import { StripeProvider } from "@/components/Checkout/StripeProvider";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StripeProvider>{children}</StripeProvider>;
}
