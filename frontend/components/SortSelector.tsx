import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

export function SortSelector({ className }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <NativeSelect>
        <NativeSelectOption value="">Select status</NativeSelectOption>
        <NativeSelectOption value="todo">Todo</NativeSelectOption>
        <NativeSelectOption value="in-progress">In Progress</NativeSelectOption>
        <NativeSelectOption value="done">Done</NativeSelectOption>
        <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
