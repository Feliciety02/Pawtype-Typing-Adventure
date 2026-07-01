import { useEffect, useMemo, useState } from "react";
import { useGame } from "../lib/game/store";
import { useWorld, WORLDS, type WorldId } from "./WorldTheme";
import { THEME_PREVIEW_ASSETS } from "../lib/game/themeAssets";
import type { PetType } from "../lib/game/types";

/* =========================================================================
 * Data model
 * ========================================================================= */

type Rarity = "common" | "rare" | "epic" | "legendary" | "mythic";
type PetSpecies = "cat" | "dog" | "rabbit" | "dragon" | "other";

type PetItem = {
  id: string;
  petType: PetType;
  name: string;
  species: PetSpecies;
  emoji: string;
  price: number;
  rarity: Rarity;
  unlockLevel: number;
  description: string;
  addedAt: number; // for "newest" sort
};

type ThemeCategory = "forest" | "beach" | "snow" | "castle" | "space" | "cafe" | "garden" | "special";

type ThemeItem = {
  id: string;          // shop item id (theme-*)
  worldId: WorldId;    // for preview asset
  name: string;
  emoji: string;
  price: number;
  category: ThemeCategory;
  description: string;
  unlockLevel: number;
};

type DoodadCategory = "furniture" | "plants" | "lights" | "outdoor" | "decor" | "special";

type DoodadItem = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  category: DoodadCategory;
  description: string;
};

const PETS: PetItem[] = [
  { id: "pet-cat",     petType: "cat",     name: "Orange Tabby",  species: "cat",    emoji: "🐱", price: 0,   rarity: "common",    unlockLevel: 1,  description: "Friendly explorer with a curious tail-flick.", addedAt: 1 },
  { id: "pet-dog",     petType: "dog",     name: "Pixel Pup",     species: "dog",    emoji: "🐶", price: 400, rarity: "common",    unlockLevel: 1,  description: "A wagging pixel pup who loves the keyboard.",  addedAt: 2 },
  { id: "pet-rabbit",  petType: "rabbit",  name: "Flopsy",        species: "rabbit", emoji: "🐰", price: 350, rarity: "common",    unlockLevel: 2,  description: "Fluffy pixel bunny with a hop in every combo.", addedAt: 3 },
  { id: "pet-fox",     petType: "fox",     name: "Sly",           species: "other",  emoji: "🦊", price: 500, rarity: "rare",      unlockLevel: 4,  description: "Clever fox that steals hearts and typos.",     addedAt: 4 },
  { id: "pet-penguin", petType: "penguin", name: "Chilly",        species: "other",  emoji: "🐧", price: 450, rarity: "rare",      unlockLevel: 5,  description: "Waddling pixel penguin, cool under pressure.", addedAt: 5 },
  { id: "pet-panda",   petType: "panda",   name: "Bamboo",        species: "other",  emoji: "🐼", price: 600, rarity: "epic",      unlockLevel: 8,  description: "A roly-poly pixel panda who naps on your keys.", addedAt: 6 },
  { id: "pet-dragon",  petType: "dragon",  name: "Ember",         species: "dragon", emoji: "🐉", price: 800, rarity: "legendary", unlockLevel: 12, description: "Tiny pixel dragon fueled by combo streaks.",  addedAt: 7 },
];

const THEMES: ThemeItem[] = [
  { id: "theme-cafe-preview",   worldId: "cafe",      name: "Cozy Café",        emoji: "☕",  price: 0,    category: "cafe",   unlockLevel: 1, description: "Warm terracotta & cream. Your starting hearth." },
  { id: "theme-forest-preview", worldId: "forest",    name: "Mossy Forest",     emoji: "🌲",  price: 0,    category: "forest", unlockLevel: 1, description: "Ferns, dew, and dappled light." },
  { id: "theme-ocean-preview",  worldId: "ocean",     name: "Tide Pool",        emoji: "🌊",  price: 0,    category: "beach",  unlockLevel: 1, description: "Salt breeze and seafoam." },
  { id: "theme-sakura-preview", worldId: "sakura",    name: "Sakura Park",      emoji: "🌸",  price: 0,    category: "garden", unlockLevel: 1, description: "Petals drift in the wind." },
  { id: "theme-castle-preview", worldId: "castle",    name: "Royal Castle",     emoji: "🏰",  price: 0,    category: "castle", unlockLevel: 1, description: "Velvet drapes & gold trim." },
  { id: "theme-space-preview",  worldId: "space",     name: "Stardust",         emoji: "🌌",  price: 0,    category: "space",  unlockLevel: 1, description: "Neon comets in deep night." },
  { id: "theme-autumn",         worldId: "autumn",    name: "Autumn Cottage",   emoji: "🍂",  price: 150,  category: "forest", unlockLevel: 3, description: "Crisp air & golden leaves." },
  { id: "theme-mushroom",       worldId: "mushroom",  name: "Mushroom Village", emoji: "🍄",  price: 150,  category: "forest", unlockLevel: 5, description: "Glowing spores & twisted roots." },
  { id: "theme-moonlit",        worldId: "moonlit",   name: "Moonlit Garden",   emoji: "🌙",  price: 150,  category: "garden", unlockLevel: 4, description: "Silver beams & jasmine scent." },
  { id: "theme-rainy",          worldId: "rainy",     name: "Rainy Library",    emoji: "🌧️", price: 150,  category: "special",unlockLevel: 6, description: "Steamy windows & old paper." },
  { id: "theme-snowy",          worldId: "snowy",     name: "Snowy Cabin",      emoji: "❄️", price: 150,  category: "snow",   unlockLevel: 4, description: "Frosted glass & crackling fire." },
  { id: "theme-sunflower",      worldId: "sunflower", name: "Sunflower Meadow", emoji: "🌻",  price: 150,  category: "garden", unlockLevel: 3, description: "Golden fields & buzzing bees." },
];

const DOODADS: DoodadItem[] = [
  { id: "doodad-bookshelf",   name: "Bookshelf",     emoji: "📚", price: 120, category: "furniture", description: "Stacked with dog-eared favorites." },
  { id: "doodad-bench",       name: "Wooden Bench",  emoji: "🪑", price: 100, category: "furniture", description: "A cozy perch for your pet." },
  { id: "doodad-picnic",      name: "Picnic Basket", emoji: "🧺", price: 90,  category: "furniture", description: "Snacks and stitched blankets." },
  { id: "doodad-flowerpot",   name: "Flower Pot",    emoji: "🪴", price: 60,  category: "plants",    description: "A cheerful desk companion." },
  { id: "doodad-tree",        name: "Potted Tree",   emoji: "🌳", price: 180, category: "plants",    description: "A tiny forest in your room." },
  { id: "doodad-cactus",      name: "Cactus",        emoji: "🌵", price: 70,  category: "plants",    description: "Prickly but polite." },
  { id: "doodad-lantern",     name: "Paper Lantern", emoji: "🏮", price: 130, category: "lights",    description: "Warm amber glow at dusk." },
  { id: "doodad-campfire",    name: "Campfire",      emoji: "🔥", price: 200, category: "outdoor",   description: "Crackle, spark, cozy." },
  { id: "doodad-mailbox",     name: "Mailbox",       emoji: "📮", price: 110, category: "outdoor",   description: "For pixel-pal postcards." },
  { id: "doodad-star",        name: "Star Garland",  emoji: "⭐", price: 80,  category: "decor",     description: "Twinkles softly overhead." },
  { id: "doodad-crt",         name: "CRT Filter",    emoji: "📺", price: 150, category: "special",   description: "Retro scanline shader for the whole app." },
  { id: "doodad-sparkle",     name: "Sparkle Trail", emoji: "✨", price: 200, category: "special",   description: "Particles follow your typing." },
];

const RARITY_COLOR: Record<Rarity, string> = {
  common:    "var(--muted-foreground)",
  rare:      "#3aa0d8",
  epic:      "#a06bff",
  legendary: "#e0a020",
  mythic:    "#e04a80",
};

const RARITY_ORDER: Record<Rarity, number> = { common: 0, rare: 1, epic: 2, legendary: 3, mythic: 4 };

/* =========================================================================
 * Local UI helpers
 * ========================================================================= */

function useLocal<T>(key: string, initial: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch { return initial; }
  });
  const set = (n: T) => {
    setV(n);
    try { localStorage.setItem(key, JSON.stringify(n)); } catch {}
  };
  return [v, set];
}

function RarityBadge({ rarity }: { rarity: Rarity }) {
  return (
    <span
      className="font-pixel text-[0.55rem] px-2 py-0.5 rounded"
      style={{
        background: "color-mix(in oklab, " + RARITY_COLOR[rarity] + " 18%, transparent)",
        color: RARITY_COLOR[rarity],
        border: `1px solid ${RARITY_COLOR[rarity]}`,
      }}
    >
      {rarity.toUpperCase()}
    </span>
  );
}

function OwnedBadge({ label = "Owned", color = "var(--leaf)" }: { label?: string; color?: string }) {
  return (
    <span
      className="font-pixel text-[0.55rem] px-2 py-0.5 rounded"
      style={{
        background: "color-mix(in oklab, " + color + " 22%, transparent)",
        color,
        border: `1px solid ${color}`,
      }}
    >
      {label}
    </span>
  );
}

function PriceBadge({ price }: { price: number }) {
  return (
    <span className="font-pixel text-[0.7rem]" style={{ color: "var(--coin)" }}>
      🪙 {price === 0 ? "Free" : price.toLocaleString()}
    </span>
  );
}

function SectionHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-4 flex-wrap">
      <div>
        <h3 className="font-display text-2xl leading-none">{title}</h3>
        {subtitle && <p className="font-pixel text-[0.6rem] text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

/* =========================================================================
 * Segmented Switcher
 * ========================================================================= */

type ShopTab = "pets" | "themes";

function SegmentedSwitcher({ value, onChange }: { value: ShopTab; onChange: (t: ShopTab) => void }) {
  const tabs: { id: ShopTab; label: string; icon: string }[] = [
    { id: "pets",   label: "Pets",             icon: "🐾" },
    { id: "themes", label: "Themes & Doodads", icon: "🏡" },
  ];
  return (
    <div
      className="inline-flex p-1 rounded-lg gap-1"
      style={{
        background: "var(--color-muted)",
        border: "2px solid var(--color-border)",
        boxShadow: "3px 3px 0 0 var(--color-border)",
      }}
    >
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="font-pixel text-[0.7rem] px-4 py-2 rounded-md transition-all"
            style={{
              background: active ? "var(--color-primary)" : "transparent",
              color: active ? "var(--color-primary-foreground)" : "var(--color-foreground)",
              transform: active ? "translateY(-1px)" : "none",
              boxShadow: active ? "2px 2px 0 0 var(--color-border)" : "none",
            }}
          >
            <span className="mr-1">{t.icon}</span>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================================
 * Pets Page
 * ========================================================================= */

type PetCategory = "all" | "cat" | "dog" | "rabbit" | "dragon";
type PetSort = "newest" | "price" | "rarity" | "alpha";

function PetsPage() {
  const { state, dispatch } = useGame();
  const { player, inventory } = state;

  const [category, setCategory] = useLocal<PetCategory>("shop.pet.cat", "all");
  const [owned, setOwned] = useLocal<boolean>("shop.pet.owned", false);
  const [notOwned, setNotOwned] = useLocal<boolean>("shop.pet.notOwned", false);
  const [favOnly, setFavOnly] = useLocal<boolean>("shop.pet.fav", false);
  const [sort, setSort] = useLocal<PetSort>("shop.pet.sort", "newest");
  const [favorites, setFavorites] = useLocal<string[]>("shop.pet.favorites", []);
  const [selectedId, setSelectedId] = useLocal<string>("shop.pet.selected", PETS[0].id);

  const isOwned = (p: PetItem) => inventory.pets.some((x) => x.type === p.petType);
  const isEquipped = (p: PetItem) => inventory.activePet === p.petType;
  const isLocked = (p: PetItem) => player.level < p.unlockLevel;
  const isFav = (id: string) => favorites.includes(id);

  const toggleFav = (id: string) => {
    setFavorites(isFav(id) ? favorites.filter((x) => x !== id) : [...favorites, id]);
  };

  const filtered = useMemo(() => {
    let list = [...PETS];
    if (category !== "all") {
      list = list.filter((p) => p.species === category || (category === "dragon" && p.species === "dragon"));
    }
    if (owned && !notOwned) list = list.filter(isOwned);
    if (notOwned && !owned) list = list.filter((p) => !isOwned(p));
    if (favOnly) list = list.filter((p) => isFav(p.id));

    switch (sort) {
      case "newest": list.sort((a, b) => b.addedAt - a.addedAt); break;
      case "price":  list.sort((a, b) => a.price - b.price); break;
      case "rarity": list.sort((a, b) => RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity]); break;
      case "alpha":  list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, owned, notOwned, favOnly, sort, favorites, inventory]);

  const selected = PETS.find((p) => p.id === selectedId) ?? filtered[0] ?? PETS[0];

  const buy = (p: PetItem) => {
    if (isOwned(p) || isLocked(p) || player.coins < p.price) return;
    if (p.price > 0) dispatch({ type: "SPEND_COINS", amount: p.price });
    dispatch({
      type: "ADOPT_PET",
      pet: { type: p.petType, name: p.name, xp: 0, level: 1, adoptedAt: Date.now() },
    });
  };

  const equip = (p: PetItem) => {
    if (!isOwned(p)) return;
    dispatch({ type: "SET_ACTIVE_PET", petType: p.petType });
  };

  const totals: Record<PetCategory, [number, number]> = {
    all:    [PETS.filter(isOwned).length, PETS.length],
    cat:    [PETS.filter((p) => p.species === "cat" && isOwned(p)).length, PETS.filter((p) => p.species === "cat").length],
    dog:    [PETS.filter((p) => p.species === "dog" && isOwned(p)).length, PETS.filter((p) => p.species === "dog").length],
    rabbit: [PETS.filter((p) => p.species === "rabbit" && isOwned(p)).length, PETS.filter((p) => p.species === "rabbit").length],
    dragon: [PETS.filter((p) => p.species === "dragon" && isOwned(p)).length, PETS.filter((p) => p.species === "dragon").length],
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_300px]">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-4 self-start pixel-card-sm p-4 space-y-5">
        <div>
          <div className="font-pixel text-[0.6rem] text-muted-foreground mb-2">Categories</div>
          <div className="flex flex-col gap-1">
            {(["all","cat","dog","rabbit","dragon"] as PetCategory[]).map((c) => {
              const label = c === "all" ? "All Pets" : c.charAt(0).toUpperCase() + c.slice(1) + "s";
              const active = c === category;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className="font-pixel text-[0.65rem] text-left px-2 py-1.5 rounded transition-colors"
                  style={{
                    background: active ? "var(--color-primary)" : "transparent",
                    color: active ? "var(--color-primary-foreground)" : "var(--color-foreground)",
                  }}
                >
                  {label} <span className="opacity-60">({totals[c][1]})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="font-pixel text-[0.6rem] text-muted-foreground mb-2">Filters</div>
          <label className="flex items-center gap-2 font-pixel text-[0.65rem] py-1 cursor-pointer">
            <input type="checkbox" checked={owned} onChange={(e) => setOwned(e.target.checked)} /> Owned
          </label>
          <label className="flex items-center gap-2 font-pixel text-[0.65rem] py-1 cursor-pointer">
            <input type="checkbox" checked={notOwned} onChange={(e) => setNotOwned(e.target.checked)} /> Not Owned
          </label>
          <label className="flex items-center gap-2 font-pixel text-[0.65rem] py-1 cursor-pointer">
            <input type="checkbox" checked={favOnly} onChange={(e) => setFavOnly(e.target.checked)} /> Favorites
          </label>
        </div>

        <div>
          <div className="font-pixel text-[0.6rem] text-muted-foreground mb-2">Sort</div>
          <select
            className="w-full font-pixel text-[0.65rem] px-2 py-1.5 rounded"
            style={{ background: "var(--color-muted)", border: "2px solid var(--color-border)" }}
            value={sort}
            onChange={(e) => setSort(e.target.value as PetSort)}
          >
            <option value="newest">Newest</option>
            <option value="price">Price</option>
            <option value="rarity">Rarity</option>
            <option value="alpha">Alphabetical</option>
          </select>
        </div>
      </aside>

      {/* Main grid */}
      <div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((p) => {
            const ownedP = isOwned(p);
            const equipped = isEquipped(p);
            const locked = isLocked(p);
            const fav = isFav(p.id);
            const selectedCard = selected.id === p.id;
            const canAfford = player.coins >= p.price;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className="pixel-card-sm p-4 flex flex-col gap-2 cursor-pointer transition-transform hover:-translate-y-0.5"
                style={{
                  outline: selectedCard ? "3px solid var(--color-primary)" : "none",
                  outlineOffset: 2,
                  opacity: locked ? 0.85 : 1,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <RarityBadge rarity={p.rarity} />
                  <div className="flex items-center gap-1">
                    {equipped && <OwnedBadge label="Equipped" color="var(--sky)" />}
                    {!equipped && ownedP && <OwnedBadge />}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }}
                      className="text-sm leading-none"
                      title="Favorite"
                    >
                      {fav ? "❤️" : "🤍"}
                    </button>
                  </div>
                </div>

                <div
                  className="grid place-items-center rounded my-1"
                  style={{
                    height: 110,
                    background: locked ? "var(--color-foreground)" : "var(--color-muted)",
                    border: "2px solid var(--color-border)",
                    fontSize: 56,
                    filter: locked ? "brightness(0) opacity(0.35)" : "none",
                  }}
                >
                  {locked ? "???" : p.emoji}
                </div>

                <div className="font-pixel text-[0.7rem] leading-tight truncate">
                  {locked ? "???" : p.name}
                </div>
                <div className="font-pixel text-[0.55rem] text-muted-foreground leading-tight line-clamp-2 min-h-[1.6em]">
                  {locked ? `Unlock at Level ${p.unlockLevel}` : p.description}
                </div>

                <div className="flex items-center justify-between mt-1">
                  <PriceBadge price={p.price} />
                  <button
                    className={`pixel-btn ${ownedP ? "pixel-btn-secondary" : ""}`}
                    style={{ padding: "6px 10px", fontSize: "0.6rem" }}
                    disabled={ownedP || locked || !canAfford}
                    onClick={(e) => { e.stopPropagation(); buy(p); }}
                  >
                    {ownedP ? "Owned" : locked ? "Locked" : !canAfford ? "Need 🪙" : "Buy"}
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full text-center font-pixel text-[0.7rem] text-muted-foreground py-12">
              No pets match your filters.
            </div>
          )}
        </div>

        {/* Bottom section: Eggs + progress */}
        <div className="grid gap-4 md:grid-cols-2 mt-8">
          <div className="pixel-card-sm p-4">
            <SectionHeader title="Mystery Eggs" subtitle="Random pet — coming soon" />
            <div className="grid grid-cols-5 gap-2">
              {[
                { r: "common",    emoji: "🥚", color: RARITY_COLOR.common },
                { r: "rare",      emoji: "🥚", color: RARITY_COLOR.rare },
                { r: "epic",      emoji: "🥚", color: RARITY_COLOR.epic },
                { r: "legendary", emoji: "🥚", color: RARITY_COLOR.legendary },
                { r: "mythic",    emoji: "🥚", color: RARITY_COLOR.mythic },
              ].map((e) => (
                <div key={e.r} className="pixel-card-sm p-2 grid place-items-center text-center gap-1">
                  <div style={{ fontSize: 32, filter: `drop-shadow(0 0 6px ${e.color})` }}>{e.emoji}</div>
                  <div className="font-pixel text-[0.5rem]" style={{ color: e.color }}>{e.r.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pixel-card-sm p-4">
            <SectionHeader title="Collection Progress" />
            <div className="space-y-2">
              {(["cat","dog","rabbit","dragon"] as PetCategory[]).map((c) => {
                const [have, total] = totals[c];
                const pct = total > 0 ? Math.round((have / total) * 100) : 0;
                return (
                  <div key={c}>
                    <div className="flex justify-between font-pixel text-[0.6rem] mb-1">
                      <span>{c.charAt(0).toUpperCase() + c.slice(1)}s</span>
                      <span>{have} / {total}</span>
                    </div>
                    <div style={{ height: 8, background: "var(--color-muted)", border: "2px solid var(--color-border)", borderRadius: 4 }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "var(--color-primary)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Preview panel */}
      <aside className="lg:sticky lg:top-4 self-start pixel-card p-5 space-y-3">
        {(() => {
          const p = selected;
          const ownedP = isOwned(p);
          const equipped = isEquipped(p);
          const locked = isLocked(p);
          return (
            <>
              <div className="flex items-center justify-between">
                <RarityBadge rarity={p.rarity} />
                {equipped ? <OwnedBadge label="✓ Equipped" color="var(--sky)" /> :
                 ownedP ? <OwnedBadge /> : locked ? <OwnedBadge label={`Lv ${p.unlockLevel}`} color="var(--muted-foreground)" /> : null}
              </div>
              <div
                className="grid place-items-center rounded"
                style={{
                  height: 180,
                  background: locked ? "var(--color-foreground)" : "var(--color-muted)",
                  border: "2px solid var(--color-border)",
                  fontSize: 96,
                  filter: locked ? "brightness(0) opacity(0.35)" : "none",
                }}
              >
                {locked ? "?" : p.emoji}
              </div>
              <div>
                <h3 className="font-display text-2xl leading-none">{locked ? "???" : p.name}</h3>
                <div className="font-pixel text-[0.55rem] text-muted-foreground mt-1 capitalize">
                  Species: {p.species}
                </div>
              </div>
              <p className="font-pixel text-[0.6rem] leading-relaxed">
                {locked ? `Reach player level ${p.unlockLevel} to reveal this companion.` : p.description}
              </p>
              <div className="flex items-center justify-between">
                <PriceBadge price={p.price} />
                <button
                  onClick={() => toggleFav(p.id)}
                  className="font-pixel text-[0.6rem] px-2 py-1 rounded"
                  style={{ background: "var(--color-muted)", border: "2px solid var(--color-border)" }}
                >
                  {isFav(p.id) ? "❤️ Favorited" : "🤍 Favorite"}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  className="pixel-btn flex-1"
                  disabled={ownedP || locked || player.coins < p.price}
                  onClick={() => buy(p)}
                >
                  {ownedP ? "Owned" : locked ? "Locked" : "Buy"}
                </button>
                <button
                  className="pixel-btn pixel-btn-secondary flex-1"
                  disabled={!ownedP || equipped}
                  onClick={() => equip(p)}
                >
                  {equipped ? "Equipped" : "Equip"}
                </button>
              </div>
            </>
          );
        })()}
      </aside>
    </div>
  );
}

/* =========================================================================
 * Themes & Doodads Page
 * ========================================================================= */

const THEME_CATEGORIES: { id: ThemeCategory | "all"; label: string }[] = [
  { id: "all",     label: "All" },
  { id: "forest",  label: "Forest" },
  { id: "beach",   label: "Beach" },
  { id: "snow",    label: "Snow" },
  { id: "castle",  label: "Castle" },
  { id: "space",   label: "Space" },
  { id: "cafe",    label: "Cafe" },
  { id: "garden",  label: "Garden" },
  { id: "special", label: "Special" },
];

const DOODAD_CATEGORIES: { id: DoodadCategory | "all"; label: string }[] = [
  { id: "all",       label: "All" },
  { id: "furniture", label: "Furniture" },
  { id: "plants",    label: "Plants" },
  { id: "lights",    label: "Lights" },
  { id: "outdoor",   label: "Outdoor" },
  { id: "decor",     label: "Decor" },
  { id: "special",   label: "Special" },
];

function CategoryTabs<T extends string>({
  items, value, onChange,
}: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((c) => {
        const active = c.id === value;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className="font-pixel text-[0.6rem] px-3 py-1.5 rounded"
            style={{
              background: active ? "var(--color-primary)" : "var(--color-muted)",
              color: active ? "var(--color-primary-foreground)" : "var(--color-foreground)",
              border: "2px solid var(--color-border)",
            }}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

function ThemesPage() {
  const { state, dispatch } = useGame();
  const { world, setWorld } = useWorld();
  const { player, inventory } = state;

  const [themeCat, setThemeCat] = useLocal<ThemeCategory | "all">("shop.theme.cat", "all");
  const [doodadCat, setDoodadCat] = useLocal<DoodadCategory | "all">("shop.doodad.cat", "all");

  // Auto-unlock built-in worlds & starter theme items for existing saves
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

/* =========================================================================
 * Root Shop
 * ========================================================================= */

export function Shop() {
  const { state } = useGame();
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
        <div className="flex items-center gap-3">
          <SegmentedSwitcher value={tab} onChange={setTab} />
          <div className="pixel-chip">🪙 <span suppressHydrationWarning>{state.player.coins.toLocaleString()}</span></div>
        </div>
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
