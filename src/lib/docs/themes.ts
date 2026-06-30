export const THEMES_DOC = `# Dreaming Worlds — Theme Documentation

Every world is a complete visual theme with its own color palette, ambient particle effects, HUD styling, and background artwork.

---

## Worlds

### ☕ Cozy Café
*Warm terracotta & cream.*
- **Ambient:** Warm glow shimmer
- **HUD decoration:** ☕
- **Swatches:** #e8b48a · #c25a3a · #f5ead6 · #3a2a22

### 🌲 Mossy Forest
*Ferns, dew, and dappled light.*
- **Ambient:** Floating fireflies
- **HUD decoration:** ✿
- **Swatches:** #a8d8a0 · #3f7d4a · #eef6e4 · #1f2e1f

### 🌊 Tide Pool
*Salt breeze and seafoam.*
- **Ambient:** Rising bubbles
- **HUD decoration:** ○
- **Swatches:** #9bd5e8 · #2f6f9c · #e6f3f8 · #142838

### 🌸 Sakura Park
*Petals drift in the wind.*
- **Ambient:** Falling petals
- **HUD decoration:** ✿
- **Swatches:** #f5b6c8 · #c75f86 · #fbeaf0 · #3a1f2a

### 🏰 Royal Castle
*Velvet drapes & gold trim.*
- **Ambient:** Candle flicker
- **HUD decoration:** ◆
- **Swatches:** #c8a8e8 · #6e4caa · #f1eafa · #241638

### 🌌 Stardust
*Neon comets in deep night.*
- **Ambient:** Twinkling stars
- **HUD decoration:** ✦
- **Swatches:** #7ee0d6 · #a06bff · #1b1538 · #0a0820

### 🍂 Autumn Cottage
*Crisp air & golden leaves.*
- **Ambient:** Falling leaves
- **HUD decoration:** 🍂
- **Swatches:** #e8b060 · #c25a2a · #fbe8c8 · #3a2218
- **Shop:** 150🪙

### 🍄 Fairy Mushroom Village
*Glowing spores & twisted roots.*
- **Ambient:** Glowing spores
- **HUD decoration:** 🍄
- **Swatches:** #d4a0e8 · #7a3a9a · #f2e0f8 · #2a1838
- **Shop:** 150🪙

### 🌙 Moonlit Garden
*Silver beams & jasmine scent.*
- **Ambient:** Floating fireflies
- **HUD decoration:** 🌙
- **Swatches:** #a0b8e8 · #3a5a8a · #e0eaf8 · #182038
- **Shop:** 150🪙

### 🌧️ Rainy Library
*Steamy windows & old paper.*
- **Ambient:** Drifting steam
- **HUD decoration:** 🌧️
- **Swatches:** #b0a8a0 · #5a524a · #e8e4e0 · #2a2622
- **Shop:** 150🪙

### ❄️ Snowy Cabin
*Frosted glass & crackling fire.*
- **Ambient:** Falling snow
- **HUD decoration:** ❄️
- **Swatches:** #c8dce8 · #6090a8 · #e8f0f4 · #1a2830
- **Shop:** 150🪙

### 🌻 Sunflower Meadow
*Golden fields & buzzing bees.*
- **Ambient:** Floating pollen
- **HUD decoration:** 🌻
- **Swatches:** #f0d060 · #c08a20 · #fcf0c0 · #382818
- **Shop:** 150🪙

---

## How It Works

1. Each world sets CSS custom properties on \`<html>\` via the \`world-{id}\` class
2. Light and dark modes each have separate palette overrides; the app uses the saved manual choice and does not auto-follow system theme
3. The \`.game-hud\` block styles the top navigation bar
4. \`.ambient-glow\` or \`.ambient-particle\` creates atmospheric effects
5. Background images are loaded from \`/theme/{slug}.png\`
6. World selection persists in \`localStorage\`
7. Adventure node cards load image sets from \`/node-level\` when available; locked nodes use \`/Icons/lock.png\`
8. Settings shows only unlocked worlds in the inline World Wardrobe grid
`;
