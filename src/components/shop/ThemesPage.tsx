import { useEffect } from "react";
import { useGame } from "../../lib/game/store";
import { useWorld, WORLDS, type WorldId } from "../shared/WorldTheme";
import { THEME_PREVIEW_ASSETS } from "../../lib/game/themeAssets";
import { useLocal } from "../../lib/hooks/useLocal";
import { THEMES, DOODADS, THEME_CATEGORIES, DOODAD_CATEGORIES, type ThemeItem, type DoodadItem, type ThemeCategory, type DoodadCategory } from "./shopData";
import { OwnedBadge, PriceBadge, SectionHeader } from "./shopHelpers";
import { CategoryTabs } from "./CategoryTabs";

export function ThemesPage() {
  const { state, dispatch } = useGame();
  const { world, setWorld } = useWorld();
  const { player, inventory } = state;

  const [themeCat, setThemeCat] = useLocal<ThemeCategory | "all">("shop.theme.cat", "all");
  const [doodadCat, setDoodadCat] = useLocal<DoodadCategory | "all">("shop.doodad.cat", "all");

  useEffect(() => {
    THEMES.filter((t) => t.price === 0).forEach((t) => {
      if (!inventory.items.includes(t.id)) dispatch({ type: "ADD_ITEM", itemId: t.id });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const themeOwned = (t: ThemeItem) => inventory.items.includes(t.id) || t.price === 0;
  const themeEquipped = (t: ThemeItem) => world === t.worldId;
  const themeLocked = (t: ThemeItem) => player.level < t.unlockLevel && !themeOwned(t);

  const filteredThemes = THEMES.filter((t) => themeCat === "all" || t.category === themeCat);
  const filteredDoodads = DOODADS.filter((d) => doodadCat === "all" || d.category === doodadCat);

  const buyTheme = (t: ThemeItem) => {
    if (themeOwned(t) || themeLocked(t) || player.coins < t.price) return;
    if (t.price > 0) dispatch({ type: "SPEND_COINS", amount: t.price });
    dispatch({ type: "ADD_ITEM", itemId: t.id });
  };

  const equipTheme = (t: ThemeItem) => {
    if (!themeOwned(t)) return;
    if (WORLDS.some((w) => w.id === t.worldId)) setWorld(t.worldId);
  };

  const doodadOwned = (d: DoodadItem) => inventory.items.includes(d.id);

  const buyDoodad = (d: DoodadItem) => {
    if (doodadOwned(d) || state.player.coins < d.price) return;
    dispatch({ type: "SPEND_COINS", amount: d.price });
    dispatch({ type: "ADD_ITEM", itemId: d.id });
  };

  return (
    <div className="space-y-10">
      {/* Themes */}
      <section>
        <SectionHeader
          title="Dreaming Worlds"
          subtitle="Room themes — swap the sky above your keyboard."
          right={<CategoryTabs items={THEME_CATEGORIES} value={themeCat} onChange={setThemeCat} />}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredThemes.map((t) => {
            const ownedT = themeOwned(t);
            const equipped = themeEquipped(t);
            const locked = themeLocked(t);
            const canAfford = player.coins >= t.price;
            const preview = THEME_PREVIEW_ASSETS[t.worldId];
            return (
              <div key={t.id} className="pixel-card-sm p-3 flex flex-col gap-2" style={{ opacity: locked ? 0.85 : 1 }}>
                <div
                  className="rounded overflow-hidden relative"
                  style={{
                    aspectRatio: "16 / 10",
                    background: "var(--color-muted)",
                    border: "2px solid var(--color-border)",
                  }}
                >
                  {preview && (
                    <img
                      src={preview}
                      alt={t.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      style={{ imageRendering: "pixelated", filter: locked ? "brightness(0.2) grayscale(1)" : "none" }}
                    />
                  )}
                  {locked && (
                    <div className="absolute inset-0 grid place-items-center font-pixel text-[0.8rem]" style={{ color: "var(--color-primary-foreground)" }}>
                      🔒 Lv {t.unlockLevel}
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    {equipped ? <OwnedBadge label="✓ Equipped" color="var(--sky)" /> :
                     ownedT ? <OwnedBadge /> : null}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-pixel text-[0.7rem] truncate">{t.emoji} {locked ? "???" : t.name}</div>
                    <div className="font-pixel text-[0.55rem] text-muted-foreground truncate">
                      {locked ? `Unlock at Level ${t.unlockLevel}` : t.description}
                    </div>
                  </div>
                  <PriceBadge price={t.price} />
                </div>
                <button
                  className={`pixel-btn ${equipped || ownedT ? "pixel-btn-secondary" : ""}`}
                  disabled={locked || (ownedT ? equipped : !canAfford)}
                  onClick={() => (ownedT ? equipTheme(t) : buyTheme(t))}
                >
                  {equipped ? "Equipped" : ownedT ? "Equip" : locked ? "Locked" : !canAfford ? "Need 🪙" : "Buy"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Doodads */}
      <section>
        <SectionHeader
          title="Enchanted Doodads"
          subtitle="Little decorations for your pet's room."
          right={<CategoryTabs items={DOODAD_CATEGORIES} value={doodadCat} onChange={setDoodadCat} />}
        />
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredDoodads.map((d) => {
            const ownedD = doodadOwned(d);
            const canAfford = state.player.coins >= d.price;
            return (
              <div key={d.id} className="pixel-card-sm p-3 flex flex-col items-center text-center gap-2">
                <div
                  className="grid place-items-center rounded"
                  style={{
                    width: "100%", aspectRatio: "1 / 1",
                    background: "var(--color-muted)",
                    border: "2px solid var(--color-border)",
                    fontSize: 36,
                  }}
                >
                  {d.emoji}
                </div>
                <div className="font-pixel text-[0.65rem] leading-tight">{d.name}</div>
                <div className="font-pixel text-[0.5rem] text-muted-foreground leading-tight line-clamp-2 min-h-[1.4em]">
                  {d.description}
                </div>
                <PriceBadge price={d.price} />
                <button
                  className={`pixel-btn w-full ${ownedD ? "pixel-btn-secondary" : ""}`}
                  style={{ padding: "4px 8px", fontSize: "0.55rem" }}
                  disabled={ownedD || !canAfford}
                  onClick={() => buyDoodad(d)}
                >
                  {ownedD ? "Owned" : !canAfford ? "Need 🪙" : "Buy"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
