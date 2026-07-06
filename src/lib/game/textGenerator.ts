import type { WorldId } from "../../components/shared/WorldTheme";
import {
  generateAdventureWords as aiAdventureWords,
  generateWorldText as aiWorldText,
  generateLessonText as aiLessonText,
  generateWeakSpotSentences as aiWeakSpotSentences,
} from "./engine/generator";
import { generateMascotLine as aiMascotLine, type MascotContext } from "./engine/mascot";
import type { Difficulty, Zone } from "./engine/generator";

const WORLD_THEMES: Partial<Record<WorldId, string>> = {
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
  "desert-oasis":
    "an ancient desert oasis with golden sand dunes, palm trees, stone ruins, and a hidden blue spring",
  "steam-punk-workshop":
    "a steampunk workshop with copper gears, steam engines, brass pipes, and clockwork machinery",
  "frostveil-kingdom":
    "a frozen kingdom with ice crystals, frost-covered pines, frozen waterfalls, and a shimmering ice palace",
};

const WORLD_LINES: Partial<Record<WorldId, string[]>> = {
  cafe: [
    "Steam curls past the window",
    "soft jazz drifts near the counter",
    "warm mugs wait beside quiet booths",
  ],
  forest: [
    "Fern shadows sway in the light",
    "a brook chatters over smooth stone",
    "foxglow flickers beneath old trees",
  ],
  ocean: [
    "Cool spray hangs over the rocks",
    "small shells gleam beside the tide",
    "seafoam slips through the pools",
  ],
  sakura: [
    "Pink petals spiral over the pond",
    "paper lanterns glow at dusk",
    "koi ripple the quiet water",
  ],
  castle: [
    "Candlelight runs along the hall",
    "velvet banners rest above stone arches",
    "soft steps echo through the keep",
  ],
  space: [
    "Distant stars shimmer past the glass",
    "comets leave pale silver trails",
    "nebula light hums through the dark",
  ],
  autumn: [
    "Campfire smoke drifts through the pines",
    "lanterns sway beside the trail",
    "the lookout glows above the ridge",
  ],
  mushroom: [
    "Glowing spores float between the roots",
    "tiny lantern caps shine in the mist",
    "crystal dew gathers on curled leaves",
  ],
  "volcanic-forge": [
    "Embers glow along black stone",
    "ash drifts over the molten path",
    "iron heat rises from the forge",
  ],
  sunflower: [
    "Tall blooms lean with the breeze",
    "bees weave over golden rows",
    "warm light settles on the meadow",
  ],
  "desert-oasis": [
    "Sunlight shivers over the dunes",
    "palm shade cools the spring",
    "old ruins rest beyond the sand",
  ],
  "steam-punk-workshop": [
    "Copper gears click in steady rhythm",
    "steam hisses from brass pipes",
    "clockwork sparks dance above the bench",
  ],
  "frostveil-kingdom": [
    "Ice light glitters across the path",
    "snow gathers under crystal pines",
    "the palace shines beyond frozen falls",
  ],
};

type QuestWorldProfile = {
  setting: string;
  route: string[];
  landmarks: string[];
  creatures: string[];
  treasures: string[];
  actions: string[];
  moods: string[];
};

const QUEST_WORLD_PROFILES: Partial<Record<WorldId, QuestWorldProfile>> = {
  cafe: {
    setting: "coffee village",
    route: ["cobblestone lane", "warm counter", "quiet booth", "bakery path", "mocha garden"],
    landmarks: ["cafe corner", "roast ridge", "latte lake", "bean garden", "mocha manor"],
    creatures: ["sleepy kitten", "friendly barista", "tiny sparrow", "curious pup"],
    treasures: ["golden bean", "cream lantern", "warm mug", "sugar charm"],
    actions: ["brews", "guides", "warms", "carries", "polishes"],
    moods: ["cozy", "gentle", "golden", "sweet", "quiet"],
  },
  forest: {
    setting: "mossy forest",
    route: ["fern path", "brook trail", "pine bridge", "fox hollow", "elder grove"],
    landmarks: ["mossy trail", "fern grove", "fox hollow", "whisper woods", "elder tree"],
    creatures: ["red fox", "small moth", "green beetle", "sleepy owl"],
    treasures: ["dew lantern", "moss charm", "acorn bell", "leaf badge"],
    actions: ["follows", "guards", "finds", "crosses", "lights"],
    moods: ["mossy", "soft", "green", "hidden", "misty"],
  },
  ocean: {
    setting: "underwater kingdom",
    route: ["tide path", "coral bridge", "shell lane", "pearl cave", "sea gate"],
    landmarks: ["tide pool", "coral reef", "pearl grotto", "deep abyss", "sea palace"],
    creatures: ["bright fish", "quiet crab", "gentle turtle", "silver dolphin"],
    treasures: ["pearl key", "shell crown", "coral charm", "bubble lamp"],
    actions: ["drifts", "dives", "carries", "shines", "guides"],
    moods: ["blue", "salty", "clear", "rippling", "gentle"],
  },
  sakura: {
    setting: "spring garden",
    route: ["petal path", "lotus bridge", "tea lane", "shrine steps", "garden gate"],
    landmarks: ["blossom path", "lotus pond", "tea garden", "shrine hill", "sakura sanctuary"],
    creatures: ["koi fish", "paper crane", "quiet sparrow", "lantern moth"],
    treasures: ["pink ribbon", "lotus charm", "tea bell", "petal badge"],
    actions: ["floats", "waits", "guides", "rings", "glows"],
    moods: ["pink", "calm", "spring", "bright", "peaceful"],
  },
  castle: {
    setting: "royal castle",
    route: ["stone gate", "banner hall", "royal court", "knight road", "crown stair"],
    landmarks: ["castle gate", "royal courtyard", "knights hall", "kings keep", "crown citadel"],
    creatures: ["brave hound", "silver hawk", "tiny dragon", "castle mouse"],
    treasures: ["gold crown", "velvet banner", "ruby key", "royal badge"],
    actions: ["guards", "raises", "opens", "carries", "polishes"],
    moods: ["royal", "brave", "golden", "velvet", "steady"],
  },
  space: {
    setting: "cosmic observatory",
    route: ["star path", "nebula bridge", "moon deck", "comet trail", "orbit gate"],
    landmarks: ["star glade", "nebula grove", "galaxy pool", "cosmic ruins", "astral observatory"],
    creatures: ["moon moth", "star pup", "tiny comet", "glowing owl"],
    treasures: ["meteor shard", "starlight key", "orbit badge", "cosmic gem"],
    actions: ["orbits", "shimmers", "signals", "guides", "glows"],
    moods: ["stellar", "quiet", "silver", "distant", "bright"],
  },
  autumn: {
    setting: "cozy campsite",
    route: ["pine trail", "camp path", "ember bridge", "bear ridge", "ranger road"],
    landmarks: ["camp entrance", "pine camp", "campfire circle", "bear ridge", "ranger lookout"],
    creatures: ["brown bear", "trail fox", "camp owl", "tiny squirrel"],
    treasures: ["ember badge", "pine lantern", "map charm", "warm compass"],
    actions: ["tracks", "warms", "guides", "carries", "signals"],
    moods: ["crisp", "golden", "warm", "leafy", "quiet"],
  },
  mushroom: {
    setting: "fairy mushroom village",
    route: ["mushroom trail", "fairy path", "glow bridge", "crystal lane", "queen root"],
    landmarks: [
      "mushroom trail",
      "fairy hollow",
      "glow grove",
      "crystal thicket",
      "fairy queens tree",
    ],
    creatures: ["tiny fairy", "glow moth", "soft beetle", "purple snail"],
    treasures: ["spore lamp", "crystal charm", "fairy bell", "violet badge"],
    actions: ["sparkles", "hides", "guides", "twirls", "glows"],
    moods: ["magic", "violet", "soft", "glowing", "whimsical"],
  },
  sunflower: {
    setting: "sunflower meadow",
    route: ["daisy path", "sunny row", "windmill road", "harvest lane", "meadow gate"],
    landmarks: [
      "daisy path",
      "sunflower field",
      "windmill hill",
      "golden harvest",
      "harvest haven",
    ],
    creatures: ["busy bee", "yellow bird", "field mouse", "painted butterfly"],
    treasures: ["honey badge", "sun charm", "seed pouch", "gold ribbon"],
    actions: ["buzzes", "waves", "gathers", "guides", "shines"],
    moods: ["sunny", "golden", "bright", "warm", "cheerful"],
  },
  "volcanic-forge": {
    setting: "volcanic forge",
    route: ["ember trail", "lava bridge", "basalt road", "magma stair", "forge gate"],
    landmarks: ["ember trail", "lava cavern", "molten crossing", "magma summit", "inferno forge"],
    creatures: ["ember fox", "ash raven", "stone turtle", "spark sprite"],
    treasures: ["fire crystal", "iron badge", "ember key", "molten coin"],
    actions: ["sparks", "forges", "guards", "heats", "signals"],
    moods: ["fiery", "bold", "smoky", "glowing", "brave"],
  },
  "desert-oasis": {
    setting: "desert oasis",
    route: ["sandy trail", "cactus road", "palm shade", "sunstone dune", "pyramid gate"],
    landmarks: ["sandy trail", "cactus camp", "oasis spring", "sunstone dunes", "golden pyramid"],
    creatures: ["desert fox", "small lizard", "gold beetle", "palm bird"],
    treasures: ["oasis gem", "sun coin", "silk map", "gold scarab"],
    actions: ["crosses", "shades", "finds", "guards", "reveals"],
    moods: ["sunlit", "golden", "dry", "ancient", "warm"],
  },
  "steam-punk-workshop": {
    setting: "steampunk workshop",
    route: ["gear yard", "boiler hall", "copper road", "steam bridge", "clockwork gate"],
    landmarks: ["gear yard", "boiler room", "copper works", "steam forge", "clockwork core"],
    creatures: ["brass mouse", "clockwork bird", "steam pup", "copper beetle"],
    treasures: ["gear badge", "copper key", "brass spring", "clock charm"],
    actions: ["clicks", "builds", "turns", "repairs", "signals"],
    moods: ["brassy", "clever", "warm", "busy", "steady"],
  },
  "frostveil-kingdom": {
    setting: "frostveil kingdom",
    route: ["frost path", "crystal bridge", "snow road", "ice stair", "palace gate"],
    landmarks: ["frost path", "crystal grove", "frozen falls", "ice citadel", "frostveil palace"],
    creatures: ["snow fox", "ice moth", "white hare", "silver owl"],
    treasures: ["ice gem", "frost badge", "crystal key", "snow lantern"],
    actions: ["glitters", "slides", "guards", "guides", "shines"],
    moods: ["icy", "silver", "quiet", "frozen", "bright"],
  },
};

const MASCOT_LINES: Record<string, string[]> = {
  idle: ["Ready when your paws are.", "Tap in and wake the room.", "A cozy run is waiting."],
  happy: ["Nice rhythm, keep gliding.", "Clean strokes, steady paws.", "That flow looks sharp."],
  oops: [
    "Slow it down, stay smooth.",
    "Breathe, then land each key.",
    "Reset the rhythm, not the run.",
  ],
  sleep: ["The room is sleepy. Type.", "Wake the keys with one word.", "Your keyboard is waiting."],
};

const WORD_POOL = [
  "amber",
  "anchor",
  "apple",
  "ash",
  "bamboo",
  "basil",
  "beam",
  "berry",
  "blossom",
  "breeze",
  "brook",
  "cabin",
  "candle",
  "caper",
  "cedar",
  "chime",
  "clover",
  "cocoa",
  "comet",
  "coral",
  "crystal",
  "daisy",
  "dawn",
  "drift",
  "ember",
  "feather",
  "fern",
  "glimmer",
  "glow",
  "golden",
  "harbor",
  "honey",
  "ivory",
  "jasmine",
  "juniper",
  "lagoon",
  "lantern",
  "leaf",
  "linen",
  "lunar",
  "maple",
  "marble",
  "meadow",
  "meteor",
  "mint",
  "mist",
  "mocha",
  "moss",
  "nectar",
  "oasis",
  "opal",
  "orbit",
  "pearl",
  "petal",
  "pine",
  "prairie",
  "quartz",
  "quiet",
  "ripple",
  "river",
  "sable",
  "sakura",
  "sand",
  "shell",
  "silver",
  "snow",
  "solace",
  "spark",
  "sprout",
  "star",
  "stone",
  "sugar",
  "sunbeam",
  "thistle",
  "timber",
  "trail",
  "velvet",
  "violet",
  "water",
  "willow",
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

function profileFor(worldId: WorldId): QuestWorldProfile {
  return QUEST_WORLD_PROFILES[worldId] ?? QUEST_WORLD_PROFILES.cafe!;
}

function stableIndex(seed: string) {
  return seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function pickLocal<T>(items: T[], seed: string, index: number): T {
  return items[(stableIndex(seed) + index) % items.length];
}

function tokenizeQuestSentence(sentence: string) {
  return sentence
    .toLowerCase()
    .replace(/[^a-z0-9'\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function createLocalAdventureWords(
  stageName: string,
  worldId: WorldId,
  seedWords: string[],
  count: number,
  offset = 0,
) {
  const profile = profileFor(worldId);
  const stageWords = normalizeWords(stageName.split(/\s+/));
  const stage = stageWords.join(" ");
  const seed = `${worldId}:${stageName}:${seedWords.join("-")}:${offset}`;
  const words: string[] = [];
  const templates = [
    (i: number) =>
      `${stage} begins near the ${pickLocal(profile.landmarks, seed, i)} where ${pickLocal(profile.moods, seed, i)} light covers the ${pickLocal(profile.route, seed, i)}`,
    (i: number) =>
      `follow the ${pickLocal(profile.route, seed, i + 2)} past the ${pickLocal(profile.landmarks, seed, i + 3)} and keep a steady typing rhythm`,
    (i: number) =>
      `a ${pickLocal(profile.creatures, seed, i + 4)} watches from the ${profile.setting} while the ${pickLocal(profile.treasures, seed, i + 5)} waits ahead`,
    (i: number) =>
      `each clean key ${pickLocal(profile.actions, seed, i + 6)} the path forward and brings the next marker into view`,
    (i: number) =>
      `the ${pickLocal(profile.moods, seed, i + 7)} ${pickLocal(profile.route, seed, i + 8)} turns toward ${pickLocal(profile.landmarks, seed, i + 9)} with quiet promise`,
    (i: number) =>
      `stay calm as the ${pickLocal(profile.creatures, seed, i + 10)} guides you between ${pickLocal(profile.treasures, seed, i + 11)} and ${pickLocal(profile.landmarks, seed, i + 12)}`,
    (i: number) =>
      `your paws cross the ${pickLocal(profile.route, seed, i + 13)} while the ${pickLocal(profile.treasures, seed, i + 14)} ${pickLocal(profile.actions, seed, i + 15)} softly`,
    (i: number) =>
      `finish this route with smooth letters careful spaces and a brave heart for the next quest`,
  ];

  let templateIndex = offset;
  while (words.length < count + 16) {
    const sentence = templates[templateIndex % templates.length](templateIndex);
    const nextWords = tokenizeQuestSentence(sentence);
    for (const word of nextWords) {
      if (words[words.length - 1] === word) continue;
      words.push(word);
    }
    templateIndex += 1;
  }

  return words.slice(0, count);
}

export async function generateWorldText(worldId: WorldId): Promise<string | null> {
  const ai = await aiWorldText(worldId).catch(() => null);
  if (ai) return ai;

  const lines = WORLD_LINES[worldId];
  return lines ? `${lines[0]}. ${lines[1]}. ${lines[2]}.` : null;
}

export async function generateWeakSpotWords(mistakeChars: string[]): Promise<string[] | null> {
  if (mistakeChars.length === 0) return null;

  const sentences = await aiWeakSpotSentences(mistakeChars).catch(() => null);
  if (sentences && sentences.length > 0) {
    const words = sentences.join(" ").split(/\s+/).filter(Boolean);
    return words.length >= 8 ? words : null;
  }

  const charSet = new Set(mistakeChars.map((char) => char.toLowerCase()));
  const pool = WORD_POOL.filter((word) => [...word].some((char) => charSet.has(char)));
  if (pool.length === 0) return null;

  const rotated = rotatePick(pool, 24, [...charSet].join(""));
  const phrases = Array.from({ length: 8 }, (_, index) =>
    rotated.slice(index * 3, index * 3 + 3).join(" "),
  ).filter(Boolean);

  return phrases.length > 0 ? phrases : null;
}

export async function generateMascotLine(
  mood: string,
  ctx?: MascotContext,
): Promise<string | null> {
  const ai = aiMascotLine(mood, ctx);
  if (ai) return ai;

  const lines = MASCOT_LINES[mood];
  return lines ? (rotatePick(lines, 1, mood)[0] ?? null) : null;
}

export async function generateQuestText(
  stageName: string,
  worldId: WorldId,
): Promise<string | null> {
  const profile = profileFor(worldId);
  const seed = `${worldId}:${stageName}:intro`;
  const route = pickLocal(profile.route, seed, 1);
  const landmark = pickLocal(profile.landmarks, seed, 2);
  const treasure = pickLocal(profile.treasures, seed, 3);
  const mood = pickLocal(profile.moods, seed, 4);
  return `${stageName}: follow the ${route} toward ${landmark}, keep a ${mood} rhythm, and find the ${treasure}.`;
}

export async function generateLessonText(
  difficulty: Difficulty,
  targetZones: Zone[],
  count = 30,
): Promise<string> {
  const text = await aiLessonText(difficulty, targetZones, count).catch(() => null);
  if (text) return text;
  return WORD_POOL.slice(0, count).join(" ");
}

export function sprinklePunctuation(words: string[]): string[] {
  if (words.length === 0) return words;
  const result: string[] = [];
  let sincePeriod = 0;
  let sinceComma = 0;
  for (let i = 0; i < words.length; i++) {
    sincePeriod++;
    sinceComma++;
    const word = words[i];
    const remaining = words.length - i - 1;
    if (sincePeriod >= 5 + Math.floor(Math.random() * 6) && remaining >= 2) {
      result.push(word + ".");
      sincePeriod = 0;
      sinceComma = 0;
    } else if (sinceComma >= 3 + Math.floor(Math.random() * 4) && remaining >= 1) {
      const mark = Math.random() < 0.15 ? ";" : Math.random() < 0.25 ? ":" : ",";
      result.push(word + mark);
      sinceComma = 0;
    } else if (Math.random() < 0.03 && remaining >= 2) {
      result.push(word + (Math.random() < 0.5 ? "!" : "?"));
      sincePeriod = 0;
      sinceComma = 0;
    } else {
      result.push(word);
    }
  }
  if (sincePeriod < 4 && result.length > 0) {
    const last = result[result.length - 1];
    const punct = last.endsWith(".") || last.endsWith("!") || last.endsWith("?") ? "" : ".";
    if (punct) result[result.length - 1] = last + punct;
  }
  return result;
}

export async function generateNextWords(worldId: WorldId, count = 30): Promise<string[]> {
  const allWords: string[] = [];
  for (let attempt = 0; attempt < 3 && allWords.length < count; attempt++) {
    const text = await aiWorldText(worldId).catch(() => null);
    if (text) {
      const words = text
        .replace(/[^\w\s'-]/g, "")
        .split(/\s+/)
        .filter(Boolean);
      if (words.length >= 5) allWords.push(...words);
    }
  }
  if (allWords.length >= 5) return sprinklePunctuation(allWords.slice(0, count));

  const lines = WORLD_LINES[worldId];
  if (lines) {
    const pool = lines
      .join(" ")
      .replace(/[^\w\s'-]/g, "")
      .split(/\s+/)
      .filter(Boolean);
    const batch = Array.from(
      { length: count },
      () => pool[Math.floor(Math.random() * pool.length)],
    );
    return sprinklePunctuation(batch);
  }
  const batch = Array.from(
    { length: count },
    () => WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)],
  );
  return sprinklePunctuation(batch);
}

export async function generateAdventureWords(
  stageName: string,
  worldId: WorldId,
  seedWords: string[],
  count = 36,
  offset = 0,
): Promise<string[] | null> {
  const local = createLocalAdventureWords(stageName, worldId, seedWords, count, offset);
  if (local.length >= count) return local;

  const ai = await aiAdventureWords(stageName, worldId, seedWords, count).catch(() => null);
  if (ai && new Set(ai.map((word) => word.toLowerCase())).size >= Math.min(12, ai.length))
    return ai;

  const tokens = normalizeWords([
    ...seedWords,
    ...stageName.split(/[^a-zA-Z]+/),
    ...(WORLD_THEMES[worldId] ?? "").split(/[^a-zA-Z]+/),
  ]);
  if (tokens.length === 0) return null;
  return rotatePick(tokens, count, `${worldId}:${stageName}:${count}:${offset}`);
}
