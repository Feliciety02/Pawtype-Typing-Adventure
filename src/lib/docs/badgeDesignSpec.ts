export const BADGE_DESIGN_SPEC = `# 🏅 Badge Design Specification (BDS)

## Overview

The badge system is a core progression mechanic of the typing adventure game. Badges serve as collectible achievements that reward players for improving their typing skills, exploring the game world, collecting pets, maintaining practice streaks, and completing special challenges.

Unlike traditional achievement icons, every badge is designed as a collectible fantasy relic featuring a personalized crest that reflects its category and prestige. As players progress, badges become increasingly ornate, symbolizing their growth from novice typists into legendary masters.

---

## Design Principles

Every badge must follow these principles:

- Instantly recognizable at small sizes.
- Simple silhouette with increasing detail as rarity increases.
- Front-facing, centered, and symmetrical.
- Pixel-perfect construction.
- Transparent background.
- Consistent outline thickness and lighting.
- Unique personalized crest matching the badge category.
- Designed as collectible RPG inventory items rather than flat UI icons.

---

## Badge Rarity

| Tier | Rarity    | Purpose                  | Visual Theme                    |
| ---- | --------- | ------------------------ | ------------------------------- |
| I    | Common    | Beginner milestones      | Wood, leaves, rope              |
| II   | Uncommon  | Early progression        | Bronze, vines, clover           |
| III  | Rare      | Skilled achievements     | Silver, crystals, stars         |
| IV   | Epic      | Advanced accomplishments | Royal ornaments, runes          |
| V    | Legendary | Elite milestones         | Gold, crowns, dragons           |
| VI   | Mythic    | Exceptional mastery      | Sacred fire, phoenix motifs     |
| VII  | Celestial | Near-perfect completion  | Galaxies, constellations, moons |
| VIII | Divine    | Ultimate achievements    | Halos, infinity, sacred relics  |

---

## Badge Categories

### ⚡ Speed Badges

**Purpose:** Reward improvements in typing speed (WPM). Represents acceleration, agility, momentum, and mastery over keyboard movement.

**Crest Theme:** Feathers, wings, wind currents, lightning, storms, meteors, celestial speed.

**Progression:**
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

---

### 🎯 Accuracy Badges

**Purpose:** Reward precise and mistake-free typing. Represents focus, concentration, discipline, and consistency.

**Crest Theme:** Targets, eyes, scopes, feathers, crystal optics, sacred symbols.

**Progression:** Wooden Target → Bullseye → Eagle Eye → Crystal Scope → Perfect Sight → Diamond Crosshair → Sacred Aim → Celestial Vision → Divine Precision → Absolute Accuracy

**Unlock Source:** Typing accuracy milestones.

---

### 🔥 Combo Badges

**Purpose:** Reward consecutive correct keystrokes. Represents maintaining rhythm without mistakes.

**Crest Theme:** Embers, flames, volcanoes, phoenixes, celestial fire.

**Progression:** Spark → Ember → Flame → Fireball → Inferno → Phoenix Feather → Eternal Flame → Solar Core → Supernova → Eternal Inferno

**Unlock Source:** Combo streak milestones.

---

### 🐾 Pet Collection Badges

**Purpose:** Reward collecting, raising, and evolving companions. Represents friendship, loyalty, and dedication to pets.

**Crest Theme:** Paws, collars, ribbons, hearts, claws, animal wings.

**Progression:** Tiny Paw → Golden Paw → Bone Emblem → Companion Ribbon → Pet Heart → Beast Crest → Alpha Collar → Guardian Paw → Spirit Companion → Legendary Tamer

**Unlock Source:** Pet collection milestones.

---

### 🌍 Adventure Badges

**Purpose:** Reward exploration and completion of worlds. Represents discovery and adventure.

**Crest Theme:** Each crest reflects its biome.

Examples:
- Forest → Oak
- Café → Coffee beans
- Ocean → Shells
- Volcano → Magma
- Mushroom → Mushrooms
- Sakura → Cherry blossoms
- Castle → Stone fortress
- Moon → Crescent moon
- Galaxy → Constellations
- World Crown → World Tree

**Unlock Source:** World completion.

---

### 📚 Learning Badges

**Purpose:** Reward educational progress. Represents wisdom and personal growth.

**Crest Theme:** Books, scrolls, magical libraries, crystals, quills.

**Unlock Source:** Lessons completed.

---

### 📅 Daily Streak Badges

**Purpose:** Reward consistent practice. Represents dedication over time.

**Crest Theme:** Sunrise, trees, calendars, clocks, hourglasses, stars.

**Unlock Source:** Daily login and typing streaks.

---

### 🏆 Challenge Badges

**Purpose:** Reward difficult accomplishments and special objectives. Represents courage, perseverance, and mastery.

**Crest Theme:** Shields, swords, banners, crowns, dragon motifs, championship relics.

**Unlock Source:** Special challenge completion.

---

## Naming Convention

Every badge should have:

- Display Name
- Category
- Tier
- Rarity
- Description
- Unlock Requirement
- Icon Asset Name

Example:

**Display Name:** Tiny Feather
**Category:** Speed
**Tier:** 1
**Rarity:** Common
**Description:** Awarded to players who begin their journey toward becoming faster typists.
**Unlock Requirement:** Reach the first typing speed milestone.
**Icon Asset:** \`badge_speed_tiny_feather.png\`

---

## Asset Naming Convention

Use lowercase snake_case for all badge assets.

Examples:
- \`badge_speed_tiny_feather.png\`
- \`badge_speed_hyper_velocity.png\`
- \`badge_accuracy_bullseye.png\`
- \`badge_combo_inferno.png\`
- \`badge_pet_guardian_paw.png\`
- \`badge_world_castle_crest.png\`
- \`badge_learning_magic_tome.png\`
- \`badge_streak_endless_journey.png\`
- \`badge_challenge_ultimate_hero.png\`

This convention ensures consistency throughout the codebase and simplifies asset loading and maintenance.

---

## Developer Notes

- Badges should be treated as collectible game assets, not UI decorations.
- Every badge belongs to exactly one category and one rarity tier.
- All badge metadata (name, description, rarity, unlock condition, category, and asset filename) should be stored in a centralized configuration file or database rather than hardcoded throughout the project.
- Progression within each category should be visually and mechanically meaningful, with later badges clearly conveying greater prestige while preserving the same thematic identity.
- Future badge categories should follow this same specification to maintain a cohesive collectible system across the entire game.`;
