import type { WorldId } from "../../../components/WorldTheme";

// ============================================================
// Types
// ============================================================
type Difficulty = "beginner" | "easy" | "intermediate" | "advanced" | "expert" | "master";
type Zone = "home" | "top" | "bottom" | "numbers" | "symbols";

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  beginner: 0, easy: 1, intermediate: 2, advanced: 3, expert: 4, master: 5,
};

// ============================================================
// Keyboard Zone Analysis
// ============================================================
const ZONE_CHARS: Record<Zone, Set<string>> = {
  home: new Set("asdfghjkl;"),
  top: new Set("qwertyuiop"),
  bottom: new Set("zxcvbnm,./"),
  numbers: new Set("1234567890"),
  symbols: new Set("!@#$%^&*()_=+[]{}|;':\",.<>?/`~"),
};

function wordZones(word: string): Set<Zone> {
  const zones = new Set<Zone>();
  for (const ch of word.toLowerCase()) {
    for (const [name, chars] of Object.entries(ZONE_CHARS)) {
      if (chars.has(ch)) zones.add(name as Zone);
    }
  }
  return zones;
}

function wordContainsOnly(word: string, allowed: Set<string>): boolean {
  for (const ch of word.toLowerCase()) {
    if (!allowed.has(ch)) return false;
  }
  return true;
}

// ============================================================
// Recent Word Tracker (avoids repetition across generations)
// ============================================================
const RECENT_WORDS: Set<string> = new Set();
const RECENT_MAX = 80;

function trackUsed(words: string[]) {
  for (const w of words) {
    const key = w.toLowerCase().replace(/[^a-z]/g, "");
    if (key.length < 2) continue;
    RECENT_WORDS.add(key);
    if (RECENT_WORDS.size > RECENT_MAX) {
      const first = RECENT_WORDS.values().next().value;
      if (first) RECENT_WORDS.delete(first);
    }
  }
}

function isRecent(word: string): boolean {
  return RECENT_WORDS.has(word.toLowerCase().replace(/[^a-z]/g, ""));
}

function pickFresh(words: string[], count: number): string[] {
  const fresh = words.filter((w) => !isRecent(w));
  const pool = fresh.length >= count ? fresh : words;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ============================================================
// Difficulty-Based Vocabulary
// ============================================================
type WordBank = {
  nouns: string[];
  verbs: string[];
  adjs: string[];
  advs: string[];
  preps: string[];
  dets: string[];
  symbols: string[];
};

const DIFFICULTY_VOCAB: Record<Difficulty, WordBank> = {
  beginner: {
    nouns: "cat dog sun hat bat rat bed cup pen box bus car key map dot fan jar lid mat net pan rug sock tub van web yak zoo ball bell bird book boot cake coat coin corn cow desk door drop duck face farm fish flag food foot fork fox frog game gate girl goat gold golf hand hill hole hook horn horse house hut kite knife lake lamp lark leaf leg lion log mane mark milk moon mud name neck nest note oak pail path pear pipe pond pool port post rain ramp ring road rock roof room root rope rose sail salt sand seed ship shoe shop sink snow soap star stem step tail tent tile toad tree tube vase veil wall wind wing wire wolf worm yard".split(" "),
    verbs: "add ask bake bark bend bite blow call camp carry catch chop clap clean climb close cook count crack crawl cross cut dance dig drag draw drink drop eat fall feed feel fetch fill find fit fix fold follow glue grab grin grind grow guard guess guide hand hang help hide hike hit hold hop hug hunt join jump kick kiss knit knock land laugh lead lean lift link list load lock look love mark match mend milk mix move open pack paint park pass paste patch pause peel pick pile pin place plant plug point poke pour press pull push race rake reach read rent rest ride ring rip roll row rub rush sail save seal sell send shade shake share shed shine ship shop shout shut sign sing sink sit skate sketch ski skip slap sleep slide slip smell smile snap snow soak sort sound spell spend spill spin split spot spray stack stamp stand star start stay steer step stick stir stop store strike swim swing take talk tap taste teach tear tell tie tip toss touch trace trap travel trick trim trip trust tuck tug turn twist type use visit wait walk want warm wash watch wave wear weed weigh whip wipe wish wrap yell zip".split(" "),
    adjs: "big bright calm clean cold cool cute damp dark deep dry dull fair fast fat fine flat fresh full glad good grand gray great green happy hard heavy hot huge kind large late lean light little long loud low mad mean mild neat new nice noisy odd old pale plain poor proud pure quick quiet rare raw rich rough rude safe sharp short shy sick silent silly slow small smart smooth soft solid sore sour still sunny sweet swift tall tan tender thick thin tidy tight tough vast warm weak wet wide wild wise young".split(" "),
    advs: "fast hard late long loud near next quick sharp slow soft soon swift tight wide".split(" "),
    preps: "above across after along among around at before behind below beneath beside between beyond by down for from in inside into near of off on onto out outside over past through to toward under up upon with".split(" "),
    dets: "a an the this that every each some any no one two many several all both few more most other".split(" "),
    symbols: "+ - = . , ! ? ; : ' \" ( ) [ ] { } < > / @ # $ % ^ & *".split(" "),
  },
  easy: {
    nouns: "apple arrow badge banner basket beach blade blanket blaze bloom board breeze brick bridge brush bubble buckle bundle candle canyon castle cave chain chalk cheek cheese cherry chest cliff cloak cloud clover coast coral crest crown crust crystal curtain daisy dawn desert diamond ditch dock dolphin dove dragon dream dress drift dune dusk eagle earth echo ember falcon fence field flame flock flood floor flower flute forest forge fossil fountain frost fruit garden garlic gem ghost giant ginger glacier glade globe glow goose grain grape grass gravel grove growth gust hail hammer harbor harp hawk haze hearth herb herd hive horn horse hound hut igloo image insect ivory jade jewel jungle kettle kitten knot ladder lagoon lake lamb lamp lane lark lawn ledge lens lever lily linen link liver lizard loaf locket lodge loom lump lunch lung lynx maple marble market marsh meadow melon milk mirror mist mitten mixture model mold mole monk monkey moose moss moth motion motor mound mount mouse mouth mule muscle mushroom music mystery myth napkin needle nest niece night noodle north note novel number nurse nut oak oasis ocean olive onion orbit orchard oven owl oyster palace palm panda panel paper parade parent park parrot part partner party passage path patience paw peace peach peak pearl pebble pedal pencil pepper perfume person petal phone photo piano pickle picture pie piece pig pigeon pile pillar pillow pilot pin pinch pine pipe pizza place plan plane planet plant plate platform pocket poem poet point pond pool porch port post potato powder power prairie prayer price pride prince print prism promise prose pulse pumpkin puppy puzzle pyramid quarter queen quest quilt rabbit raccoon radar raft rain rainbow ramp ranch rattle recipe record reef regret relay reward rhythm ridge rifle ripple river road rocket roof root rope rose route row ruby rug ruler rust sack saddle sail salmon salute sand saucer scale scarf scene scent schedule score scout scrap scrub seal season secret seed sensor shade shadow shaft shard shelf shell shield shift shine ship shirt shock shore shovel shrine signal silence silk silver sink skate sketch skin skirt slate sleeve slice slope smile smoke snail snake snap snow soap socket soil soldier song sort source space spear sphere spice spider spill spirit splash sponge spoon sport spot spray spring sprout square squirrel stable stage stair stamp star station statue steam steel stem step stick sting stitch stock stone stool stop storm stove strand strap stream street stress stretch string stripe stroke structure study stump style subway sugar suit summer sun swallow swamp swan sweat sweep swing switch sword table tablet tackle tail tangent tank tap target task temple tent theater theme throne thunder ticket tiger tile timber toast token tomb tongue toolbox tooth top torch tower town toy track trail train tramp trap tray treasure tree tribe trip trophy trunk tube tulip tunnel turkey turtle twilight umbrella unicorn uniform valley van veil velcro velvet venture vessel vest vine violin vision visit voice volcano wagon wallet wander warmth warrior water waterfall wave wax weapon weather web wedding weight wheel whisper whistle wilderness willow wind window wine winter wisdom wizard wolf wonder wood wool word world worm worry wreck wrist yacht yard yarn year zebra zenith zephyr zero zigzag zone".split(" "),
    verbs: "accept admire adopt advise afford agree allow amuse announce apologize appear applaud appreciate approve argue arrange arrive attempt attract avoid awake balance bargain behave belong bless bloom boil borrow bounce breathe brush bubble buckle build bump bury capture care carve cause celebrate challenge change charge charm chase check cheer chew choose claim clap clarify clasp classify cleanse clear climb cling clip close coach coil collect comb combine comfort command comment compare compete complain complete confess confuse connect consider consult contain contribute control convince cook cool coordinate correct cough count cover crack cradle craft crash crawl create creep criticize cross crowd crush cultivate curl curve cycle damage dance dare deal debate decay decide declare decorate decrease defeat defend define delay delight deliver demand deny depart depend deposit describe deserve design desire destroy detect determine develop devote dial differ direct disagree disappear discover discuss dismiss display dissolve distinguish distribute disturb dive divide donate doubt draft drain dream dress drift drip drive drop drum dry ease echo edit educate elect embrace emerge employ empty enable encounter encourage endure engage enjoy enlarge enrich ensure enter entertain envy escape establish evaluate examine exceed exchange excite excuse exercise exhibit exist expand expect explain explore export expose extend extract fade fail faint fasten favor feature file fill filter finish fire fit fix flame flash flatten flavor flee flicker float flock flood flourish flow flower focus fold follow forbid force forge form frame free freeze fry gather gaze generate gesture glance glide glimpse glitter glow grab grade grant grasp greet grill grind grip groan groom ground group guard guess guide handle happen harden harm harvest hate haunt heal heat help herd hesitate hide hike hint hire hiss hit hold honor hook hop hope hover howl hug hum hunt hurry hurt ignite ignore illustrate imagine imitate immerse impact imply import impose impress improve include increase indicate indulge infect inform inhabit inherit initiate inject injure inspect inspire install instruct insult insure intend intensify interact interest interpret interrupt introduce invent invest invite involve iron irritate isolate itch jab jam jog joke judge juggle jump justify keep kick kiss knead kneel knit knock knot label lack land launch lead lean leap learn leave lend level lick lift lighten like limit line link list listen load lock long look loom loop loosen lose love lower lumber lump lunge lure lurk magnify mail maintain make manage march mark marry match matter measure melt memorize mend mention merge milk mine miss mix modify monitor moor mop motion motivate mount mourn move multiply mumble mutter name nap narrow navigate near need nest nod nominate note notice notify nourish number nurse object observe obtain occupy offer oil open operate oppose order organize originate outline overcome overhaul overlap oversee overturn overwhelm owe own pack pad paddle paint pair panic parade park part participate pass pat patch pause pave pay peck pedal peel peep peer permit persist persuade phone pick picture piece pierce pile pin pinch pine pioneer pipe pitch place plan plane plant plate play plead please pledge plot plow pluck plug plunge point polish ponder pool pop portray pose position possess post postpone pour power practice praise pray preach precede predict prefer prepare prescribe present preserve press presume pretend prevail prevent price print process proclaim produce progress prohibit project promote prompt pronounce proof propose protect protest prove provide provoke prune pull pump punch punish purchase pursue push put puzzle qualify quarter question quicken quiet quit quote race radiate raise range rank rate reach react read realize reap reason rebel rebuild recall receive recharge reckon recognize record recover recruit reduce refer reflect reform refuse regard register regret regulate reign reinforce reject rejoice relate relax release rely remain remark remember remind remove render renew rent repair repeat replace report represent reproduce request require rescue resemble reserve resign resist resolve resort respect respond restore restrict result retain retire retreat return reveal reverse review revise revive revolt reward rhyme ride ring rinse rip ripen rise risk roam roar roast rob rock roll romance root rotate rouse route row rub ruffle rule rumble rust rustle sack sacrifice saddle sail satisfy save savor scare scatter scold scorch scout scrape scratch scream scribble scrub seal search season seat secure seed seek select sell send sense separate serve set settle shade shadow shake shame shape share sharpen shatter shave shed shelter shield shift shine ship shiver shock shoot shop shorten shout shove show shower shred shrink shrug shut sigh sign signal silence simplify sing sink sip sit sketch skip slam slant slap slash sleep slice slide slip slope slow smash smell smile smoke smooth snap snatch sneak sneeze sniff snore soak soar sob soften soil solve soothe sort sound sour sow spark sparkle speak specify speed spell spend spill spin spit splash split spoil spot spray spread spring sprinkle sprout squeeze stack stamp stand stare start startle starve stay steady steal steam steep steer stem step stew stick stiffen still stimulate sting stir stitch stock stoop stop store storm stow strain strand strap stream strengthen stretch stride strike string strip strive stroke structure struggle study stuff stumble stun style submit subtract succeed suffer suggest suit sum summarize supply support suppose suppress surf surface surge surprise surrender surround survey survive suspect suspend sustain swallow sway swear sweat sweep swell swim swing switch tackle tag take talk tame tap tape target taste teach team tear tease tell tempt tend tense test thank thaw think thirst thrash thread threaten thrill thrive throb throw thrust thump tick tickle tie tighten tilt tip tire toast toil tolerate tone top topple torch toss total touch tour tow trace track trade train transfer transform transport trap travel tread treasure treat trek tremble trial trick trigger trim trip triumph troop trot trouble truck trudge trust try tuck tug tumble tune turn tutor twist type uncover undergo understand undertake undo unfold unify unite unlock unpack untie update upgrade uphold upset urge use usher utilize utter venture verify visit visualize voice volunteer vote wade wait wake walk wander want warm warn wash waste watch water wave weaken wear weave weed weigh welcome whip whirl whisper whistle widen win wink wipe wire wish withdraw witness wobble wonder work worry wrap wreck wrestle wring wrinkle write yearn yell yield zone".split(" "),
    adjs: "able agile alive ample ancient annual apparent arctic arid artistic asleep atomic austere average awake aware awful basic bitter blank bleak blissful blunt bold bouncy brave breezy brief brilliant brisk brittle broken bronze brutal bulky busy calm candid capable careful caring casual cautious central certain charming cheap cheerful chilly chosen civil classic clever cloudy clumsy coarse coastal colorful colossal comic common compact complex constant content cool copper cordial cozy crafty cramped creamy creative crisp crooked crowded crucial crunchy curious curly curved daily dainty damp dangerous daring dazzling deadly dear decent deep defiant delicate delicious delightful dense dependent desired desperate determined devoted different difficult diligent dim direct dirty distant distinct diverse dizzy divine double doubtful dramatic dreamy dreary dull durable dusty eager early earnest earthy eastern easy eerie effective efficient elastic electric elegant empty endless enduring energetic engaged enormous enthusiastic entire equal essential eternal even evident excellent excited exciting exotic expensive expert extensive extreme fabulous faint fair faithful false familiar famous fancy fantastic fast fatal favorite fearful fearless fierce fiery final fine firm fit fixed flaky flat flexible flickering floating floral flourishing flowing fluffy focused fond foolish foreign formal former fortunate fragile fragrant frank free frequent fresh friendly frightened frigid frisky frozen fruitful full funny furious furry fuzzy generous gentle genuine giant gifted gigantic glad gleaming glittering global gloomy glorious glossy glowing golden good graceful gradual grand grateful great greedy green grim gritty grounded growing grumpy guilty happy hard hardy harmful harmless harsh hasty healthy hearty heavy helpful helpless heroic hidden high hollow holy honest hopeful horrible humble hungry icy ideal idle ignorant ill illegal immense impatient important impossible impressive independent infinite informal innocent innovative instant intense intentional interesting internal intimate intricate invisible itchy jealous jolly joyful joyous juicy junior just keen kind knowledgeable known large last lasting late lawful lazy leading leafy lean learned legal legendary level light likeable likely limited lively living loaded logical lonely long loose loud lovely loving loyal lucky luminous lush magic magical magnificent main majestic major massive matching material mature maximum meaningful mechanical medical medieval mellow melodic memorable mental mighty mild milky miniature minimal minor minute misty mixed mobile moderate modern modest moist monthly monumental moody moral mortal motherly motionless mountainous muddy musical mysterious natural naughty naval neat necessary negative nervous new nice noble noisy normal northern notable novel nuclear numerous nutritious obedient objective obvious occasional odd official oily old olive open opposite optimistic orange ordinary original ornate outdoor outer outgoing oval overwhelming painful pale parallel partial passionate passive peaceful peculiar perfect permanent personal persuasive petty physical pink plain playful pleasant pleased plentiful poetic pointed polite poor popular portable positive possible powerful practical precious precise predictable preferred pregnant present pretty previous primary prime primitive principal prior private probable productive professional profound progressive prominent promising prompt proper protective proud proven psychic public punctual pure purple puzzled quaint qualified quarterly quick quiet radiant rapid rare rational raw ready realistic reasonable recent reckless recorded rectangular red reflective regular relaxed relevant reliable relieved religious reluctant remaining remarkable remote renewable repeated repetitive reserved resident resilient resistant responsible restless restricted respective retired reversible revolutionary rich ridiculous rigid ripe risky ritual robust rocky romantic rosy rotating rough round royal rubber rude rugged rural sacred sad safe salty sandy satisfied scarce scary scattered scenic scholarly scientific scorching scratchy screeching seasonal secluded secure selective selfish sensible sensitive separate serious settled several severe sexual shaky shallow shameful shaped shapely sharp sheer shiny shocking short showy shredded shy sideways significant silent silky silly similar simple sincere single skillful skinny sleepy slight slim slippery slow sly small smart smooth smoky sneaky snowy snug social soft solar solemn solid solitary soothing sophisticated sore sorry sound sour southern spacious spare sparkling sparse special specific spectacular speedy spherical spicy spiritual splendid spontaneous spotless sprawling square squeaking stable stainless standard standing stark starry startled steady sticky still stimulating stinging stirring stocky stoic stormy stout straight straightforward strange strategic striped strong structural stubborn studious stunning sturdy stylish subdued subject subsequent substantial subtle successful successive sudden sufficient suitable sullen summery sunny superior supportive supreme sure surprised surprising sustainable sweat sweet swift swim symbiotic symbolic symmetrical sympathetic synthetic systematic tactical talented tame tan tangible tangled targeted tasteful taut technical tedious teenage temperate temporary tempting tender tense tentative terminal terrible terrific terrified territorial testy thankful thematic theoretical thick thin thoughtful threatening thundering tidy tight timed timely tinted tiny tiresome tolerant topical towering toxic traditional tragic tranquil transparent trapped traumatic tremendous triangular tribal tropical troubled true trusted trustworthy truthful tubular tucked turbulent ugly ultimate unable unaware unbiased uncertain uncomfortable uncommon unconscious underground uneven unexpected unfair unfortunate unhappy unhealthy uniform unique united unlikely unlimited unnatural unnecessary unpleasant unpredictable unreasonable unstable unsteady unusual unwelcome upright upset urgent used useful useless usual utter vacant vague valid valuable vanishing variable vast velvety verbal versatile vertical vibrant victorious vigilant vigorous violent virtual virtuous visible vital vivid vocal volcanic voluntary vulnerable wandering warm warmhearted wary wasteful watchful watery wealthy weary weathered weekly weighty weird welcome well western whatever whimsical whispering wholesome wicked wide widespread wild willing winding winning wintery wiry wise wistful withdrawn witty wonderful wooden woolly wordy worldly worried worrying worse worthwhile worthy wound wrapped wrecked wrinkled written wrong yearly yielding youthful zealous zesty zigzag".split(" "),
    advs: "absolutely accidentally actually almost always annually apparently approximately badly barely bitterly boldly bravely briefly brightly briskly broadly calmly carefully carelessly casually certainly clearly cleverly closely completely constantly continually correctly curiously daily dearly deeply definitely deliberately delicately densely desperately directly dramatically eagerly early easily effectively efficiently elegantly enormously entirely equally especially essentially eventually exactly exceedingly exceptionally excessively extremely fairly faithfully famously fiercely finally firmly first fluently fondly foolishly forcibly forever formerly fortunately frankly freely frequently freshly fully furiously generally generously gently gladly gracefully gradually greatly happily hardly hastily heartily heavily helpfully highly honestly hopefully hopelessly horribly hourly hugely humbly hungrily ideally immediately impatiently importantly impossibly impressively increasingly incredibly independently indirectly infinitely initially innocently instantly intensely interestingly inwardly irregularly jointly joyfully kindly knowingly largely lately lightly likely literally locally logically loosely loudly lovingly luckily mainly manually maybe mentally merely mildly monthly morally mostly mutually mysteriously namely naturally nearly neatly necessarily nervously nicely nominally normally notably obviously occasionally oddly officially often only openly optionally orally originally otherwise outwardly painfully partially particularly partly passionately peacefully perfectly periodically personally physically plainly pleasantly please pleasingly poorly positively possibly potentially powerfully practically precisely preferably promptly properly proudly publicly purely quickly quietly randomly rapidly rarely rationally readily really reasonably recently recklessly regularly relatively reluctantly remarkably repeatedly reportedly respectfully responsibly richly rightfully rigidly roughly routinely sadly safely scarcely scientifically secretly securely seemingly seldom selfishly sensibly separately seriously severely sharply shortly significantly silently similarly simply sincerely skillfully sleepily slightly slowly smoothly socially softly solely solemnly solidly somehow sometimes somewhat soon specially specifically spectacularly speedily spiritually splendidly spontaneously steadily stealthily sternly stiffly still strangely strenuously strictly strikingly strongly structurally stubbornly studiously stunningly substantially successfully suddenly sufficiently suitably supposedly supremely surely surprisingly suspiciously sweetly swiftly symbolically sympathetically systematically tactfully technically tediously temporarily tenderly terribly thankfully thoroughly thoughtfully tightly together tomorrow totally truly trustfully truthfully typically ultimately unbearably uncomfortably unconditionally unconsciously unexpectedly unfortunately unpleasantly unquestionably unusually urgently usually utterly vaguely vastly verbally vertically very viciously victoriously vigorously violently virtually visibly visually voluntarily warmly weakly wearily weekly weightily weirdly wholly widely willingly wisely wonderfully woodenly worryingly worthily yearly zealously".split(" "),
    preps: [],
    dets: [],
    symbols: [],
  },
  intermediate: { nouns: [], verbs: [], adjs: [], advs: [], preps: [], dets: [], symbols: [] },
  advanced: { nouns: [], verbs: [], adjs: [], advs: [], preps: [], dets: [], symbols: [] },
  expert: { nouns: [], verbs: [], adjs: [], advs: [], preps: [], dets: [], symbols: [] },
  master: { nouns: [], verbs: [], adjs: [], advs: [], preps: [], dets: [], symbols: [] },
};

// Fill higher difficulties from easy vocabulary
for (const diff of ["intermediate", "advanced", "expert", "master"] as Difficulty[]) {
  DIFFICULTY_VOCAB[diff] = { ...DIFFICULTY_VOCAB.easy };
}

// ============================================================
// World Lexicons (themed vocabulary for adventure worlds)
// ============================================================
type WorldLexicon = {
  nouns: string[];
  adjs: string[];
  verbs: string[];
  preps: string[];
  seeds: string[];
};

const LEXICONS: Record<string, WorldLexicon> = {
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

// ============================================================
// Sentence Templates by Difficulty
// ============================================================
const TEMPLATES: Record<Difficulty, string[]> = {
  beginner: [
    "The {adj} {noun} {verb}.",
    "A {adj} {noun} {verb} {adv}.",
    "{DET} {noun} {verb} the {noun}.",
    "The {noun} {verb} {prep} the {noun}.",
    "{DET} {adj} {noun} {verb} {adv}.",
    "The {noun} and the {noun} {verb}.",
    "{DET} {noun} {verb} {prep} {det} {noun}.",
    "Look at the {adj} {noun}.",
    "The {noun} is {adj}.",
    "{DET} {noun} {verb} {noun}.",
  ],
  easy: [
    "The {adj} {noun} {verb} {adv} {prep} the {noun}.",
    "{DET} {adj} {noun} {verb} {prep} {det} {adj} {noun}.",
    "Every {noun} {verb} {adv} every {noun}.",
    "The {adj} {noun} {verb} {prep} the {adj} {noun}.",
    "{DET} {noun} {adv} {verb} the {adj} {noun}.",
    "When the {noun} {verb} the {adj} {noun} {verb} {adv}.",
    "The {adj} {noun} {verb} the {adj} {noun} {prep} the {noun}.",
    "On a {adj} day the {noun} {verb} {prep} the {noun}.",
    "{DET} {adj} {noun} {verb} {prep} {det} {noun} {prep} the {noun}.",
    "The {noun} {adv} {verb} {prep} the {adj} {noun}.",
    "Many {adj} {noun}s {vrb} {prep} the {noun} every day.",
    "The {noun} {verb} {prep} the {noun} {prep} the {noun}.",
    "In {det} {adj} {noun} the {adj} {noun} {adv} {verb}.",
    "The {adj} {noun} {verb} the {noun} {prep} {det} {adj} place.",
    "{DET} {noun} {verb} {prep} the {noun} and {verb} {prep} the {noun}.",
  ],
  intermediate: [
    "The {adj} {noun} {adv} {verb} {prep} the {adj} {noun} {prep} the {noun}.",
    "When {det} {adj} {noun} {adv} {verb} the {adj} {noun} {verb} {adv}.",
    "Although the {noun} {verb} {adv} the {adj} {noun} still {verb}.",
    "{DET} {adj} {noun} {verb} {adv} {prep} {det} {noun} {prep} the {noun}.",
    "The {adj} {noun} that {verb} {adv} often {verb} the {adj} {noun}.",
    "In the {adj} {noun} the {adj} {noun} {adv} {verb} {prep} the {noun}.",
    "Every {adj} {noun} {verb} {prep} the {noun} {prep} {det} {adj} reason.",
    "The {noun} {verb} {prep} the {adj} {noun} {prep} {det} {adj} {noun}.",
    "After the {noun} {verb} the {adj} {noun} {verb} the {noun}.",
    "{DET} {adj} {noun} {adv} {verb} {prep} the {adj} {noun} every time.",
  ],
  advanced: [
    "The {adj} {noun} {adv} {verb} {prep} the {adj} {noun} creating a {adj} effect.",
    "When the {adj} {noun} {verb} {prep} the {noun} the {adj} {noun} {verb} {adv}.",
    "In the heart of {det} {adj} {noun} the {adj} {noun} {adv} {verb} the {noun}.",
    "Despite the {adj} {noun} the {adj} {noun} continues to {vrb} {adv}.",
    "The {adj} {noun} {verb} {adv} while the {adj} {noun} {verb} {prep} the {noun}.",
    "{DET} {adj} {noun} {adv} {verb} the {adj} {noun} {prep} the {adj} {noun}.",
    "Through {det} {adj} {noun} the {adj} {noun} {verb} {adv} {prep} the {noun}.",
    "Beyond the {adj} {noun} the {adj} {noun} {verb} {prep} a {adj} {noun}.",
    "Within {det} {adj} {noun} the {adj} {noun} {verb} the {adj} {noun}.",
    "Before the {noun} {verb} the {adj} {noun} must {vrb} {prep} the {noun}.",
  ],
  expert: [
    "The {adj} {noun} {adv} {verb} {prep} the {adj} {noun} revealing a {adj} pattern of {noun}.",
    "As the {adj} {noun} {verb} {adv} the {adj} {noun} begins to {vrb} {adv}.",
    "Neither the {adj} {noun} nor the {adj} {noun} {verb} {adv} {prep} the {noun}.",
    "The {adj} {noun} that {adv} {verb} the {adj} {noun} {verb} {prep} the {noun}.",
    "With {det} {adj} {noun} the {adj} {noun} {adv} {verb} through the {adj} {noun}.",
    "What the {adj} {noun} {verb} {adv} affects the {adj} {noun} {prep} the {noun}.",
    "Whenever the {adj} {noun} {verb} the {adj} {noun} {adv} {verb} in response.",
    "The {adj} {noun} {verb} {adv} regardless of the {adj} {noun} {prep} the {noun}.",
    "Not only does the {noun} {vrb} but the {adj} {noun} also {verb} {adv}.",
    "The relationship between the {adj} {noun} and the {adj} {noun} {verb} {adv} over time.",
  ],
  master: [
    "The {adj} {noun} {adv} {verb} {prep} the {adj} {noun} {prep} a {adj} display of {noun}.",
    "While the {adj} {noun} {verb} {adv} the {adj} {noun} {verb} {adv} {prep} the {noun}.",
    "Through {det} {adj} {noun} and {det} {adj} {noun} the {adj} {noun} {verb} {adv}.",
    "The {adj} {noun} that {adv} {verb} the {adj} {noun} {verb} {adv} {prep} a reason.",
    "Whether the {adj} {noun} {verb} or the {adj} {noun} {verb} the result {verb} {adv}.",
    "The more the {adj} {noun} {verb} the {adv} the {adj} {noun} {verb}.",
    "In {det} world of {adj} {noun} the {adj} {noun} {verb} {adv} {prep} the {noun}.",
    "The {adj} {noun} which {verb} the {adj} {noun} {adv} {verb} {prep} the {noun}.",
    "The {adj} {noun} {verb} {adv} while the {adj} {noun} continues to {vrb}.",
    "After the {noun} {verb} the {adj} {noun} begins to {vrb} {adv}.",
  ],
};

// ============================================================
// Fact database (educational content)
// ============================================================
const FACTS: string[] = [
  "The moon takes about twenty seven days to orbit the Earth.",
  "Healthy habits become easier when practiced consistently.",
  "The giant sequoia is one of the largest trees in the world.",
  "Honey never spoils and can last for thousands of years.",
  "Octopuses have three hearts and blue blood.",
  "The Great Wall of China is over thirteen thousand miles long.",
  "Bananas are berries but strawberries are not.",
  "Light travels at about one hundred eighty six thousand miles per second.",
  "A day on Venus is longer than a year on Venus.",
  "Butterflies can taste with their feet.",
  "The Amazon rainforest produces about twenty percent of the world oxygen.",
  "Elephants are the only mammals that cannot jump.",
  "The human brain contains about eighty six billion neurons.",
  "Jupiter has at least ninety five known moons.",
  "Cows have best friends and get stressed when separated.",
  "Hot water freezes faster than cold water under certain conditions.",
  "A group of flamingos is called a flamboyance.",
  "The shortest war in history lasted only thirty eight minutes.",
  "Trees can communicate and share resources through underground networks.",
  "The first computer mouse was made of wood.",
  "Sharks have been around longer than trees.",
  "A single cloud can weigh over a million pounds.",
  "The Eiffel Tower grows taller in summer due to metal expansion.",
  "Octopuses can change both their color and the texture of their skin.",
  "The human nose can remember over fifty thousand different scents.",
  "Lightning strikes the Earth about one hundred times every second.",
  "The largest snowflake ever recorded was fifteen inches wide.",
  "Polar bears have black skin under their white fur.",
  "Dolphins give each other names using unique whistles.",
  "The shortest commercial flight takes only about two minutes.",
  "Cats have thirty two muscles in each ear.",
  "Most dust in your home comes from dead skin cells.",
  "The longest hiccuping spree lasted over sixty eight years.",
  "A group of porcupines is called a prickle.",
  "The sun produces enough energy in one second to power Earth for years.",
  "Wombat droppings are cube shaped to prevent them from rolling away.",
  "The first known passenger pigeon lived to be over one hundred years old.",
  "Your taste buds are replaced every ten to fourteen days.",
  "Sloths can hold their breath longer than dolphins.",
  "A bolt of lightning is five times hotter than the surface of the sun.",
  "There are more stars in space than grains of sand on Earth.",
  "The longest mountain range is actually under the ocean.",
  "Your stomach gets a new lining every three to four days.",
  "A jiffy is an actual unit of time meaning one hundredth of a second.",
  "Koalas have fingerprints almost identical to human fingerprints.",
  "The first vending machine dispensed holy water in ancient Egypt.",
  "About ninety percent of the world population lives in the Northern Hemisphere.",
  "A hummingbird weighs less than a penny.",
  "The strongest muscle in the human body is the masseter or jaw muscle.",
  "Bamboo can grow over three feet in a single day.",
];

function pickFact(): string {
  return FACTS[Math.floor(Math.random() * FACTS.length)];
}

// ============================================================
// Template Filler
// ============================================================
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function conjugate(verb: string): string {
  if (verb.endsWith("s") || verb.endsWith("x") || verb.endsWith("ch") || verb.endsWith("sh")) return verb + "es";
  if (verb.endsWith("y") && !/[aeiou]y/.test(verb)) return verb.slice(0, -1) + "ies";
  return verb + "s";
}

function pluralize(word: string): string {
  if (word.endsWith("s") || word.endsWith("x") || word.endsWith("ch") || word.endsWith("sh")) return word + "es";
  if (word.endsWith("y") && !/[aeiou]y/.test(word)) return word.slice(0, -1) + "ies";
  return word + "s";
}

function fillTemplate(tpl: string, bank: WordBank): string {
  let result = tpl
    .replace(/\{noun\}s/g, () => { const w = pick(pickFresh(bank.nouns, 30)); trackUsed([w]); return pluralize(w); })
    .replace(/\{noun\}/g, () => { const w = pick(pickFresh(bank.nouns, 30)); trackUsed([w]); return w; })
    .replace(/\{adj\}/g, () => { const w = pick(pickFresh(bank.adjs, 20)); trackUsed([w]); return w; })
    .replace(/\{adv\}/g, () => pick(bank.advs))
    .replace(/\{vrb\}/g, () => { const w = pick(pickFresh(bank.verbs, 25)); trackUsed([w]); return w; })
    .replace(/\{verb\}/g, () => { const w = pick(pickFresh(bank.verbs, 25)); trackUsed([w]); return conjugate(w); })
    .replace(/\{prep\}/g, () => pick(bank.preps));

  // Handle determiner variants
  result = result.replace(/\{det\}/g, () => pick(bank.dets));
  result = result.replace(/\{DET\}/g, () => {
    const d = pick(bank.dets);
    return d.charAt(0).toUpperCase() + d.slice(1);
  });

  // First letter uppercase
  result = result.charAt(0).toUpperCase() + result.slice(1);

  // Ensure it ends with a period
  if (!/[.!?]$/.test(result)) result += ".";

  return result;
}

// ============================================================
// Zone & Lesson Filtering
// ============================================================
const FOCUS_WORDS: Record<Zone, string[]> = {
  home: ["as", "ad", "add", "all", "dad", "fall", "flash", "gas", "glass", "half", "hall", "has", "ask", "lad", "lag", "sad", "saga", "salad", "shall", "flag", "glad", "class", "shade", "shake", "shade", "shall", "slash", "skate", "glass", "glad", "shade", "shake", "flake", "flash", "shade", "jade", "lake", "gate", "half", "hand", "hash", "hike", "kale", "lade", "lads", "lake", "fake", "fade", "jade", "lead", "leaf", "leak", "seal", "deal", "heal", "keel", "keel", "lash", "gash", "cash", "hash", "lash", "jazz", "haze", "gaze", "laze", "hale", "gale", "kale", "sale", "dale", "fade", "jade", "made", "lade", "wade", "lady", "glad", "shag", "slag", "flak", "slab", "flag", "flak"],
  top: ["quite", "write", "type", "power", "upper", "lower", "report", "tower", "pilot", "prior", "quiet", "quote", "queen", "query", "prayer", "purity", "puzzle", "triple", "purple", "turtle", "turret", "output", "uptown", "outwit", "outfit", "outlet", "puzzle", "puppet", "uppity", "pretty", "petty", "pottery", "potter", "poultry", "poetry", "porter", "torture", "torture", "torture", "torture", "torture", "torture", "torture", "torture"],
  bottom: ["very", "come", "make", "move", "give", "zone", "next", "buzz", "cave", "dove", "fave", "gave", "have", "love", "move", "nice", "once", "vote", "wave", "zinc", "zone", "zoom", "cove", "comb", "come", "cone", "cope", "core", "cove", "cure", "cute", "cove", "dove", "face", "fake", "fame", "faze", "fuse", "gave", "gaze", "glove", "govern", "grace", "grave", "graze", "grove", "guess", "guide", "guise", "gull", "gum", "gush", "gust", "guts", "have", "hive", "home", "hope", "huge", "hype", "jive", "joke", "juice", "jump", "june", "knee", "knife", "knock", "know", "lace", "lame", "lance", "lapse", "large", "lave", "laze", "leave", "ledge", "lodge", "loom", "loose", "love", "lunge", "lurch", "lurve"],
  numbers: ["first", "second", "third", "fourth", "fifth", "sixth", "seven", "eighth", "ninth", "tenth", "eleven", "twelve", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety", "hundred", "thousand", "million", "dozen", "pair", "triple", "single", "double", "quarter", "half", "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"],
  symbols: ["dot", "dash", "slash", "plus", "minus", "times", "divide", "equal", "hash", "star", "at", "ampersand", "percent", "dollar", "cent", "quote", "paren", "bracket", "brace", "colon", "semicolon", "comma", "period", "exclaim", "question", "underscore", "tilde", "caret", "asterisk"],
};

// ============================================================
// Main Public Exports (preserving original signatures)
// ============================================================

/**
 * Generate a passage of adventure-themed words for a specific world.
 * Preserves original signature but uses improved sentence approach.
 */
export async function generateAdventureWords(
  stageName: string,
  worldId: WorldId,
  seedWords: string[],
  count = 36,
): Promise<string[] | null> {
  const lexicon = LEXICONS[worldId];
  if (!lexicon) return null;

  const bank: WordBank = {
    ...DIFFICULTY_VOCAB.easy,
    nouns: [...DIFFICULTY_VOCAB.easy.nouns, ...lexicon.nouns, ...seedWords],
    verbs: [...DIFFICULTY_VOCAB.easy.verbs, ...lexicon.verbs],
    adjs: [...DIFFICULTY_VOCAB.easy.adjs, ...lexicon.adjs],
  };

  const sentences: string[] = [];
  const sentenceCount = Math.ceil(count / 7);
  for (let i = 0; i < sentenceCount; i++) {
    const tpl = pick(TEMPLATES.easy);
    const sentence = fillTemplate(tpl, bank);
    sentences.push(sentence);
  }

  const allWords = sentences.join(" ").split(/\s+/).filter(Boolean);
  return allWords.slice(0, count);
}

/**
 * Generate a world-themed text passage.
 * Preserves original signature but now produces complete sentences.
 */
export async function generateWorldText(worldId: WorldId): Promise<string | null> {
  const lexicon = LEXICONS[worldId];
  if (!lexicon) return null;

  const bank: WordBank = {
    ...DIFFICULTY_VOCAB.easy,
    nouns: [...DIFFICULTY_VOCAB.easy.nouns, ...lexicon.nouns],
    verbs: [...DIFFICULTY_VOCAB.easy.verbs, ...lexicon.verbs],
    adjs: [...DIFFICULTY_VOCAB.easy.adjs, ...lexicon.adjs],
  };

  const sentences: string[] = [];
  for (let i = 0; i < 3; i++) {
    const tpl = pick(TEMPLATES.easy);
    const sentence = fillTemplate(tpl, bank);
    sentences.push(sentence);
  }
  return sentences.join(" ");
}

/**
 * Generate a quest-themed sentence.
 * Preserves original signature.
 */
export async function generateQuestText(stageName: string, worldId: WorldId): Promise<string | null> {
  const lexicon = LEXICONS[worldId];
  if (!lexicon) return null;

  const bank: WordBank = {
    ...DIFFICULTY_VOCAB.easy,
    nouns: [...DIFFICULTY_VOCAB.easy.nouns, ...lexicon.nouns],
    verbs: [...DIFFICULTY_VOCAB.easy.verbs, ...lexicon.verbs],
    adjs: [...DIFFICULTY_VOCAB.easy.adjs, ...lexicon.adjs],
  };

  const tpl = pick(TEMPLATES.easy);
  const sentence = fillTemplate(tpl, bank);
  return `${stageName}: ${sentence}`;
}

/**
 * Generate text appropriate for a specific lesson difficulty and keyboard focus.
 * New function — used by the lesson system.
 */
export async function generateLessonText(
  difficulty: Difficulty,
  targetZones: Zone[],
  count = 30,
): Promise<string> {
  const bank = DIFFICULTY_VOCAB[difficulty];

  // Filter vocabulary to prefer target zone words
  const zoneFiltered = (words: string[]) => {
    if (targetZones.length === 0) return pickFresh(words, Math.min(count, words.length));
    const matched = words.filter((w) => targetZones.some((z) => wordZones(w).has(z)));
    const pool = matched.length >= 10 ? matched : words;
    return pickFresh(pool, Math.min(count, pool.length));
  };

  const useBank: WordBank = {
    ...bank,
    nouns: zoneFiltered(bank.nouns),
    verbs: zoneFiltered(bank.verbs),
    adjs: zoneFiltered(bank.adjs),
  };

  const sentenceCount = Math.max(1, Math.ceil(count / 7));
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    const templates = TEMPLATES[difficulty];
    const tpl = pick(templates);
    const sentence = fillTemplate(tpl, useBank);
    sentences.push(sentence);
  }

  // Mix in an educational fact occasionally
  if (Math.random() < 0.3) {
    sentences.push(pickFact());
  }

  return sentences.join(" ");
}

/**
 * Generate sentences that target specific weak characters.
 */
export async function generateWeakSpotSentences(weakChars: string[]): Promise<string[]> {
  if (weakChars.length === 0) return [];

  const bank = DIFFICULTY_VOCAB.easy;
  const charSet = new Set(weakChars.map((c) => c.toLowerCase()));

  const matching = (words: string[]) => words.filter((w) => [...w].some((c) => charSet.has(c)));
  const useBank: WordBank = {
    ...bank,
    nouns: matching(bank.nouns).length >= 5 ? matching(bank.nouns) : bank.nouns,
    verbs: matching(bank.verbs).length >= 5 ? matching(bank.verbs) : bank.verbs,
    adjs: matching(bank.adjs).length >= 5 ? matching(bank.adjs) : bank.adjs,
  };

  const sentences: string[] = [];
  for (let i = 0; i < 4; i++) {
    const tpl = pick(TEMPLATES.easy);
    sentences.push(fillTemplate(tpl, useBank));
  }
  return sentences;
}

// ============================================================
// Re-export WordLexicon type for compatibility
// ============================================================
export type { WorldLexicon };
