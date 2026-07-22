export const PETS_DOC = `# Fuzzy Friends — Pet Documentation

Pixel companions that grow with you. Every player starts with Whiskers the Cat. Earn pet XP by typing, and watch companions evolve through four stages.

---

## Available Pets

| Pet | Emoji | Price | Personality |
|-----|-------|-------|-------------|
| Cat | 🐱 | Starter | Your first pixel companion |
| Dog | 🐶 | 400🪙 | A wagging pixel pup |
| Fox | 🦊 | 500🪙 | A clever pixel fox |
| Rabbit | 🐰 | 350🪙 | A fluffy pixel bunny |
| Panda | 🐼 | 600🪙 | A roly-poly pixel panda |
| Penguin | 🐧 | 450🪙 | A waddling pixel penguin |
| Baby Dragon | 🐉 | 800🪙 | A tiny pixel dragon |

Whiskers the Cat is included by default. Additional pets are purchased from the **Curiosity Cart** (shop).

The Curiosity Cart uses a shared keyboard-accessible choice bar for its Pets/Themes sections and pet category filters. Selected categories remain visibly highlighted and expose their pressed state to assistive technology. Owned, not-owned, and favorites filters use fully clickable checkbox labels, and the sort menu follows the same theme-aware form styling and keyboard-focus treatment used elsewhere in the app. Each pet card separates its keyboard-accessible details selector from favorite and purchase actions, so nested controls remain valid and every selected or favorited state is announced. Pet collection and companion XP bars use the shared progress style and announce their current and maximum values.

---

## Pet Nursery

The nursery keeps its morning and evening artwork mounted as stacked background layers. It waits for the night artwork to load before crossfading, so changing display mode never leaves the room blank.

The Camp's Pet Nursery uses \`pet-nursery_morning.webp\` in light mode and a WebP-converted \`pet-nursery_evening.webp\` in dark mode, following the same global display-mode switch as the Awards page. Its label-free egg collection is a compact Nest Stage set into the rear half of the hall floor, visually centered over each nest. Eggs and nests are enlarged by 30% from the compact stage baseline, and the decorative ramp is enlarged, shifted 60% left, and raised 30%; the tier-two nest and tier-five egg retain their relative upgrade. Each egg has its own circular, centered interaction target instead of making its transparent sprite canvas the button, so the pointer and keyboard focus region align with every visible egg. The ramp and eggs retain their original asset colors, while eggs, nests, and the ramp use stepped pixel-art shadows. Clickable eggs enlarge on hover and open the hatch flow, with subtle staggered wobble, bottom-edge milestone progress, and a compact **Companions** tray for pet selection, XP, and feeding.

In dark mode, eggs, nests, and the ramp gain a subtle cool-white glow, with small white Awards-style sparkle orbs that vary in size, placement, timing, and floating motion. Eggs, nests, and the ramp use softened stepped depth shadows; the ramp keeps only that soft shadow in morning mode.

---

## Evolution

The Pet Nursery moves its nest and egg layers down together by 20%, then applies individual egg-only placement adjustments so each egg rests cleanly in its cradle; the larger fifth egg sits slightly higher in its upgraded pedestal. Eggs are enlarged by 20% from the Nest Stage scale, and both layers use a shared grid gap widened by 20% between each nest-and-egg pair.

\`NURSERY_EGG_OFFSETS\` in \`PetNurseryPage.tsx\` provides an individual \`x\` and \`y\` placement value for every egg and its centered interaction target without affecting nest placement. The current offsets keep the eggs just left of center while lowering them 30% toward their nests.

\`NURSERY_PAIR_X_OFFSETS\` provides an individual horizontal position for every nest-and-egg pair, letting their surrounding gaps be adjusted independently; the fifth pair currently uses a 14% right offset.

Eggs use soft Awards-style ambient orbs behind their sprites, positioned slightly right to align with the visual center of the egg artwork. Each slot has a matching glow color and a brighter glow for ready, hovered, or focused eggs.

Pets evolve through 4 visual stages as they level up:

| Stage | Level Range | Description |
|-------|-------------|-------------|
| Baby | 1–2 | Small, simple sprite |
| Adult | 3–5 | Full-size, more detail |
| Evolved | 6–9 | Special effects, larger |
| Legendary | 10+ | Glowing aura, final form |

XP is earned through:
- Typing practice (per character)
- Completing adventure stages
- Boss battle rewards

---

## Pet XP Formula

\`\`\`
XP per test = correctChars / 10 (minimum 1)
XP per stage = stage goal (×2 for boss)
\`\`\`

XP needed per level: \`level × 50\`

---

## Default Names

| Pet | Default Name |
|-----|-------------|
| Cat | Whiskers |
| Dog | Barkley |
| Fox | Sly |
| Rabbit | Flopsy |
| Panda | Bamboo |
| Penguin | Chilly |
| Dragon | Ember |
`;
