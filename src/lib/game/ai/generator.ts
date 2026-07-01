import type { WorldId } from "../../../components/WorldTheme";
import { analyzePatterns } from "./patterns";

type BigramGraph = Map<string, Map<string, number>>;

type WorldLexicon = {
  nouns: string[];
  adjs: string[];
  verbs: string[];
  preps: string[];
  seeds: string[];
};

function combineWords(l: WorldLexicon): string[] {
  return [...l.nouns, ...l.adjs, ...l.verbs, ...l.preps];
}

const LEXICONS: Record<string, WorldLexicon> = {
  cafe: {
    nouns: ["coffee", "steam", "mug", "counter", "window", "cream", "sugar", "aroma", "foam", "cinnamon", "booth", "lamp", "shade", "honey", "barista", "espresso", "latte", "mocha", "cocoa", "vanilla", "caramel", "brew", "cup", "sip", "bean", "roast", "scone", "muffin", "biscotti", "napkin", "tray", "spoon", "pitcher", "kettle", "grinder", "filter", "platter", "saucer", "lid", "stirrer"],
    adjs: ["warm", "soft", "quiet", "golden", "rich", "smooth", "cozy", "gentle", "faint", "fresh", "bitter", "sweet", "bold", "mild", "dark", "creamy", "steaming", "fragrant", "caramelized", "toasted"],
    verbs: ["steams", "drifts", "taps", "glows", "settles", "curls", "pours", "drips", "stirs", "blends", "froths", "warms", "fills", "lingers", "flows"],
    preps: ["through", "across", "beside", "near", "past", "under", "over", "behind", "beyond", "between"],
    seeds: [
      "warm coffee steams inside a ceramic mug",
      "soft jazz drifts across the quiet room",
      "golden light glows near the front window",
      "cream swirls gently through the dark brew",
      "a barista pours foam over the counter",
      "rich aroma fills the air beside the booth",
      "cinnamon curls past the hanging lamp",
      "fresh roast steams under the warm shade",
      "caramel blends smooth with the dark coffee",
      "muffins rest on a tray behind the counter",
      "espresso drips slow into the small cup",
      "bitter notes linger through the morning air",
      "a gentle stir settles the cream into the mug",
      "steam drifts past the cold window glass",
      "soft music flows under the hanging lights",
    ],
  },
  forest: {
    nouns: ["fern", "moss", "brook", "shadow", "trail", "root", "branch", "glade", "thicket", "canopy", "trunk", "dew", "stone", "creek", "bloom", "pollen", "bark", "vine", "soil", "bird", "fox", "deer", "owl", "rabbit", "squirrel", "acorn", "pinecone", "thistle", "mushroom", "log", "nest", "den", "clearing", "ridge", "valley", "ditch", "bank", "gully", "knoll", "thaw"],
    adjs: ["damp", "green", "quiet", "soft", "deep", "still", "wild", "fresh", "cool", "dark", "mossy", "wooded", "shady", "silent", "dappled", "rich", "dense", "moist", "earthy", "ancient"],
    verbs: ["sways", "chatters", "flickers", "grows", "spreads", "creeps", "drifts", "rises", "falls", "settles", "shimmers", "weaves", "rustles", "glows", "blooms"],
    preps: ["through", "under", "beside", "among", "past", "over", "beneath", "beyond", "across", "near"],
    seeds: [
      "fern shadows sway across the forest floor",
      "a brook chatters beside the mossy trail",
      "soft light flickers through the tall canopy",
      "moss creeps over the fallen stone log",
      "deep roots spread under the ancient tree",
      "a fox drifts past the quiet thicket",
      "dew settles on the broad fern leaves",
      "green gloom settles beneath the dense branches",
      "birds weave through the shaded glade",
      "pinecones rest among the scattered thistle",
      "damp bark glows in the dappled sunlight",
      "the brook chatters over the smooth stones",
      "a clearing opens beyond the winding trail",
      "cool air rises from the damp forest soil",
      "an owl watches from the dark branch above",
    ],
  },
  ocean: {
    nouns: ["wave", "tide", "salt", "shell", "coral", "spray", "foam", "shore", "surge", "drift", "kelp", "fin", "scale", "brine", "current", "sand", "rock", "pool", "glimmer", "harbor", "tidepool", "oyster", "pearl", "crab", "starfish", "urchin", "anemone", "seaweed", "breaker", "shallows", "depths", "reef", "lagoon", "coast", "cliff", "cove", "inlet", "bay", "pier", "dock"],
    adjs: ["salty", "deep", "cold", "clear", "still", "rough", "calm", "bright", "dark", "shallow", "rolling", "restless", "tranquil", "briny", "sparkling", "vast", "gentle", "powerful", "misty", "endless"],
    verbs: ["crashes", "rises", "falls", "glimmers", "rolls", "surges", "recedes", "sparkles", "shimmers", "flows", "drifts", "washes", "sways", "stretches", "breathes"],
    preps: ["across", "over", "through", "beneath", "past", "near", "beyond", "under", "along", "beside"],
    seeds: [
      "waves crash across the salt-spray shore",
      "tide rises over the clustered tidepool rocks",
      "shells glimmer in the shallow clear water",
      "kelp sways beneath the rolling current",
      "foam drifts past the old wooden pier",
      "coral stretches across the bright reef floor",
      "a crab weaves through the submerged rock pool",
      "spray rises from the restless breaker line",
      "the vast ocean stretches beyond the cove",
      "pearls rest inside the dark oyster shell",
      "brine glistens on the smooth beach stone",
      "a starfish clings near the submerged ledge",
      "the rolling tide washes over the sand bar",
      "seaweed drifts through the slow current",
      "harbor lights shimmer across the evening swell",
    ],
  },
  sakura: {
    nouns: ["petal", "bloom", "lantern", "pond", "koi", "branch", "paper", "glow", "garden", "path", "gate", "bridge", "stone", "moss", "temple", "bamboo", "scroll", "silk", "ribbon", "wind", "blossom", "cherry", "moon", "gate", "shrine", "stepping", "water", "iris", "willow", "plum", "jasmine", "breeze", "twilight", "dew", "cricket", "orchid", "maple", "pebble", "torch", "sake"],
    adjs: ["pink", "soft", "gentle", "bright", "faint", "calm", "still", "warm", "pale", "delicate", "fragile", "serene", "peaceful", "tranquil", "luminous", "golden", "cool", "misty", "silent", "sacred"],
    verbs: ["drifts", "glows", "falls", "floats", "sways", "ripples", "blooms", "settles", "spirals", "gathers", "reflects", "shimmers", "rests", "wanders", "fades"],
    preps: ["across", "over", "under", "through", "past", "beyond", "beside", "near", "among", "behind"],
    seeds: [
      "pink petals drift across the still pond",
      "paper lanterns glow beside the winding path",
      "koi ripple through the soft garden water",
      "blossoms float past the old stone bridge",
      "a gentle breeze carries petals under the gate",
      "moonlight settles on the silent temple roof",
      "cherry blooms gather near the twisted branch",
      "silk ribbons sway through the evening air",
      "bamboo stands still beyond the garden wall",
      "willow branches brush over the stepping stones",
      "the pond reflects the pale lantern light",
      "dew gathers on the delicate orchid petal",
      "a cricket sings near the moss-covered shrine",
      "warm light fades across the bamboo grove",
      "autumn leaves rest on the cool garden stone",
    ],
  },
  castle: {
    nouns: ["candle", "hall", "stone", "velvet", "banner", "arch", "keep", "torch", "throne", "tapestry", "courtyard", "turret", "chamber", "iron", "oak", "tile", "glass", "silk", "crown", "lantern", "knight", "shield", "sword", "armor", "scroll", "throne", "feast", "wine", "bread", "cheese", "goblet", "hearth", "mantle", "stair", "vault", "bridge", "moat", "gate", "rampart", "spire"],
    adjs: ["royal", "tall", "dark", "cold", "grand", "quiet", "ancient", "rich", "thick", "heavy", "carved", "gilded", "vaulted", "stained", "narrow", "winding", "silent", "dusty", "polished", "faded"],
    verbs: ["flickers", "echoes", "glows", "stands", "spreads", "hangs", "rises", "gleams", "watches", "guards", "shimmers", "rests", "waits", "stretches", "shines"],
    preps: ["through", "across", "behind", "beside", "under", "over", "past", "beyond", "along", "near"],
    seeds: [
      "candle light flickers across the great hall",
      "velvet banners hang beside the stone arch",
      "a torch glows near the iron-bound door",
      "royal footsteps echo through the winding stair",
      "tapestries spread across the cold chamber wall",
      "the knight stands guard beside the throne",
      "golden light gleams on the polished armor",
      "a feast waits in the grand dining hall",
      "old scrolls rest in the vaulted chamber beyond",
      "the crown shines under the stained glass light",
      "heavy oak doors guard the silent courtyard",
      "dust drifts through the narrow turret stair",
      "a goblet rests on the carved oak table",
      "the hearth glows warm across the stone floor",
      "ancient armor stands watch in the empty hall",
    ],
  },
  space: {
    nouns: ["star", "comet", "nebula", "cosmos", "orbit", "dust", "glow", "asteroid", "crater", "ring", "flare", "eclipse", "satellite", "horizon", "silence", "void", "galaxy", "planet", "moon", "solar", "light", "shadow", "plume", "vortex", "cluster", "drift", "abyss", "dawn", "lens", "pulse", "beam", "core", "crown", "field", "motion", "tide", "wave", "phase", "path", "node"],
    adjs: ["deep", "dark", "cold", "vast", "still", "bright", "distant", "quiet", "faint", "luminous", "ancient", "silent", "stellar", "cosmic", "solar", "infinite", "glowing", "frozen", "empty", "radiant"],
    verbs: ["shimmers", "drifts", "burns", "spins", "floats", "pulses", "glows", "streaks", "orbits", "fades", "expands", "collapses", "reflects", "travels", "hums"],
    preps: ["across", "through", "beyond", "past", "under", "over", "near", "among", "behind", "inside"],
    seeds: [
      "distant stars shimmer across the cosmic void",
      "a comet streaks past the glowing nebula",
      "solar light pulses through the deep silence",
      "dust drifts across the empty galaxy ring",
      "the vast cosmos stretches beyond the dark horizon",
      "a planet spins slowly in its ancient orbit",
      "nebulae glow near the luminous star cluster",
      "sunlight fades beyond the distant moon ring",
      "the void hums with a faint stellar pulse",
      "an asteroid drifts through the frozen shadow",
      "a solar flare expands across the star corona",
      "starlight reflects on the silent satellite lens",
      "the galaxy spins in its endless cosmic dance",
      "deep shadows drift near the cold planet edge",
      "a beam of light travels across the empty space",
    ],
  },
  autumn: {
    nouns: ["campfire", "pine", "ember", "lantern", "ridge", "trail", "smoke", "wood", "flame", "spark", "log", "tent", "maple", "acorn", "frost", "copper", "campsite", "mountain", "cliff", "lookout", "needle", "bark", "stone", "ash", "cinder", "glow", "dawn", "dusk", "moss", "fern", "slope", "peak", "valley", "cabin", "shelter", "bridge", "spring", "brook", "pass", "meadow"],
    adjs: ["crisp", "warm", "cold", "golden", "dry", "still", "bright", "soft", "orange", "red", "amber", "rustling", "fading", "steady", "smoky", "cozy", "quiet", "clear", "frosted", "autumn"],
    verbs: ["crackles", "drifts", "glows", "flickers", "settles", "sparks", "rises", "falls", "blows", "wraps", "shimmers", "sweeps", "curls", "spreads", "fades"],
    preps: ["through", "across", "over", "under", "near", "past", "behind", "beyond", "beside", "among"],
    seeds: [
      "campfire crackles under the autumn stars",
      "smoke drifts across the pine-scented ridge",
      "embers glow near the stone fire ring",
      "golden leaves fall past the canvas tent",
      "frost settles on the fallen maple leaves",
      "a lantern flickers beside the winding trail",
      "sparks rise through the cold mountain air",
      "the lookout glows warm beyond the ridge line",
      "pine needles spread across the damp forest floor",
      "dusk fades over the quiet valley below",
      "copper leaves drift through the steady breeze",
      "a cabin waits near the mountain spring brook",
      "crisp air wraps around the glowing campfire",
      "embers float past the dark silhouette of pines",
      "the slope glimmers under the cold morning frost",
    ],
  },
  mushroom: {
    nouns: ["spore", "root", "glow", "cap", "mist", "dew", "veil", "stalk", "grotto", "crystal", "moss", "shade", "damp", "tendril", "fairy", "dust", "glimmer", "curl", "web", "garden", "thicket", "grove", "hollow", "mushroom", "toadstool", "lichen", "pollen", "petal", "sparkle", "ember", "cave", "cavern", "nook", "dell", "spring", "pool", "pebble", "vein", "rootlet", "trail"],
    adjs: ["damp", "faint", "soft", "green", "blue", "dark", "cool", "silent", "still", "glowing", "bioluminescent", "fragile", "delicate", "twisted", "curled", "moist", "shadowy", "enchanted", "ancient", "misty"],
    verbs: ["glows", "floats", "grows", "spreads", "gathers", "drifts", "shimmers", "curls", "hangs", "blooms", "sparkles", "rises", "settles", "weaves", "flickers"],
    preps: ["through", "under", "among", "beside", "past", "beyond", "near", "over", "across", "beneath"],
    seeds: [
      "glowing spores float through the misty grove",
      "crystal dew gathers on the curled mushroom cap",
      "fairy lights shimmer beneath the twisted roots",
      "a damp veil hangs across the hollow grotto",
      "moss spreads over the ancient stone garden",
      "tendrils curl near the glowing mushroom stalk",
      "a blue glow rises from the dark cavern pool",
      "dust drifts through the shadowy fairy dell",
      "lichen grows along the damp grotto wall",
      "sparkles gather on the delicate mushroom veil",
      "the hollow glows with a faint bioluminescent light",
      "a toadstool stands beside the crystal spring",
      "pollen drifts through the enchanted quiet air",
      "rootlets weave under the thick moss carpet",
      "the grove settles into a deep silent glow",
    ],
  },
  "volcanic-forge": {
    nouns: ["forge", "lava", "ash", "ember", "iron", "anvil", "spark", "ore", "coal", "hammer", "tongs", "bellows", "furnace", "slag", "cinder", "flame", "steel", "smoke", "glow", "steam", "magma", "crater", "vent", "boulder", "stone", "metal", "blade", "chain", "gear", "piston", "quarry", "tunnel", "cavern", "chamber", "channel", "crucible", "mold", "ingot", "temper", "alloy"],
    adjs: ["hot", "red", "bright", "black", "heavy", "thick", "molten", "smoky", "solid", "sharp", "glowing", "scorching", "rugged", "rough", "polished", "burning", "fierce", "blazing", "dark", "metallic"],
    verbs: ["burns", "glows", "flows", "hammers", "forges", "sparks", "rises", "cracks", "melts", "strikes", "blazes", "casts", "tempers", "quenches", "pounds"],
    preps: ["through", "across", "over", "under", "past", "beyond", "beside", "near", "inside", "beneath"],
    seeds: [
      "lava glows through the cracked crater floor",
      "ash drifts across the black forge chamber",
      "a hammer strikes the bright iron on the anvil",
      "molten metal flows through the carved stone channel",
      "sparks rise from the glowing furnace vent",
      "thick smoke curls past the heavy iron chain",
      "the forge blazes with a fierce red glow",
      "bellows push air across the burning coal bed",
      "slag gathers near the anvil's iron base",
      "a blade rests in the dark quenching trough",
      "ore melts inside the scorching crucible mold",
      "steam hisses from the tempering metal surface",
      "cinders settle over the rough quarry stone",
      "the cavern glows with molten river light",
      "ingots stack beside the cooling forge wall",
    ],
  },
  sunflower: {
    nouns: ["sunflower", "meadow", "gold", "pollen", "field", "bloom", "stem", "petal", "buzz", "row", "seed", "stalk", "sky", "breeze", "dew", "honey", "wheat", "farm", "barn", "bee", "butterfly", "ladybug", "grass", "dirt", "tractor", "scarecrow", "fence", "gate", "pond", "orchard", "hay", "grain", "pasture", "crop", "ridge", "furrow", "blade", "root", "sunlight", "horizon"],
    adjs: ["golden", "bright", "tall", "warm", "still", "sweet", "sunny", "green", "ripe", "yellow", "open", "wide", "quiet", "gentle", "dusty", "summer", "fresh", "clear", "deep", "luminous"],
    verbs: ["blooms", "sways", "buzzes", "glows", "stretches", "reaches", "turns", "bends", "sways", "grows", "rises", "drifts", "settles", "sparkles", "basks"],
    preps: ["across", "over", "through", "under", "among", "past", "beyond", "near", "beside", "above"],
    seeds: [
      "tall sunflowers sway across the golden field",
      "bees buzz through the warm summer air",
      "pollen drifts over the bright sunflower row",
      "golden petals glow under the morning sun",
      "the meadow stretches beyond the wooden fence line",
      "a butterfly rests on the broad green stem",
      "sunlight settles across the open pasture ridge",
      "honey drips from the comb inside the old barn",
      "seeds scatter among the dry wheat stalks",
      "the breeze bends the tall sunflower rows",
      "dew sparkles on the deep green blades of grass",
      "a scarecrow stands watch over the quiet crop",
      "wheat sways under the warm afternoon light",
      "the horizon glows golden above the still field",
      "ladybugs gather on the sunflower's broad leaves",
    ],
  },
  "desert-oasis": {
    nouns: ["dune", "oasis", "sand", "palm", "spring", "ruin", "stone", "shade", "heat", "sun", "wind", "arch", "pillar", "well", "horizon", "camel", "tent", "market", "silk", "market", "bazaar", "caravan", "merchant", "sphinx", "pyramid", "temple", "obelisk", "courtyard", "fountain", "cistern", "archway", "alcove", "lantern", "rug", "spice", "incense", "copper", "brass", "leather", "turquoise"],
    adjs: ["hot", "dry", "golden", "ancient", "still", "bright", "vast", "empty", "sun-bleached", "dusty", "cracked", "weathered", "timeless", "silent", "scorching", "cool", "shadowed", "deep", "pale", "sacred"],
    verbs: ["shimmers", "stretches", "glows", "rises", "settles", "drifts", "bakes", "cracks", "fades", "reflects", "burns", "shines", "rests", "stands", "waits"],
    preps: ["across", "over", "through", "beyond", "under", "past", "near", "behind", "among", "beneath"],
    seeds: [
      "sand stretches across the endless golden dune",
      "palm shade cools the hidden desert spring",
      "ancient ruins rest beyond the sun-bleached arch",
      "heat shimmers over the vast horizon line",
      "a caravan drifts across the silent sand sea",
      "the oasis glows beneath the tall palm grove",
      "dust settles on the old stone temple wall",
      "incense drifts through the covered market air",
      "copper lanterns glow near the courtyard fountain",
      "a sphinx watches over the weathered stone pillar",
      "sunlight fades beyond the distant sand dune ridge",
      "the bazaar rests in the cool shadowed archway",
      "camel tracks stretch across the empty desert floor",
      "brass reflects the bright noon sun above the well",
      "spice scents drift through the silent evening air",
    ],
  },
  "steam-punk-workshop": {
    nouns: ["gear", "steam", "brass", "copper", "clock", "spring", "piston", "valve", "cog", "pipe", "lever", "dial", "wheel", "wire", "spark", "oil", "metal", "plate", "screw", "bevel", "furnace", "boiler", "engine", "dynamo", "conduit", "gauge", "lens", "crank", "shaft", "cylinder", "turbine", "regulator", "compass", "sextant", "caliper", "forge", "anvil", "bellows", "chisel", "rivet"],
    adjs: ["brass", "copper", "iron", "steel", "hot", "heavy", "bright", "dark", "polished", "rusted", "steaming", "mechanical", "precise", "intricate", "worn", "oiled", "spinning", "gleaming", "solid", "grooved"],
    verbs: ["spins", "hisses", "clicks", "turns", "pumps", "grinds", "sparks", "glows", "whirs", "churns", "ticks", "rotates", "pushes", "lifts", "presses"],
    preps: ["through", "across", "over", "under", "beside", "past", "behind", "near", "inside", "beneath"],
    seeds: [
      "brass gears spin inside the copper clockwork frame",
      "steam hisses from the iron boiler valve",
      "a piston pumps beneath the steel machine shaft",
      "sparks fly across the dark forge workbench",
      "the engine churns with a steady mechanical rhythm",
      "oiled gears click behind the brass cover plate",
      "a dial glows beside the pressure regulator gauge",
      "copper pipes curve through the steaming boiler room",
      "the dynamo hums under the spinning turbine wheel",
      "a crank turns the heavy iron cylinder shaft",
      "rivets hold the steel plates across the furnace wall",
      "a lens focuses the bright glow from the furnace",
      "the clock ticks inside its intricate brass casing",
      "bellows push air through the hot forge chamber",
      "a sextant rests near the polished brass compass",
    ],
  },
  "frostveil-kingdom": {
    nouns: ["ice", "frost", "snow", "crystal", "pine", "palace", "glacier", "flake", "wind", "chill", "shard", "peak", "frozen", "aurora", "tundra", "sledge", "north", "winter", "lantern", "snowdrift", "sleet", "blizzard", "icicle", "frost", "mantle", "sheet", "crust", "spire", "pane", "hail", "frostwork", "snowfall", "glacier", "crevasse", "icefall", "rim", "prow", "ledge", "cavern", "grotto"],
    adjs: ["cold", "white", "still", "frozen", "clear", "silent", "bitter", "glittering", "icy", "crystal", "pale", "deep", "frosted", "shimmering", "northern", "frigid", "snowy", "winter", "glass-like"],
    verbs: ["glitters", "falls", "blows", "crackles", "hangs", "freezes", "shines", "drifts", "settles", "gathers", "sparkles", "glimmers", "creaks", "reflects", "spreads"],
    preps: ["across", "over", "through", "beneath", "past", "beyond", "near", "beside", "under", "among"],
    seeds: [
      "ice crystals glitter across the frozen path",
      "snow gathers under the silent pine branches",
      "frost spreads over the palace window pane",
      "the aurora glimmers above the northern tundra",
      "a cold wind drifts through the icy pine grove",
      "icicles hang from the frozen cliff ledge",
      "frostwork sparkles across the clear morning pane",
      "a sledge glides across the vast snow field",
      "the glacier creaks beneath the winter moonlight",
      "snowfall gathers in the deep crevasse below",
      "a frozen palace shines beyond the ice spire",
      "crystal shards reflect the pale aurora light",
      "the tundra stretches silent under the snow mantle",
      "winter frost settles on the frosted pine needle",
      "ice caverns glow beneath the frozen glacier core",
    ],
  },
};

function buildBigramGraph(words: string[]): BigramGraph {
  const graph: BigramGraph = new Map();
  for (let i = 0; i < words.length - 2; i++) {
    const key = `${words[i]} ${words[i + 1]}`;
    const next = words[i + 2];
    let edges = graph.get(key);
    if (!edges) {
      edges = new Map();
      graph.set(key, edges);
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

function pickRandomStart(graph: BigramGraph): string {
  const keys = [...graph.keys()];
  return keys[Math.floor(Math.random() * keys.length)] ?? "";
}

function pickWeightedNext(graph: BigramGraph, key: string): string | null {
  const edges = graph.get(key);
  if (!edges || edges.size === 0) return null;
  const rand = Math.random();
  let cumulative = 0;
  for (const [next, prob] of edges) {
    cumulative += prob;
    if (rand <= cumulative) return next;
  }
  const keys = [...edges.keys()];
  return keys[keys.length - 1] ?? null;
}

function generateBigramPassage(lexicon: WorldLexicon, wordCount: number): string[] {
  const seedWords = lexicon.seeds.flatMap((s) => s.split(" ")).filter(Boolean);
  const graph = buildBigramGraph(seedWords);

  if (graph.size === 0) return combineWords(lexicon).slice(0, wordCount);

  const result: string[] = [];

  while (result.length < wordCount) {
    const startKey = pickRandomStart(graph);
    const parts = startKey.split(" ");
    if (result.length === 0) {
      result.push(parts[0], parts[1]);
    } else {
      const last = result[result.length - 1];
      const fallbackKey = Object.keys(Object.fromEntries(graph)).find((k) => k.startsWith(last + " "));
      if (!fallbackKey) break;
      const next = fallbackKey.split(" ")[1];
      result.push(next);
    }

    for (let i = 0; i < wordCount * 3 && result.length < wordCount; i++) {
      const key = `${result[result.length - 2]} ${result[result.length - 1]}`;
      const next = pickWeightedNext(graph, key);
      if (!next) break;
      result.push(next);
    }
  }

  return result.slice(0, wordCount);
}

function boostWeakChars(words: string[], weakChars: string[]): string[] {
  if (weakChars.length === 0) return words;
  const charSet = new Set(weakChars);
  const boosted = [...words];
  for (let i = 0; i < 8; i++) {
    const match = words.find((w) => [...w].some((c) => charSet.has(c)));
    if (match) boosted.push(match);
  }
  return boosted;
}

function cleanWords(words: string[]): string[] {
  return words
    .map((w) => w.toLowerCase().replace(/[^a-z'-]/g, ""))
    .filter((w) => w.length >= 2 && w.length <= 14);
}

const TEMPLATES = [
  (a: string, b: string, c: string) => `${a} ${b} ${c}`,
  (a: string, b: string, c: string) => `${a} and ${b} ${c}`,
  (a: string, b: string, c: string) => `${c} ${a} near the ${b}`,
  (a: string, b: string, c: string) => `${b} ${c} through the ${a}`,
  (a: string, b: string, c: string) => `the ${a} ${b}s past the ${c}`,
  (a: string, b: string, c: string) => `${b} ${c} across the ${a} ${b}`,
];

function templateSentence(words: string[]): string {
  if (words.length < 3) return words.join(" ");
  const a = words[0];
  const b = words[1 % words.length];
  const c = words[2 % words.length];
  const tpl = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  const sentence = tpl(a, b, c);
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

function generateSentences(lexicon: WorldLexicon, sentenceCount: number, wordsPerSentence: number): string {
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    const words = generateBigramPassage(lexicon, wordsPerSentence);
    const cleaned = words.filter((w) => w.length >= 2);
    if (cleaned.length >= 3) {
      const sentence = templateSentence(cleaned);
      sentences.push(sentence + ".");
    }
  }
  return sentences.join(" ");
}

export async function generateAdventureWords(
  stageName: string,
  worldId: WorldId,
  seedWords: string[],
  count = 36,
): Promise<string[] | null> {
  const lexicon = LEXICONS[worldId];
  if (!lexicon) return null;

  const pool = [
    ...seedWords,
    ...stageName.split(/[^a-zA-Z]+/).filter(Boolean),
    ...combineWords(lexicon),
  ];

  if (pool.length < 5) return null;

  const report = await analyzePatterns(10).catch(() => null);
  const weakChars = report?.topWeakChars.map((c) => c.char) ?? [];

  const weighted = boostWeakChars(pool, weakChars);
  const passage = generateBigramPassage(lexicon, count);

  return cleanWords([...passage, ...weighted]).slice(0, count);
}

export async function generateWorldText(worldId: WorldId): Promise<string | null> {
  const lexicon = LEXICONS[worldId];
  if (!lexicon) return null;
  return generateSentences(lexicon, 3, 6);
}

export async function generateQuestText(stageName: string, worldId: WorldId): Promise<string | null> {
  const lexicon = LEXICONS[worldId];
  if (!lexicon) return null;

  const words = generateBigramPassage(lexicon, 6);
  const cleaned = words.filter((w) => w.length >= 2);
  if (cleaned.length < 3) return null;

  const sentence = templateSentence(cleaned);
  return `${stageName}: ${sentence}.`;
}
