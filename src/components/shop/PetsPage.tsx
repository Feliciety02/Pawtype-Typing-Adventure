import { useMemo } from "react";
import { useGame } from "../../lib/game/store";
import { useLocal } from "../../lib/hooks/useLocal";
import { PETS, RARITY_COLOR, RARITY_ORDER, type PetItem, type PetCategory, type PetSort } from "./shopData";
import { RarityBadge, OwnedBadge, PriceBadge, SectionHeader } from "./shopHelpers";

export function PetsPage() {
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
