import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type WorldId = "cafe" | "forest" | "ocean" | "sakura" | "castle" | "space" | "autumn" | "mushroom" | "moonlit" | "rainy" | "snowy" | "sunflower" | "volcanic-forge" | "desert-oasis" | "steam-punk-workshop" | "frostveil-kingdom";

export type World = {
  id: WorldId;
  name: string;
  emoji: string;
  blurb: string;
  swatches: [string, string, string, string];
};

export const WORLDS: World[] = [
  { id: "cafe",   name: "Cozy Café",   emoji: "☕", blurb: "Warm terracotta & cream.",          swatches: ["#e8b48a","#c25a3a","#f5ead6","#3a2a22"] },
  { id: "forest", name: "Mossy Forest", emoji: "🌲", blurb: "Ferns, dew, and dappled light.",     swatches: ["#a8d8a0","#3f7d4a","#eef6e4","#1f2e1f"] },
  { id: "ocean",  name: "Tide Pool",    emoji: "🌊", blurb: "Salt breeze and seafoam.",           swatches: ["#9bd5e8","#2f6f9c","#e6f3f8","#142838"] },
  { id: "sakura", name: "Sakura Park",  emoji: "🌸", blurb: "Petals drift in the wind.",          swatches: ["#f5b6c8","#c75f86","#fbeaf0","#3a1f2a"] },
  { id: "castle", name: "Royal Castle", emoji: "🏰", blurb: "Velvet drapes & gold trim.",         swatches: ["#c8a8e8","#6e4caa","#f1eafa","#241638"] },
  { id: "space",    name: "Stardust",              emoji: "🌌", blurb: "Neon comets in deep night.",               swatches: ["#7ee0d6","#a06bff","#1b1538","#0a0820"] },
  { id: "autumn",   name: "Autumn Cottage",        emoji: "🍂", blurb: "Crisp air & golden leaves.",                swatches: ["#e8b060","#c25a2a","#fbe8c8","#3a2218"] },
  { id: "mushroom", name: "Fairy Mushroom Village", emoji: "🍄", blurb: "Glowing spores & twisted roots.",          swatches: ["#d4a0e8","#7a3a9a","#f2e0f8","#2a1838"] },
  { id: "moonlit",  name: "Moonlit Garden",         emoji: "🌙", blurb: "Silver beams & jasmine scent.",             swatches: ["#a0b8e8","#3a5a8a","#e0eaf8","#182038"] },
  { id: "rainy",    name: "Rainy Library",          emoji: "🌧️", blurb: "Steamy windows & old paper.",               swatches: ["#b0a8a0","#5a524a","#e8e4e0","#2a2622"] },
  { id: "snowy",    name: "Snowy Cabin",            emoji: "❄️", blurb: "Frosted glass & crackling fire.",           swatches: ["#c8dce8","#6090a8","#e8f0f4","#1a2830"] },
  { id: "sunflower",name: "Sunflower Meadow",       emoji: "🌻", blurb: "Golden fields & buzzing bees.",             swatches: ["#f0d060","#c08a20","#fcf0c0","#382818"] },
];

type Ctx = { world: WorldId; setWorld: (w: WorldId) => void };
const WorldCtx = createContext<Ctx>({ world: "cafe", setWorld: () => {} });

export function WorldProvider({ children }: { children: ReactNode }) {
  const [world, setWorldState] = useState<WorldId>("cafe");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("world")) as WorldId | null;
    if (stored && WORLDS.some((w) => w.id === stored)) {
      setWorldState(stored);
      applyWorld(stored);
    } else {
      applyWorld("cafe");
    }
  }, []);

  const setWorld = (w: WorldId) => {
    setWorldState(w);
    applyWorld(w);
    try { localStorage.setItem("world", w); } catch {}
  };

  return <WorldCtx.Provider value={{ world, setWorld }}>{children}</WorldCtx.Provider>;
}

export function useWorld() {
  return useContext(WorldCtx);
}

function applyWorld(w: WorldId) {
  const root = document.documentElement;
  WORLDS.forEach((x) => root.classList.remove(`world-${x.id}`));
  root.classList.add(`world-${w}`);
}
