import { useLocal } from "../../lib/hooks/useLocal";
import { type ShopTab } from "./shopData";
import { SegmentedSwitcher } from "./SegmentedSwitcher";
import { PetsPage } from "./PetsPage";
import { ThemesPage } from "./ThemesPage";

export function Shop() {
  const [tab, setTab] = useLocal<ShopTab>("shop.tab", "pets");

  return (
    <div className="pixel-card p-5 sm:p-6">
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

      {/* Animated tab body */}
      <div key={tab} className="shop-tab-enter">
        {tab === "pets" ? <PetsPage /> : <ThemesPage />}
      </div>

      <style>{`
        .shop-tab-enter {
          animation: shop-fade-slide 260ms ease-out;
        }
        @keyframes shop-fade-slide {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
