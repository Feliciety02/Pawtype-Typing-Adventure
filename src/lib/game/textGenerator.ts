import type { WorldId } from "../../components/WorldTheme";
import {
  generateAdventureWords as aiAdventureWords,
  generateWorldText as aiWorldText,
  generateQuestText as aiQuestText,
} from "./ai/generator";

const WORLD_THEMES: Record<WorldId, string> = {
  cafe: "a cozy cafe with warm coffee, rain tapping windows, and soft jazz",
  forest: "a mossy forest with ferns, dappled sunlight, and a babbling brook",
  ocean: "a tide pool with crashing waves, salty air, and hidden sea creatures",
  sakura: "a cherry blossom park with drifting petals, a koi pond, and paper lanterns",
  castle: "a royal castle with velvet drapes, candlelit halls, and stone archways",
  space: "a starfield with glowing nebulae, floating comets, and deep cosmic silence",
  autumn: "a cozy forest campsite with pine lanterns, campfire glow, and mountain cliffs",
  mushroom: "a fairy mushroom village with glowing spores, twisted roots, and enchanted air",
  "volcanic-forge": "a volcanic forge with lava flows, ash clouds, molten rock, and glowing embers",
  sunflower: "a sunflower meadow with golden fields, buzzing bees, and endless blue sky",
  "desert-oasis": "an ancient desert oasis with golden sand dunes, palm trees, stone ruins, and a hidden blue spring",
  "steam-punk-workshop": "a steampunk workshop with copper gears, steam engines, brass pipes, and clockwork machinery",
  "frostveil-kingdom": "a frozen kingdom with ice crystals, frost-covered pines, frozen waterfalls, and a shimmering ice palace",
};

const WORLD_LINES: Record<WorldId, string[]> = {
  cafe: ["Steam curls past the window", "soft jazz drifts near the counter", "warm mugs wait beside quiet booths"],
  forest: ["Fern shadows sway in the light", "a brook chatters over smooth stone", "foxglow flickers beneath old trees"],
  ocean: ["Cool spray hangs over the rocks", "small shells gleam beside the tide", "seafoam slips through the pools"],
  sakura: ["Pink petals spiral over the pond", "paper lanterns glow at dusk", "koi ripple the quiet water"],
  castle: ["Candlelight runs along the hall", "velvet banners rest above stone arches", "soft steps echo through the keep"],
  space: ["Distant stars shimmer past the glass", "comets leave pale silver trails", "nebula light hums through the dark"],
  autumn: ["Campfire smoke drifts through the pines", "lanterns sway beside the trail", "the lookout glows above the ridge"],
  mushroom: ["Glowing spores float between the roots", "tiny lantern caps shine in the mist", "crystal dew gathers on curled leaves"],
  "volcanic-forge": ["Embers glow along black stone", "ash drifts over the molten path", "iron heat rises from the forge"],
  sunflower: ["Tall blooms lean with the breeze", "bees weave over golden rows", "warm light settles on the meadow"],
  "desert-oasis": ["Sunlight shivers over the dunes", "palm shade cools the spring", "old ruins rest beyond the sand"],
  "steam-punk-workshop": ["Copper gears click in steady rhythm", "steam hisses from brass pipes", "clockwork sparks dance above the bench"],
  "frostveil-kingdom": ["Ice light glitters across the path", "snow gathers under crystal pines", "the palace shines beyond frozen falls"],
};

const MASCOT_LINES: Record<string, string[]> = {
  idle: ["Ready when your paws are.", "Tap in and wake the room.", "A cozy run is waiting."],
  happy: ["Nice rhythm, keep gliding.", "Clean strokes, steady paws.", "That flow looks sharp."],
  oops: ["Slow it down, stay smooth.", "Breathe, then land each key.", "Reset the rhythm, not the run."],
  sleep: ["The room is sleepy. Type.", "Wake the keys with one word.", "Your keyboard is waiting."],
};

const WORD_POOL = [
  "amber", "anchor", "apple", "ash", "bamboo", "basil", "beam", "berry", "blossom", "breeze",
  "brook", "cabin", "candle", "caper", "cedar", "chime", "clover", "cocoa", "comet", "coral",
  "crystal", "daisy", "dawn", "drift", "ember", "feather", "fern", "glimmer", "glow", "golden",
  "harbor", "honey", "ivory", "jasmine", "juniper", "lagoon", "lantern", "leaf", "linen", "lunar",
  "maple", "marble", "meadow", "meteor", "mint", "mist", "mocha", "moss", "nectar", "oasis",
  "opal", "orbit", "pearl", "petal", "pine", "prairie", "quartz", "quiet", "ripple", "river",
  "sable", "sakura", "sand", "shell", "silver", "snow", "solace", "spark", "sprout", "star",
  "stone", "sugar", "sunbeam", "thistle", "timber", "trail", "velvet", "violet", "water", "willow",
];

function rotatePick<T>(items: T[], count: number, seed: string): T[] {
  if (items.length === 0 || count <= 0) return [];
  const offset = seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % items.length;
  return Array.from({ length: count }, (_, index) => items[(offset + index) % items.length]);
}

function normalizeWords(words: string[]) {
  return words
    .map((word) => word.toLowerCase())
    .map((word) => word.replace(/[^a-z'-]/g, ""))
    .filter((word) => word.length >= 2 && word.length <= 14);
}

export async function generateWorldText(worldId: WorldId): Promise<string | null> {
  const ai = await aiWorldText(worldId).catch(() => null);
  if (ai) return ai;

  const lines = WORLD_LINES[worldId];
  return lines ? `${lines[0]}. ${lines[1]}. ${lines[2]}.` : null;
}

export async function generateWeakSpotWords(mistakeChars: string[]): Promise<string[] | null> {
  if (mistakeChars.length === 0) return null;

  const charSet = new Set(mistakeChars.map((char) => char.toLowerCase()));
  const pool = WORD_POOL.filter((word) => [...word].some((char) => charSet.has(char)));
  if (pool.length === 0) return null;

  const rotated = rotatePick(pool, 24, [...charSet].join(""));
  const phrases = Array.from(
    { length: 8 },
    (_, index) => rotated.slice(index * 3, index * 3 + 3).join(" "),
  ).filter(Boolean);

  return phrases.length > 0 ? phrases : null;
}

export async function generateMascotLine(mood: string): Promise<string | null> {
  const lines = MASCOT_LINES[mood];
  return lines ? rotatePick(lines, 1, mood)[0] ?? null : null;
}

export async function generateQuestText(stageName: string, worldId: WorldId): Promise<string | null> {
  const ai = await aiQuestText(stageName, worldId).catch(() => null);
  if (ai) return ai;

  const lines = WORLD_LINES[worldId];
  if (!lines) return null;
  return `${stageName} opens as ${lines[stageName.length % lines.length].toLowerCase()}.`;
}

export async function generateAdventureWords(
  stageName: string,
  worldId: WorldId,
  seedWords: string[],
  count = 36,
): Promise<string[] | null> {
  const ai = await aiAdventureWords(stageName, worldId, seedWords, count).catch(() => null);
  if (ai) return ai;

  const tokens = normalizeWords([
    ...seedWords,
    ...stageName.split(/[^a-zA-Z]+/),
    ...WORLD_THEMES[worldId].split(/[^a-zA-Z]+/),
  ]);
  if (tokens.length === 0) return null;
  return rotatePick(tokens, count, `${worldId}:${stageName}:${count}`);
}
