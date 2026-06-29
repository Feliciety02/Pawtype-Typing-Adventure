import { useGame } from "../lib/game/store";
import type { PetType } from "../lib/game/types";

type ShopItem = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  description: string;
  action: "pet" | "item";
  petType?: PetType;
};

const SHOP_ITEMS: ShopItem[] = [
  { id: "pet-cat", name: "Cat", emoji: "🐱", price: 300, description: "A sleepy pixel companion", action: "pet", petType: "cat" },
  { id: "pet-dog", name: "Dog", emoji: "🐶", price: 400, description: "A wagging pixel pup", action: "pet", petType: "dog" },
  { id: "pet-fox", name: "Fox", emoji: "🦊", price: 500, description: "A clever pixel fox", action: "pet", petType: "fox" },
  { id: "pet-rabbit", name: "Rabbit", emoji: "🐰", price: 350, description: "A fluffy pixel bunny", action: "pet", petType: "rabbit" },
  { id: "pet-panda", name: "Panda", emoji: "🐼", price: 600, description: "A roly-poly pixel panda", action: "pet", petType: "panda" },
  { id: "pet-penguin", name: "Penguin", emoji: "🐧", price: 450, description: "A waddling pixel penguin", action: "pet", petType: "penguin" },
  { id: "pet-dragon", name: "Baby Dragon", emoji: "🐉", price: 800, description: "A tiny pixel dragon", action: "pet", petType: "dragon" },
  { id: "crt-shader", name: "CRT Filter", emoji: "📺", price: 150, description: "Retro scanline effect", action: "item" },
  { id: "sparkle-trail", name: "Sparkle Trail", emoji: "✨", price: 200, description: "Particles follow your typing", action: "item" },
];

export function Shop() {
  const { state, dispatch } = useGame();
  const { player, inventory } = state;

  const owned = (id: string) => inventory.items.includes(id);
  const ownedPet = (type: PetType) => inventory.pets.some((p) => p.type === type);

  return (
    <div className="pixel-card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-3xl leading-none">Pixel Shop</h2>
          <p className="font-pixel text-[0.65rem] text-muted-foreground mt-1">
            Spend your hard-earned coins.
          </p>
        </div>
        <div className="pixel-chip" title="Your coins">
          🪙 {player.coins.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {SHOP_ITEMS.map((item) => {
          const alreadyOwned = item.action === "pet"
            ? ownedPet(item.petType!)
            : owned(item.id);
          const canAfford = player.coins >= item.price;
          const isUnavailable = item.action === "item";

          return (
            <div
              key={item.id}
              className="pixel-card-sm p-3 flex flex-col items-center text-center gap-2"
              style={{ opacity: alreadyOwned || isUnavailable ? 0.65 : 1 }}
            >
              {isUnavailable && <span className="coming-soon-badge">Coming soon</span>}
              <div
                className="grid place-items-center text-3xl"
                style={{
                  width: 60, height: 60,
                  background: "var(--color-muted)",
                  border: "2px solid var(--color-border)",
                  borderRadius: 6,
                }}
              >
                {item.emoji}
              </div>
              <div className="font-pixel text-[0.7rem] leading-tight">{item.name}</div>
              <div className="font-pixel text-[0.55rem] text-muted-foreground leading-tight">
                {item.description}
              </div>
              <div className="font-pixel text-[0.65rem]" style={{ color: "var(--coin)" }}>
                🪙 {item.price}
              </div>
              <button
                className={`pixel-btn w-full ${alreadyOwned ? "pixel-btn-secondary" : ""}`}
                disabled={alreadyOwned || !canAfford || isUnavailable}
                onClick={() => {
                  if (alreadyOwned || isUnavailable) return;
                  dispatch({ type: "SPEND_COINS", amount: item.price });
                  if (item.action === "pet" && item.petType) {
                    dispatch({
                      type: "ADOPT_PET",
                      pet: {
                        type: item.petType,
                        name: item.name,
                        xp: 0,
                        level: 1,
                        adoptedAt: Date.now(),
                      },
                    });
                  } else {
                    dispatch({ type: "ADD_ITEM", itemId: item.id });
                  }
                }}
              >
                {isUnavailable ? "Soon" : alreadyOwned ? "Owned" : !canAfford ? "Can't afford" : "Buy"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
