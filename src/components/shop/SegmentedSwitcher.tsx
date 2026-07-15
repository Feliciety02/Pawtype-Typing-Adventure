import { Palette, PawPrint } from "lucide-react";

import { PixelChoiceBar, type PixelChoice } from "@/components/ui/shared/PixelChoiceBar";
import { type ShopTab } from "@/lib/shop/shopData";

const SHOP_TABS: PixelChoice<ShopTab>[] = [
  { id: "pets", label: "Pets", icon: <PawPrint size={16} /> },
  { id: "themes", label: "Themes & Doodads", icon: <Palette size={16} /> },
];

export function SegmentedSwitcher({
  value,
  onChange,
}: {
  value: ShopTab;
  onChange: (tab: ShopTab) => void;
}) {
  return (
    <PixelChoiceBar
      items={SHOP_TABS}
      value={value}
      onChange={onChange}
      ariaLabel="Shop sections"
      idPrefix="shop-tab"
      kind="tabs"
      variant="segmented"
      panelId="shop-active-panel"
    />
  );
}
