import type { WorldLexicon } from "./types";


export const LEXICONS: Record<string, WorldLexicon> = {
  cafe: {
    nouns: ["coffee", "steam", "mug", "counter", "window", "cream", "sugar", "aroma", "foam", "cinnamon", "booth", "lamp", "shade", "honey", "barista", "espresso", "latte", "mocha", "cocoa", "vanilla", "caramel", "brew", "cup", "sip", "bean", "roast", "scone", "muffin", "biscotti", "napkin", "tray", "spoon", "pitcher", "kettle", "grinder", "filter", "platter", "saucer", "lid", "stirrer"],
    adjs: ["warm", "soft", "quiet", "golden", "rich", "smooth", "cozy", "gentle", "faint", "fresh", "bitter", "sweet", "bold", "mild", "dark", "creamy", "steaming", "fragrant", "caramelized", "toasted"],
    verbs: ["steams", "drifts", "taps", "glows", "settles", "curls", "pours", "drips", "stirs", "blends", "froths", "warms", "fills", "lingers", "flows"],
    preps: ["through", "across", "beside", "near", "past", "under", "over", "behind", "beyond", "between"],
    seeds: [],
  },
  forest: {
    nouns: ["fern", "moss", "brook", "shadow", "trail", "root", "branch", "glade", "thicket", "canopy", "trunk", "dew", "stone", "creek", "bloom", "pollen", "bark", "vine", "soil", "bird", "fox", "deer", "owl", "rabbit", "squirrel", "acorn", "pinecone", "thistle", "mushroom", "log", "nest", "den", "clearing", "ridge", "valley", "ditch", "bank", "gully", "knoll", "thaw"],
    adjs: ["damp", "green", "quiet", "soft", "deep", "still", "wild", "fresh", "cool", "dark", "mossy", "wooded", "shady", "silent", "dappled", "rich", "dense", "moist", "earthy", "ancient"],
    verbs: ["sways", "chatters", "flickers", "grows", "spreads", "creeps", "drifts", "rises", "falls", "settles", "shimmers", "weaves", "rustles", "glows", "blooms"],
    preps: ["through", "under", "beside", "among", "past", "over", "beneath", "beyond", "across", "near"],
    seeds: [],
  },
  ocean: {
    nouns: ["wave", "tide", "salt", "shell", "coral", "spray", "foam", "shore", "surge", "drift", "kelp", "fin", "scale", "brine", "current", "sand", "rock", "pool", "glimmer", "harbor", "tidepool", "oyster", "pearl", "crab", "starfish", "urchin", "anemone", "seaweed", "breaker", "shallows", "depths", "reef", "lagoon", "coast", "cliff", "cove", "inlet", "bay", "pier", "dock"],
    adjs: ["salty", "deep", "cold", "clear", "still", "rough", "calm", "bright", "dark", "shallow", "rolling", "restless", "tranquil", "briny", "sparkling", "vast", "gentle", "powerful", "misty", "endless"],
    verbs: ["crashes", "rises", "falls", "glimmers", "rolls", "surges", "recedes", "sparkles", "shimmers", "flows", "drifts", "washes", "sways", "stretches", "breathes"],
    preps: ["across", "over", "through", "beneath", "past", "near", "beyond", "under", "along", "beside"],
    seeds: [],
  },
  sakura: {
    nouns: ["petal", "bloom", "lantern", "pond", "koi", "branch", "paper", "glow", "garden", "path", "gate", "bridge", "stone", "moss", "temple", "bamboo", "scroll", "silk", "ribbon", "wind", "blossom", "cherry", "moon", "gate", "shrine", "stepping", "water", "iris", "willow", "plum", "jasmine", "breeze", "twilight", "dew", "cricket", "orchid", "maple", "pebble", "torch", "sake"],
    adjs: ["pink", "soft", "gentle", "bright", "faint", "calm", "still", "warm", "pale", "delicate", "fragile", "serene", "peaceful", "tranquil", "luminous", "golden", "cool", "misty", "silent", "sacred"],
    verbs: ["drifts", "glows", "falls", "floats", "sways", "ripples", "blooms", "settles", "spirals", "gathers", "reflects", "shimmers", "rests", "wanders", "fades"],
    preps: ["across", "over", "under", "through", "past", "beyond", "beside", "near", "among", "behind"],
    seeds: [],
  },
  castle: {
    nouns: ["candle", "hall", "stone", "velvet", "banner", "arch", "keep", "torch", "throne", "tapestry", "courtyard", "turret", "chamber", "iron", "oak", "tile", "glass", "silk", "crown", "lantern", "knight", "shield", "sword", "armor", "scroll", "throne", "feast", "wine", "bread", "cheese", "goblet", "hearth", "mantle", "stair", "vault", "bridge", "moat", "gate", "rampart", "spire"],
    adjs: ["royal", "tall", "dark", "cold", "grand", "quiet", "ancient", "rich", "thick", "heavy", "carved", "gilded", "vaulted", "stained", "narrow", "winding", "silent", "dusty", "polished", "faded"],
    verbs: ["flickers", "echoes", "glows", "stands", "spreads", "hangs", "rises", "gleams", "watches", "guards", "shimmers", "rests", "waits", "stretches", "shines"],
    preps: ["through", "across", "behind", "beside", "under", "over", "past", "beyond", "along", "near"],
    seeds: [],
  },
  space: {
    nouns: ["star", "comet", "nebula", "cosmos", "orbit", "dust", "glow", "asteroid", "crater", "ring", "flare", "eclipse", "satellite", "horizon", "silence", "void", "galaxy", "planet", "moon", "solar", "light", "shadow", "plume", "vortex", "cluster", "drift", "abyss", "dawn", "lens", "pulse", "beam", "core", "crown", "field", "motion", "tide", "wave", "phase", "path", "node"],
    adjs: ["deep", "dark", "cold", "vast", "still", "bright", "distant", "quiet", "faint", "luminous", "ancient", "silent", "stellar", "cosmic", "solar", "infinite", "glowing", "frozen", "empty", "radiant"],
    verbs: ["shimmers", "drifts", "burns", "spins", "floats", "pulses", "glows", "streaks", "orbits", "fades", "expands", "collapses", "reflects", "travels", "hums"],
    preps: ["across", "through", "beyond", "past", "under", "over", "near", "among", "behind", "inside"],
    seeds: [],
  },
  autumn: {
    nouns: ["campfire", "pine", "ember", "lantern", "ridge", "trail", "smoke", "wood", "flame", "spark", "log", "tent", "maple", "acorn", "frost", "copper", "campsite", "mountain", "cliff", "lookout", "needle", "bark", "stone", "ash", "cinder", "glow", "dawn", "dusk", "moss", "fern", "slope", "peak", "valley", "cabin", "shelter", "bridge", "spring", "brook", "pass", "meadow"],
    adjs: ["crisp", "warm", "cold", "golden", "dry", "still", "bright", "soft", "orange", "red", "amber", "rustling", "fading", "steady", "smoky", "cozy", "quiet", "clear", "frosted", "autumn"],
    verbs: ["crackles", "drifts", "glows", "flickers", "settles", "sparks", "rises", "falls", "blows", "wraps", "shimmers", "sweeps", "curls", "spreads", "fades"],
    preps: ["through", "across", "over", "under", "near", "past", "behind", "beyond", "beside", "among"],
    seeds: [],
  },
  mushroom: {
    nouns: ["spore", "root", "glow", "cap", "mist", "dew", "veil", "stalk", "grotto", "crystal", "moss", "shade", "damp", "tendril", "fairy", "dust", "glimmer", "curl", "web", "garden", "thicket", "grove", "hollow", "mushroom", "toadstool", "lichen", "pollen", "petal", "sparkle", "ember", "cave", "cavern", "nook", "dell", "spring", "pool", "pebble", "vein", "rootlet", "trail"],
    adjs: ["damp", "faint", "soft", "green", "blue", "dark", "cool", "silent", "still", "glowing", "bioluminescent", "fragile", "delicate", "twisted", "curled", "moist", "shadowy", "enchanted", "ancient", "misty"],
    verbs: ["glows", "floats", "grows", "spreads", "gathers", "drifts", "shimmers", "curls", "hangs", "blooms", "sparkles", "rises", "settles", "weaves", "flickers"],
    preps: ["through", "under", "among", "beside", "past", "beyond", "near", "over", "across", "beneath"],
    seeds: [],
  },
  "volcanic-forge": {
    nouns: ["forge", "lava", "ash", "ember", "iron", "anvil", "spark", "ore", "coal", "hammer", "tongs", "bellows", "furnace", "slag", "cinder", "flame", "steel", "smoke", "glow", "steam", "magma", "crater", "vent", "boulder", "stone", "metal", "blade", "chain", "gear", "piston", "quarry", "tunnel", "cavern", "chamber", "channel", "crucible", "mold", "ingot", "temper", "alloy"],
    adjs: ["hot", "red", "bright", "black", "heavy", "thick", "molten", "smoky", "solid", "sharp", "glowing", "scorching", "rugged", "rough", "polished", "burning", "fierce", "blazing", "dark", "metallic"],
    verbs: ["burns", "glows", "flows", "hammers", "forges", "sparks", "rises", "cracks", "melts", "strikes", "blazes", "casts", "tempers", "quenches", "pounds"],
    preps: ["through", "across", "over", "under", "past", "beyond", "beside", "near", "inside", "beneath"],
    seeds: [],
  },
  sunflower: {
    nouns: ["sunflower", "meadow", "gold", "pollen", "field", "bloom", "stem", "petal", "buzz", "row", "seed", "stalk", "sky", "breeze", "dew", "honey", "wheat", "farm", "barn", "bee", "butterfly", "ladybug", "grass", "dirt", "tractor", "scarecrow", "fence", "gate", "pond", "orchard", "hay", "grain", "pasture", "crop", "ridge", "furrow", "blade", "root", "sunlight", "horizon"],
    adjs: ["golden", "bright", "tall", "warm", "still", "sweet", "sunny", "green", "ripe", "yellow", "open", "wide", "quiet", "gentle", "dusty", "summer", "fresh", "clear", "deep", "luminous"],
    verbs: ["blooms", "sways", "buzzes", "glows", "stretches", "reaches", "turns", "bends", "sways", "grows", "rises", "drifts", "settles", "sparkles", "basks"],
    preps: ["across", "over", "through", "under", "among", "past", "beyond", "near", "beside", "above"],
    seeds: [],
  },
  "desert-oasis": {
    nouns: ["dune", "oasis", "sand", "palm", "spring", "ruin", "stone", "shade", "heat", "sun", "wind", "arch", "pillar", "well", "horizon", "camel", "tent", "market", "silk", "market", "bazaar", "caravan", "merchant", "sphinx", "pyramid", "temple", "obelisk", "courtyard", "fountain", "cistern", "archway", "alcove", "lantern", "rug", "spice", "incense", "copper", "brass", "leather", "turquoise"],
    adjs: ["hot", "dry", "golden", "ancient", "still", "bright", "vast", "empty", "sun-bleached", "dusty", "cracked", "weathered", "timeless", "silent", "scorching", "cool", "shadowed", "deep", "pale", "sacred"],
    verbs: ["shimmers", "stretches", "glows", "rises", "settles", "drifts", "bakes", "cracks", "fades", "reflects", "burns", "shines", "rests", "stands", "waits"],
    preps: ["across", "over", "through", "beyond", "under", "past", "near", "behind", "among", "beneath"],
    seeds: [],
  },
  "steam-punk-workshop": {
    nouns: ["gear", "steam", "brass", "copper", "clock", "spring", "piston", "valve", "cog", "pipe", "lever", "dial", "wheel", "wire", "spark", "oil", "metal", "plate", "screw", "bevel", "furnace", "boiler", "engine", "dynamo", "conduit", "gauge", "lens", "crank", "shaft", "cylinder", "turbine", "regulator", "compass", "sextant", "caliper", "forge", "anvil", "bellows", "chisel", "rivet"],
    adjs: ["brass", "copper", "iron", "steel", "hot", "heavy", "bright", "dark", "polished", "rusted", "steaming", "mechanical", "precise", "intricate", "worn", "oiled", "spinning", "gleaming", "solid", "grooved"],
    verbs: ["spins", "hisses", "clicks", "turns", "pumps", "grinds", "sparks", "glows", "whirs", "churns", "ticks", "rotates", "pushes", "lifts", "presses"],
    preps: ["through", "across", "over", "under", "beside", "past", "behind", "near", "inside", "beneath"],
    seeds: [],
  },
  "frostveil-kingdom": {
    nouns: ["ice", "frost", "snow", "crystal", "pine", "palace", "glacier", "flake", "wind", "chill", "shard", "peak", "frozen", "aurora", "tundra", "sledge", "north", "winter", "lantern", "snowdrift", "sleet", "blizzard", "icicle", "frost", "mantle", "sheet", "crust", "spire", "pane", "hail", "frostwork", "snowfall", "glacier", "crevasse", "icefall", "rim", "prow", "ledge", "cavern", "grotto"],
    adjs: ["cold", "white", "still", "frozen", "clear", "silent", "bitter", "glittering", "icy", "crystal", "pale", "deep", "frosted", "shimmering", "northern", "frigid", "snowy", "winter", "glass-like"],
    verbs: ["glitters", "falls", "blows", "crackles", "hangs", "freezes", "shines", "drifts", "settles", "gathers", "sparkles", "glimmers", "creaks", "reflects", "spreads"],
    preps: ["across", "over", "through", "beneath", "past", "beyond", "near", "beside", "under", "among"],
    seeds: [],
  },
};

