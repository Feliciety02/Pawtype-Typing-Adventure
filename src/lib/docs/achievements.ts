export const ACHIEVEMENTS_DOC = `# 🏆 Achievements & Badges

Hundreds of collectible badges across **12 prestige tiers** and **8 thematic categories**. Every badge is a milestone, a skill mastered, or a secret discovered.

Designed as collectible fantasy relics — every badge is a pixel-perfect crest reflecting its category and prestige, from humble wooden trinkets to divine celestial artifacts.

---

## Design Principles

Badges are:
- **Instantly recognizable** at small sizes
- **Front-facing, centered, and symmetrical** — pixel-perfect construction
- **Transparent background** with consistent outline thickness
- **Unique personalized crest** matching the badge category
- **Collectible RPG inventory items**, not flat UI icons

The Awards tab presents the badge collection as a full-page fantasy museum that swaps between \`public/awards/awards-background-morning.png\` and \`public/awards/awards-background-night.png\` with the global day/night toggle. The scene mood follows that choice too: morning uses warmer sunlit haze and golden reflections, while night shifts to cooler moonlit glow and blue-tinted ambience across the page. It shows one wing at a time, uses the provided wing banner art from \`public/awards/banner/\`, and places exactly 10 awards on \`public/awards/shelf.png\` as handcrafted museum exhibits: tiers 6-10 on the upper shelf and tiers 1-5 on the lower shelf. Shelf placement is driven by a normalized upper/lower anchor grid, so each badge, platform, spotlight, tooltip, and hover lift originates from the same bottom-center shelf coordinate. The active wing banner shows the collected count and progress pips directly on the banner art, enlarged and offset into the open text space for readability.

---

## Badge Rarity

| Tier | Rarity    | Visual Theme                    |
| ---- | --------- | ------------------------------- |
| I    | Common    | Wood, leaves, rope              |
| II   | Uncommon  | Bronze, vines, clover           |
| III  | Rare      | Silver, crystals, stars         |
| IV   | Epic      | Royal ornaments, runes          |
| V    | Legendary | Gold, crowns, dragons           |
| VI   | Mythic    | Sacred fire, phoenix motifs     |
| VII  | Celestial | Galaxies, constellations, moons |
| VIII | Divine    | Halos, infinity, sacred relics  |

---

## Tier Breakdown

### I — Common
*"Everyone starts somewhere."*

**Badges:** Wooden Crest, Tiny Paw, Acorn, Pebble, Beginner Scroll, Leaf, Twig Emblem, Small Feather, Seed, Moss Badge\
**Unlocks:** First lesson · First pet · First level

### II — Uncommon
*"Learning the basics."*

**Badges:** Forest Crest, Clover, Bronze Paw, Explorer Compass, Green Ribbon, Coffee Bean, Butterfly, Apprentice Seal, Sapling, Owl Feather\
**Unlocks:** 10 lessons · 30 WPM · 7-day streak

### III — Rare
*"A capable adventurer."*

**Badges:** Sapphire Crest, Crystal Leaf, Silver Paw, Moon Medal, Falcon Wing, Frost Crystal, Ocean Pearl, Blue Flame, Snowflake, Ancient Coin\
**Unlocks:** 50 WPM · 95% Accuracy · World completion

### IV — Epic
*"Known throughout the kingdom."*

**Badges:** Royal Crest, Diamond Paw, Phoenix Feather, Arcane Scroll, Magic Tome, Golden Target, Emerald Crown, Hero Shield, Royal Banner, Mystic Orb\
**Unlocks:** 75 WPM · 98% Accuracy · Perfect streaks

### V — Legendary
*"Only heroes possess these."*

**Badges:** Dragon Crest, King's Crown, Champion Medal, Sacred Crystal, Hero Sword, Guardian Shield, Ancient Crown, Lion Crest, Golden Phoenix, Eternal Torch\
**Unlocks:** 100 WPM · Hundreds of lessons · Major milestones

### VI — Mythic
*"Stories are told about these."*

**Badges:** Inferno Crystal, Mythic Crown, Eternal Flame, Sacred Tome, Crimson Dragon, Titan Emblem, Leviathan Crest, Celestial Sword, Mythic Relic, Rune Stone\
**Unlocks:** Secret achievements · Elite challenges · Perfect marathons

### VII — Celestial
*"Forged among the stars."*

**Badges:** Galaxy Crystal, Nova Crown, Moon Crest, Constellation Medal, Aurora Wing, Star Compass, Cosmic Flower, Astral Scroll, Nebula Orb, Meteor Crest\
**Unlocks:** Complete all worlds · Elite collections · Hidden bosses

### VIII — Divine
*"Blessed by the heavens."*

**Badges:** Divine Halo, Sacred Relic, Angel Feather, Rainbow Crystal, Heaven Crest, Seraph Medal, Holy Crown, Sacred Tree, Light Crystal, Blessed Scroll\
**Unlocks:** Nearly everything · Legendary collections

### IX — Transcendent
*"Beyond mortal achievement."*

**Badges:** Infinity Crest, Infinity Crystal, Time Compass, Space Medal, Eternal Tree, Quantum Feather, Cosmic Ring, Infinity Crown, Void Crystal, Endless Flame\
**Unlocks:** 99% game completion · Hidden collections · Ultimate challenges

### X — Eternal
*"Your legend never fades."*

**Badges:** Eternal Crown, Eternal Phoenix, Timeless Compass, World Seed, Infinity Star, Time Crystal, Eternal Heart, Ancient Relic, Chrono Medal, Legacy Crest\
**Unlocks:** Multi-year achievements · Veteran status · Lifetime milestones

### XI — Ascendant
*"You have surpassed legends."*

**Badges:** Ascension Crown, Sun Crystal, Sky Palace Crest, Golden Wings, World Guardian, Celestial Throne, Divine Dragon, Heaven Compass, Ascendant Orb, Solar Crest\
**Unlocks:** Every collection completed · Every pet maxed · Every world mastered

### XII — Omniversal
*"The ultimate achievement."*

**Badges:** Omniverse Crown, Creator's Seal, World Forge, Genesis Crystal, Universal Tree, Infinite Cosmos, Origin Flame, Alpha Crest, Omega Emblem, Eternal Universe\
**Unlocks:** Every badge · Every secret · Every collectible · 100% completion · Developer-level challenge

---

## Badge Categories

### ⚡ Speed Badges

Reward improvements in typing speed (WPM). Crest theme: feathers, wings, wind currents, lightning, storms, meteors.

| Badge          | Meaning                                             |
| -------------- | --------------------------------------------------- |
| Tiny Feather   | First signs of quick typing.                        |
| Swift Feather  | Developing speed and confidence.                    |
| Wing           | Freedom and smooth movement across the keyboard.    |
| Falcon Wing    | Precision combined with high speed.                 |
| Lightning Bolt | Explosive bursts of typing performance.             |
| Thunder Crest  | Mastery over speed through power and consistency.   |
| Shooting Star  | Exceptional speed that leaves a lasting impression. |
| Meteor         | Unstoppable momentum and force.                     |
| Comet          | Speed that transcends earthly limits.               |
| Hyper Velocity | The ultimate achievement in typing speed.           |

**Unlock Source:** Typing WPM milestones.

### 🎯 Accuracy Badges

Reward precise and mistake-free typing. Crest theme: targets, eyes, scopes, crystal optics, sacred symbols.

**Progression:** Wooden Target → Bullseye → Eagle Eye → Crystal Scope → Perfect Sight → Diamond Crosshair → Sacred Aim → Celestial Vision → Divine Precision → Absolute Accuracy

**Unlock Source:** Typing accuracy milestones.

### 🔥 Combo Badges

Reward consecutive correct keystrokes. Crest theme: embers, flames, volcanoes, phoenixes, celestial fire.

**Progression:** Spark → Ember → Flame → Fireball → Inferno → Phoenix Feather → Eternal Flame → Solar Core → Supernova → Eternal Inferno

**Unlock Source:** Combo streak milestones.

### 🐾 Pet Collection Badges

Reward collecting, raising, and evolving companions. Crest theme: paws, collars, ribbons, hearts, claws, animal wings.

**Progression:** Tiny Paw → Golden Paw → Bone Emblem → Companion Ribbon → Pet Heart → Beast Crest → Alpha Collar → Guardian Paw → Spirit Companion → Legendary Tamer

**Unlock Source:** Pet collection milestones.

### 🌍 Adventure Badges

Reward exploration and completion of worlds. Each crest reflects its biome.

| World   | Crest Theme      |
| ------- | ---------------- |
| Forest  | Oak              |
| Café    | Coffee beans     |
| Ocean   | Shells           |
| Volcano | Magma            |
| Mushroom| Mushrooms        |
| Sakura  | Cherry blossoms  |
| Castle  | Stone fortress   |
| Moon    | Crescent moon    |
| Galaxy  | Constellations   |
| World   | World Tree       |

**Unlock Source:** World completion.

### 📚 Learning Badges

Reward educational progress. Crest theme: books, scrolls, magical libraries, crystals, quills.

**Unlock Source:** Lessons completed.

### 📅 Daily Streak Badges

Reward consistent practice. Crest theme: sunrise, trees, calendars, clocks, hourglasses, stars.

**Unlock Source:** Daily login and typing streaks.

### 🏆 Challenge Badges

Reward difficult accomplishments and special objectives. Crest theme: shields, swords, banners, crowns, dragon motifs, championship relics.

**Unlock Source:** Special challenge completion.

---

## Asset Naming Convention

All badge assets use lowercase snake_case and are served from \`public/badges/<category>/<assetName>\`.

\`\`\`
badge_speed_tiny_feather.png
badge_speed_hyper_velocity.png
badge_accuracy_bullseye.png
badge_combo_inferno.png
badge_pet_guardian_paw.png
badge_world_castle_crest.png
badge_learning_magic_tome.png
badge_streak_endless_journey.png
badge_challenge_ultimate_hero.png
\`\`\``;
