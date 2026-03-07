import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

type SortOption = "name-asc" | "name-desc" | "price-low" | "price-high";

export function SortSelector({
  className,
  onSortChange,
  currentSort,
}: {
  className?: string;
  onSortChange?: (sort: SortOption) => void;
  currentSort?: SortOption;
}) {
  return (
    <div className={`${className}`}>
      <NativeSelect
        className="text-black/70 border border-black/80 rounded-sm"
        value={currentSort || "name-asc"}
        onChange={(e) => {
          const value = e.target.value as SortOption;
          onSortChange?.(value);
        }}
      >
        <NativeSelectOption value="name-asc">Name ascending</NativeSelectOption>
        <NativeSelectOption value="name-desc">
          Name descending
        </NativeSelectOption>
        <NativeSelectOption value="price-low">
          Price from low to high
        </NativeSelectOption>
        <NativeSelectOption value="price-high">
          Price from high to low
        </NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
