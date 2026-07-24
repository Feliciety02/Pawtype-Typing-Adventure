import { useMemo } from "react";
import { useGame } from "../../lib/game/store";
import { useLocal } from "../../hooks/useLocal";
import {
  PETS,
  RARITY_COLOR,
  RARITY_ORDER,
  type PetItem,
  type PetCategory,
  type PetSort,
} from "@/lib/shop/shopData";
import { RarityBadge, OwnedBadge, PriceBadge, SectionHeader } from "@/lib/shop/shopHelpers";
import { Button } from "@/components/ui/button";
import { CheckboxField, NativeSelect } from "@/components/ui/form-controls";
import { PixelChoiceBar } from "@/components/ui/shared/PixelChoiceBar";
import { Progress } from "@/components/ui/progress";

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
  const mysteryEggCost = 350;
  const hatchMysteryEgg = () => {
    const candidates = PETS.filter((pet) => !isOwned(pet) && !isLocked(pet));
    if (player.coins < mysteryEggCost || candidates.length === 0) return;
    const pet = candidates[Math.floor(Math.random() * candidates.length)];
    dispatch({ type: "SPEND_COINS", amount: mysteryEggCost });
    dispatch({
      type: "ADOPT_PET",
      pet: { type: pet.petType, name: pet.name, xp: 0, level: 1, adoptedAt: Date.now() },
    });
  };

  const toggleFav = (id: string) => {
    setFavorites(isFav(id) ? favorites.filter((x) => x !== id) : [...favorites, id]);
  };

  const filtered = useMemo(() => {
    let list = [...PETS];
    if (category !== "all") {
      list = list.filter(
        (p) => p.species === category || (category === "dragon" && p.species === "dragon"),
      );
    }
    if (owned && !notOwned) list = list.filter(isOwned);
    if (notOwned && !owned) list = list.filter((p) => !isOwned(p));
    if (favOnly) list = list.filter((p) => isFav(p.id));

    switch (sort) {
      case "newest":
        list.sort((a, b) => b.addedAt - a.addedAt);
        break;
      case "price":
        list.sort((a, b) => a.price - b.price);
        break;
      case "rarity":
        list.sort((a, b) => RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity]);
        break;
      case "alpha":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
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
    all: [PETS.filter(isOwned).length, PETS.length],
    cat: [
      PETS.filter((p) => p.species === "cat" && isOwned(p)).length,
      PETS.filter((p) => p.species === "cat").length,
    ],
    dog: [
      PETS.filter((p) => p.species === "dog" && isOwned(p)).length,
      PETS.filter((p) => p.species === "dog").length,
    ],
    rabbit: [
      PETS.filter((p) => p.species === "rabbit" && isOwned(p)).length,
      PETS.filter((p) => p.species === "rabbit").length,
    ],
    dragon: [
      PETS.filter((p) => p.species === "dragon" && isOwned(p)).length,
      PETS.filter((p) => p.species === "dragon").length,
    ],
  };

  return (
    <div className="shop-pets-layout grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_300px]">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-4 self-start pixel-card-sm p-4 space-y-5">
        <div>
          <div className="font-pixel text-[0.6rem] text-muted-foreground mb-2">Categories</div>
          <PixelChoiceBar
            items={(["all", "cat", "dog", "rabbit", "dragon"] as PetCategory[]).map((id) => ({
              id,
              label: `${
                id === "all" ? "All Pets" : `${id.charAt(0).toUpperCase()}${id.slice(1)}s`
              } (${totals[id][1]})`,
            }))}
            value={category}
            onChange={setCategory}
            ariaLabel="Pet categories"
            idPrefix="pet-category"
            kind="filters"
            variant="compact"
            className="shop-pet-category-tabs"
          />
        </div>

        <div>
          <div className="font-pixel text-[0.6rem] text-muted-foreground mb-2">Filters</div>
          <div className="pixel-checkbox-list">
            <CheckboxField
              id="pet-filter-owned"
              label="Owned"
              checked={owned}
              onChange={(event) => setOwned(event.target.checked)}
            />
            <CheckboxField
              id="pet-filter-not-owned"
              label="Not Owned"
              checked={notOwned}
              onChange={(event) => setNotOwned(event.target.checked)}
            />
            <CheckboxField
              id="pet-filter-favorites"
              label="Favorites"
              checked={favOnly}
              onChange={(event) => setFavOnly(event.target.checked)}
            />
          </div>
        </div>

        <div>
          <label className="pixel-field-label" htmlFor="pet-sort">
            Sort
          </label>
          <NativeSelect
            id="pet-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as PetSort)}
          >
            <option value="newest">Newest</option>
            <option value="price">Price</option>
            <option value="rarity">Rarity</option>
            <option value="alpha">Alphabetical</option>
          </NativeSelect>
        </div>
      </aside>

      {/* Main grid */}
      <div>
        <div className="shop-pets-grid grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((p) => {
            const ownedP = isOwned(p);
            const equipped = isEquipped(p);
            const locked = isLocked(p);
            const fav = isFav(p.id);
            const selectedCard = selected.id === p.id;
            const canAfford = player.coins >= p.price;
            return (
              <article
                key={p.id}
                className="shop-pet-card pixel-selectable-card pixel-card-sm p-4 flex flex-col gap-2"
                data-selected={selectedCard}
                data-locked={locked}
              >
                <div className="flex items-start justify-between gap-2">
                  <RarityBadge rarity={p.rarity} />
                  <div className="flex items-center gap-1">
                    {equipped && <OwnedBadge label="Equipped" color="var(--sky)" />}
                    {!equipped && ownedP && <OwnedBadge />}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shop-favorite-button"
                      onClick={() => toggleFav(p.id)}
                      aria-label={
                        fav ? `Remove ${p.name} from favorites` : `Add ${p.name} to favorites`
                      }
                      aria-pressed={fav}
                      title={fav ? "Remove from favorites" : "Add to favorites"}
                    >
                      <span aria-hidden="true">{fav ? "❤️" : "🤍"}</span>
                    </Button>
                  </div>
                </div>

                <button
                  type="button"
                  className="shop-pet-select-target"
                  onClick={() => setSelectedId(p.id)}
                  aria-label={`Show details for ${locked ? `a pet unlocked at level ${p.unlockLevel}` : p.name}`}
                  aria-pressed={selectedCard}
                >
                  <span
                    className="shop-pet-card-art grid place-items-center rounded my-1"
                    style={{
                      background: locked ? "var(--color-foreground)" : "var(--color-muted)",
                      filter: locked ? "brightness(0) opacity(0.35)" : "none",
                    }}
                    aria-hidden="true"
                  >
                    {locked ? "???" : p.emoji}
                  </span>

                  <span className="font-pixel text-[0.7rem] leading-tight truncate">
                    {locked ? "???" : p.name}
                  </span>
                  <span className="font-pixel text-[0.55rem] text-muted-foreground leading-tight line-clamp-2 min-h-[1.6em]">
                    {locked ? `Unlock at Level ${p.unlockLevel}` : p.description}
                  </span>
                </button>

                <div className="flex items-center justify-between mt-1">
                  <PriceBadge price={p.price} />
                  <Button
                    variant={ownedP ? "secondary" : "default"}
                    size="sm"
                    disabled={ownedP || locked || !canAfford}
                    onClick={() => buy(p)}
                  >
                    {ownedP ? "Owned" : locked ? "Locked" : !canAfford ? "Need 🪙" : "Buy"}
                  </Button>
                </div>
              </article>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full text-center font-pixel text-[0.7rem] text-muted-foreground py-12">
              No pets match your filters.
            </div>
          )}
        </div>

        {/* Bottom section: Eggs + progress */}
        <div className="shop-progress-grid grid gap-4 md:grid-cols-2 mt-8">
          <div className="pixel-card-sm p-4">
            <SectionHeader title="Mystery Eggs" subtitle="Hatch an unlocked companion at random" />
            <div className="shop-egg-grid grid grid-cols-5 gap-2">
              {[
                { r: "common", emoji: "🥚", color: RARITY_COLOR.common },
                { r: "rare", emoji: "🥚", color: RARITY_COLOR.rare },
                { r: "epic", emoji: "🥚", color: RARITY_COLOR.epic },
                { r: "legendary", emoji: "🥚", color: RARITY_COLOR.legendary },
                { r: "mythic", emoji: "🥚", color: RARITY_COLOR.mythic },
              ].map((e) => (
                <div
                  key={e.r}
                  className="pixel-card-sm p-2 grid place-items-center text-center gap-1"
                >
                  <div style={{ fontSize: 32, filter: `drop-shadow(0 0 6px ${e.color})` }}>
                    {e.emoji}
                  </div>
                  <div className="font-pixel text-[0.5rem]" style={{ color: e.color }}>
                    {e.r.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
            <Button
              className="mt-3"
              disabled={
                player.coins < mysteryEggCost || PETS.every((pet) => isOwned(pet) || isLocked(pet))
              }
              onClick={hatchMysteryEgg}
            >
              Hatch Mystery Egg ({mysteryEggCost} coins)
            </Button>
          </div>

          <div className="pixel-card-sm p-4">
            <SectionHeader title="Collection Progress" />
            <div className="space-y-2">
              {(["cat", "dog", "rabbit", "dragon"] as PetCategory[]).map((c) => {
                const [have, total] = totals[c];
                return (
                  <div key={c}>
                    <div className="flex justify-between font-pixel text-[0.6rem] mb-1">
                      <span>{c.charAt(0).toUpperCase() + c.slice(1)}s</span>
                      <span>
                        {have} / {total}
                      </span>
                    </div>
                    <Progress
                      value={have}
                      max={total}
                      size="xs"
                      aria-label={`${c} collection: ${have} of ${total} pets`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Preview panel */}
      <aside className="shop-preview lg:sticky lg:top-4 self-start pixel-card p-5 space-y-3">
        {(() => {
          const p = selected;
          const ownedP = isOwned(p);
          const equipped = isEquipped(p);
          const locked = isLocked(p);
          return (
            <>
              <div className="flex items-center justify-between">
                <RarityBadge rarity={p.rarity} />
                {equipped ? (
                  <OwnedBadge label="✓ Equipped" color="var(--sky)" />
                ) : ownedP ? (
                  <OwnedBadge />
                ) : locked ? (
                  <OwnedBadge label={`Lv ${p.unlockLevel}`} color="var(--muted-foreground)" />
                ) : null}
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
                {locked
                  ? `Reach player level ${p.unlockLevel} to reveal this companion.`
                  : p.description}
              </p>
              <div className="flex items-center justify-between">
                <PriceBadge price={p.price} />
                <Button
                  onClick={() => toggleFav(p.id)}
                  variant="secondary"
                  size="sm"
                  aria-label={
                    isFav(p.id) ? `Remove ${p.name} from favorites` : `Add ${p.name} to favorites`
                  }
                  aria-pressed={isFav(p.id)}
                >
                  {isFav(p.id) ? "❤️ Favorited" : "🤍 Favorite"}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  disabled={ownedP || locked || player.coins < p.price}
                  onClick={() => buy(p)}
                >
                  {ownedP ? "Owned" : locked ? "Locked" : "Buy"}
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  disabled={!ownedP || equipped}
                  onClick={() => equip(p)}
                  aria-pressed={ownedP ? equipped : undefined}
                >
                  {equipped ? "Equipped" : "Equip"}
                </Button>
              </div>
            </>
          );
        })()}
      </aside>
    </div>
  );
}
