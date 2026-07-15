import { PixelChoiceBar } from "@/components/ui/shared/PixelChoiceBar";

export function CategoryTabs<T extends string>({
  items,
  value,
  onChange,
  ariaLabel,
  idPrefix,
}: {
  items: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  idPrefix: string;
}) {
  return (
    <PixelChoiceBar
      items={items}
      value={value}
      onChange={onChange}
      ariaLabel={ariaLabel}
      idPrefix={idPrefix}
      kind="filters"
      variant="compact"
    />
  );
}
