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

The Camp's Pet Nursery uses \`pet-nursery_morning.webp\` in light mode and a WebP-converted \`pet-nursery_evening.webp\` in dark mode, following the same global display-mode switch as the Awards page. Its label-free egg collection is spaced apart on the left, visually centered over each nest, and moved down with the nest layer. All nests and eggs are enlarged by 20%, with the tier-two nest and tier-five egg retaining their additional tier upgrade. Its decorative WebP ramp is anchored on the right, shifted 70% left, and enlarged by 30% from its prior size. The ramp and eggs receive a warm, muted palette grade to blend with the room’s amber wood and moss tones, while eggs, nests, and the ramp use pronounced stepped pixel-art shadows. Clickable eggs enlarge on hover and open the hatch flow, with subtle staggered wobble, bottom-edge milestone progress, and a compact **Companions** tray for pet selection, XP, and feeding.

---

## Evolution

The Pet Nursery aligns each egg to the same slot offset as its nest and uses 20% wider gaps between nests.

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
