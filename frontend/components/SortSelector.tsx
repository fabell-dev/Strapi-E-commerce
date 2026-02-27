import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

export function SortSelector({ className }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <NativeSelect className="text-black/70 border border-black/80 rounded-sm ">
        <NativeSelectOption value="done">Name ascending</NativeSelectOption>
        <NativeSelectOption value="cancelled">
          Name descending
        </NativeSelectOption>
        <NativeSelectOption value="todo">
          Price from low to high
        </NativeSelectOption>
        <NativeSelectOption value="in-progress">
          Price from high to low
        </NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
