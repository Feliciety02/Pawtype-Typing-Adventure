import { useLocal } from "../../hooks/useLocal";
import { type ShopTab } from "@/lib/shop/shopData";
import { AnimatedTabPanel } from "../ui/shared/AnimatedTabPanel";
import { SegmentedSwitcher } from "./SegmentedSwitcher";
import { PetsPage } from "./PetsPage";
import { ThemesPage } from "./ThemesPage";

export function Shop() {
  const [tab, setTab] = useLocal<ShopTab>("shop.tab", "pets");

  return (
    <div className="shop-page pixel-card p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
        <div className="min-w-0">
          <h2 className="font-display text-3xl leading-none">Curiosity Cart</h2>
          <p className="font-pixel text-[0.6rem] text-muted-foreground mt-1">
            {tab === "pets"
              ? "Adopt, collect, and equip your fuzzy pixel pals."
              : "Personalize your world with themes and cozy doodads."}
          </p>
        </div>
        <SegmentedSwitcher value={tab} onChange={setTab} />
      </div>

      <AnimatedTabPanel
        panelKey={tab}
        id="shop-active-panel"
        labelledBy={`shop-tab-${tab}`}
        className="shop-tab-panel"
      >
        {tab === "pets" ? <PetsPage /> : <ThemesPage />}
      </AnimatedTabPanel>
    </div>
  );
}
