import { Product } from "@/types/product.types";

type Props = {
  product: Product;
  selectedVariantIndex: number;
  onVariantChange: (index: number) => void;
  size?: "small" | "large";
};

// Map de colores a valores hex
const COLOR_MAP: Record<string, string> = {
  red: "#ef4444",
  black: "#000000",
  white: "#ffffff",
  blue: "#3b82f6",
  green: "#10b981",
  yellow: "#eab308",
  purple: "#a855f7",
  pink: "#ec4899",
  orange: "#f97316",
  gray: "#6b7280",
};

function getColorValue(colorName?: string): string {
  if (!colorName) return "#9ca3af";
  return COLOR_MAP[colorName.toLowerCase()] || "#9ca3af";
}

export default function VariantSelector({
  product,
  selectedVariantIndex,
  onVariantChange,
  size = "large",
}: Props) {
  const hasVariants = product.variants && product.variants.length > 0;
  const originalColor = getColorValue(product.color);

  if (!hasVariants) return null;

  const sizeClasses = {
    small: "w-[3dvh] h-[3dvh] md:w-10 md:h-10",
    large: "w-[5dvh] h-[5dvh] md:w-10 md:h-10",
  };

  return (
    <div className="flex flex-row gap-2 md:flex-wrap">
      <button
        onClick={() => onVariantChange(-1)}
        style={{
          backgroundColor: originalColor,
          borderColor: selectedVariantIndex === -1 ? "#000000" : "transparent",
          borderWidth: selectedVariantIndex === -1 ? "2px" : "0px",
        }}
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-sm font-medium transition cursor-pointer hover:opacity-80`}
        title={product.color || "Original"}
      />
      {product.variants!.map((variant, index) => {
        const variantColor = getColorValue(variant.color);

        return (
          <button
            key={index}
            onClick={() => onVariantChange(index)}
            style={{
              backgroundColor: variantColor,
              borderColor:
                selectedVariantIndex === index ? "#000000" : "transparent",
              borderWidth: selectedVariantIndex === index ? "2px" : "0px",
            }}
            className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-xs font-medium transition cursor-pointer hover:opacity-80`}
            title={variant.color}
          />
        );
      })}
    </div>
  );
}
