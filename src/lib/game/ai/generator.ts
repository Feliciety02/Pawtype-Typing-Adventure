import type { WorldId } from "../../../components/WorldTheme";
import { analyzePatterns } from "./patterns";

type WordGraph = Map<string, Map<string, number>>;

const WORLD_POOLS: Record<string, string[]> = {
  cafe: ["steam", "warm", "coffee", "rain", "jazz", "counter", "mug", "window", "cream", "sugar", "tapping", "soft", "drift", "barista", "foam", "aroma", "brewed", "cup", "sip", "cinnamon", "booth", "lamp", "shade", "quiet", "honey"],
  forest: ["fern", "moss", "brook", "light", "shadow", "fern", "trail", "root", "branch", "leaf", "dapple", "glade", "thicket", "canopy", "trunk", "bird", "dew", "stone", "creek", "bloom", "pollen", "bark", "vine", "soil"],
  ocean: ["wave", "tide", "salt", "shell", "coral", "spray", "deep", "tidepool", "foam", "shore", "curl", "surge", "drift", "kelp", "fin", "scale", "brine", "shimmer", "current", "sand", "rock", "pool", "glimmer"],
  sakura: ["petal", "bloom", "lantern", "pond", "koi", "drift", "branch", "paper", "glow", "pink", "breeze", "fold", "silk", "blossom", "garden", "path", "gate", "bridge", "stone", "moss", "temple", "bamboo"],
  castle: ["candle", "hall", "stone", "velvet", "banner", "arch", "keep", "torch", "throne", "tapestry", "courtyard", "turret", "chamber", "iron", "oak", "tile", "glass", "silk", "crown", "lantern"],
  space: ["star", "comet", "nebula", "drift", "cosmos", "orbit", "lunar", "solar", "void", "light", "dust", "glow", "asteroid", "crater", "ring", "flare", "eclipse", "satellite", "horizon", "silence"],
  autumn: ["campfire", "pine", "ember", "lantern", "ridge", "trail", "smoke", "crisp", "needle", "campsite", "glow", "wood", "flame", "spark", "log", "tent", "maple", "acorn", "frost", "copper"],
  mushroom: ["spore", "root", "glow", "cap", "mist", "dew", "spore", "veil", "stalk", "grotto", "crystal", "moss", "shade", "damp", "tendril", "fairy", "dust", "glimmer", "curl", "web"],
  "volcanic-forge": ["forge", "lava", "ash", "ember", "molten", "iron", "anvil", "spark", "ore", "coal", "hammer", "tongs", "bellows", "furnace", "slag", "cinder", "flame", "smoke", "glow", "steel"],
  sunflower: ["sunflower", "meadow", "gold", "pollen", "field", "bloom", "stem", "petal", "buzz", "warm", "row", "seed", "stalk", "sky", "breeze", "sweep", "summer", "dew", "honey", "light"],
  "desert-oasis": ["dune", "oasis", "sand", "palm", "spring", "ruin", "stone", "shade", "heat", "sun", "sweep", "arch", "pillar", "well", "wind", "horizon", "camel", "tent", "market", "silk"],
  "steam-punk-workshop": ["gear", "steam", "brass", "copper", "clock", "spring", "piston", "valve", "cog", "pipe", "lever", "dial", "wheel", "wire", "spark", "oil", "metal", "plate", "screw", "bevel"],
  "frostveil-kingdom": ["ice", "frost", "snow", "crystal", "pine", "palace", "glacier", "flake", "wind", "chill", "shard", "peak", "frozen", "aurora", "tundra", "sledge", "sleigh", "north", "winter", "lantern"],
};

function buildGraph(pool: string[]): WordGraph {
  const graph: WordGraph = new Map();
  for (let i = 0; i < pool.length - 1; i++) {
    const word = pool[i];
    const next = pool[i + 1];
    let edges = graph.get(word);
    if (!edges) {
      edges = new Map();
      graph.set(word, edges);
    }
    edges.set(next, (edges.get(next) ?? 0) + 1);
  }
  for (const [, edges] of graph) {
    const total = [...edges.values()].reduce((s, c) => s + c, 0);
    for (const [word, count] of edges) {
      edges.set(word, count / total);
    }
  }
  return graph;
}

function pickStart(graph: WordGraph): string {
  const words = [...graph.keys()];
  return words[Math.floor(Math.random() * words.length)] ?? "";
}

function pickNext(graph: WordGraph, word: string): string | null {
  const edges = graph.get(word);
  if (!edges || edges.size === 0) return null;
  const rand = Math.random();
  let cumulative = 0;
  for (const [next, prob] of edges) {
    cumulative += prob;
    if (rand <= cumulative) return next;
  }
  return [...edges.keys()][edges.size - 1] ?? null;
}

function generatePassage(pool: string[], wordCount: number): string[] {
  const graph = buildGraph(pool);
  if (graph.size === 0) return pool.slice(0, wordCount);

  const result: string[] = [];
  let word = pickStart(graph);
  result.push(word);

  for (let i = 1; i < wordCount; i++) {
    const next = pickNext(graph, word);
    if (!next) break;
    result.push(next);
    word = next;
  }

  if (result.length < wordCount) {
    const extra = pool.filter((w) => !result.includes(w));
    for (const w of extra) {
      if (result.length >= wordCount) break;
      result.push(w);
    }
  }

  return result.slice(0, wordCount);
}

function boostWeakChars(words: string[], weakChars: string[]): string[] {
  if (weakChars.length === 0) return words;
  const charSet = new Set(weakChars);
  const boosted = [...words];
  for (let i = 0; i < 5; i++) {
    const match = words.find((w) => [...w].some((c) => charSet.has(c)));
    if (match) boosted.push(match);
  }
  return boosted;
}

export async function generateAdventureWords(
  stageName: string,
  worldId: WorldId,
  seedWords: string[],
  count = 36,
): Promise<string[] | null> {
  const worldPool = WORLD_POOLS[worldId] ?? [];
  const combined = [
    ...seedWords,
    ...stageName.split(/[^a-zA-Z]+/).filter(Boolean),
    ...worldPool,
  ];

  if (combined.length < 5) return null;

  const report = await analyzePatterns(10).catch(() => null);
  const weakChars = report?.topWeakChars.map((c) => c.char) ?? [];

  const weighted = boostWeakChars(combined, weakChars);
  const passage = generatePassage(weighted, count);

  return passage
    .map((w) => w.toLowerCase().replace(/[^a-z'-]/g, ""))
    .filter((w) => w.length >= 2 && w.length <= 14)
    .slice(0, count);
}

export async function generateWorldText(worldId: WorldId): Promise<string | null> {
  const pool = WORLD_POOLS[worldId];
  if (!pool || pool.length < 10) return null;

  const passage = generatePassage(pool, 15);
  const sentenceBreaks = [5, 10, 15];
  const s1 = passage.slice(0, sentenceBreaks[0]).join(" ");
  const s2 = passage.slice(sentenceBreaks[0], sentenceBreaks[1]).join(" ");
  const s3 = passage.slice(sentenceBreaks[1], sentenceBreaks[2]).join(" ");

  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return `${cap(s1)}. ${cap(s2)}. ${cap(s3)}.`;
}

export async function generateQuestText(stageName: string, worldId: WorldId): Promise<string | null> {
  const pool = WORLD_POOLS[worldId];
  if (!pool || pool.length < 5) return null;

  const passage = generatePassage(pool, 8);
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const text = passage.join(" ");
  return `${stageName}: ${cap(text)}.`;
}
