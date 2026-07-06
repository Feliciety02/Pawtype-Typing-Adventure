# Camp Redesign — Living Home Base

Transform `src/components/hub/Hub.tsx` from a dashboard of cards into a two-section living pixel campsite. This is a large frontend-only change; I'll ship it in modular pieces so future systems (furniture, NPCs, fishing) can drop in without rework.

## Layout

Replace current Hub with a two-zone shell:

```text
┌─────────────────────────────────────────────┐
│                                             │
│         CAMP SCENE (70% height)             │
│   parallax sky · ground · buildings · pet   │
│                                             │
├─────────────────────────────────────────────┤
│  [Cabin] [Nursery] [Tent] [Wagon] [Board]   │  ← dock (30%)
└─────────────────────────────────────────────┘
```

- Top: `<CampScene />` — full-bleed pixel canvas, no cards overlaid.
- Bottom: `<CampDock />` — RPG inventory-style button row for Inventory, Pet, Themes, Collection, Achievements, Settings.

## New files

- `src/components/camp/CampScene.tsx` — scene composer, handles layers (sky, midground, ground, foreground, particles, pet).
- `src/components/camp/CampDock.tsx` — bottom nav dock, opens buildings or routes to existing views.
- `src/components/camp/buildings/Cabin.tsx` — click → opens `CabinModal` (profile, titles, inventory, collection).
- `src/components/camp/buildings/Campfire.tsx` — always-visible HUD: world, level, XP bar, active quest. Animated fire sprite.
- `src/components/camp/buildings/PetNursery.tsx` — click → `NurseryModal` (pets, eggs, rename, feed, happiness).
- `src/components/camp/buildings/PaintersTent.tsx` — click → `ThemesModal` showing postcards; selecting one triggers scene transformation.
- `src/components/camp/buildings/SupplyWagon.tsx` — daily reward chest with shake/open/burst animation.
- `src/components/camp/buildings/TrainingBoard.tsx` — click → `TrainingBoardModal` with visualized stats.
- `src/components/camp/WanderingPet.tsx` — pet that walks, idles, reacts to clicks and rewards, based on `inventory.activePet`.
- `src/components/camp/ambient/` — `Butterflies.tsx`, `Fireflies.tsx`, `DriftingLeaves.tsx`, `Clouds.tsx`, `Petals.tsx` (theme-driven).
- `src/components/camp/modals/` — one modal per building; each wraps existing systems (ThemeSetsSection, PetRoom, StatsView, AchievementsCard, etc.) so no logic duplication.
- `src/lib/camp/progression.ts` — pure helper: `getCampTier(level)` → returns unlocked buildings/decor tier (1/10/20/35/50/75/100). Drives which sprites render.
- `src/lib/camp/timeOfDay.ts` — pure helper: `getTimeOfDay(date)` → `"morning" | "afternoon" | "evening" | "night"`; controls lighting overlay.
- `src/styles/camp.css` — keyframes: `sway`, `flicker`, `wander`, `chest-shake`, `chest-burst`, `theme-fade`, `firefly-drift`, `cloud-drift`. Added to `src/styles.css` import list.

## Reused (no changes to internals, just wrapped in modal shells)

- `ThemeSetsSection` inside Painter's Tent modal (postcard styling wrapper).
- `PetRoom` / `PixelPet` inside Nursery modal.
- `StatsView` inside Training Board modal.
- `AchievementsCard`, `Shop` reachable from dock via `onViewChange` (unchanged).
- Daily reward logic (`CLAIM_DAILY_REWARD`) reused inside Supply Wagon chest interaction.
- `useQuests`, `dailySuggestion` surface on Campfire HUD instead of separate cards.

## Interaction model

- Buildings render as pixel sprites positioned absolutely on the scene. Hover: soft glow + name tooltip. Click: opens its modal (uses existing `ModalShell`).
- Pet wanders via requestAnimationFrame loop with waypoints; on reward claim, dispatches celebration animation; on cursor hover near it, turns to face cursor.
- Theme selection from Painter's Tent updates `useWorld().setWorld()` and triggers a 600ms crossfade overlay before swapping ground/ambient layers.
- Time-of-day overlay: single semi-transparent gradient div on top of scene, color per period; recomputed every minute.

## Progression tiers

`progression.ts` returns a tier object like `{ hasCabin, hasFence, hasBridge, hasWindmill, hasStatues, hasCrystals, decorLevel }`. `CampScene` conditionally renders decor sprites based on tier. No new game state — reads existing `player.level`.

## Assets

Reuse existing sprite/emoji-based rendering where possible (PixelIcon, pet sprites). For campfire/cabin/wagon/tent/nursery/board, generate small pixel-art PNGs into `src/assets/camp/` via `imagegen` (fast tier, transparent bg) — one per building, plus a ground tile and a background sky per world (uses existing `THEME_BACKGROUND` where available).

## Docs

- Update `src/lib/docs/future.ts`: move "Living Camp" idea (if listed) to Shipped; add entries for building modals and progression tiers.
- Add `docs/CAMP.md` describing the modular architecture for future features (furniture, NPCs, fishing, farming).

## Out of scope for this pass

- Music, weather beyond ambient particles, fishing/farming/crafting/mail systems (architecture supports them; not implemented).
- Backend changes. All new state derives from existing `GameState`.
- Mobile-specific layout tuning beyond making the scene responsive with a shorter height on small screens.

## Verification

- Build passes (harness runs typecheck).
- Playwright script: load `/`, screenshot Camp, click each building, screenshot each modal, click Painter's Tent → change theme → screenshot transformation, click Supply Wagon chest → screenshot reward burst.
