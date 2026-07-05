# Camp — Living Home Base

Camp is PawType's home screen: a two-zone pixel campsite that grows with the player.

## Layout

- **Scene (`CampScene`)** — full-bleed interactive pixel environment. Buildings, decor, wandering pet, and ambient particles all live here. No dashboard cards.
- **Dock (`CampDock`)** — RPG inventory-style row at the bottom, routes to Train, Quest, Learn, Shop, Awards, Settings.

## Files

| Path | Role |
| --- | --- |
| `src/components/hub/Hub.tsx` | Composes CampScene + CampDock. |
| `src/components/camp/CampScene.tsx` | Renders sky/ground layers, buildings, campfire HUD, pet, time overlay. |
| `src/components/camp/CampDock.tsx` | Bottom nav dock. |
| `src/components/camp/WanderingPet.tsx` | Autonomous pet that walks between waypoints, jumps on `pawtype-pet-celebrate`. |
| `src/components/camp/ambient/AmbientLayer.tsx` | Theme-driven particles (butterflies, fireflies, petals, leaves, clouds, stars). |
| `src/components/camp/modals/CampModals.tsx` | One modal per building (Cabin, Painter's Tent, Pet Nursery, Training Board, Supply Wagon). |
| `src/lib/camp/progression.ts` | `getCampTier(level)` — pure helper for what decor is unlocked. |
| `src/lib/camp/timeOfDay.ts` | Morning / afternoon / evening / night overlay driver. |
| `src/styles/camp.css` | All camp styles + keyframes. |

## Interaction Model

- Buildings are `<button>` sprites positioned absolutely. Click → opens its modal via the shared `ModalShell`.
- Painter's Tent modal wraps existing `ThemeSetsSection`; selecting a theme triggers a 700 ms crossfade of the scene.
- Supply Wagon opens a chest with shake → open → particle burst; dispatches `pawtype-pet-celebrate` so the pet jumps.
- The pet's wandering loop is self-contained (no game state writes).

## Progression Tiers

Tiers unlock at levels 1 / 10 / 20 / 35 / 50 / 75 / 100. Each tier adds decor sprites conditionally rendered in `CampScene`. No new game state — reads existing `player.level`.

| Level | Unlocks |
| --- | --- |
| 1 | Tent, campfire, trees |
| 10 | Fence, garden, mailbox |
| 20 | Cabin, bridge, lanterns |
| 35 | Windmill, pond, flower beds |
| 50 | Stone paths, visitors, decorations |
| 75 | Great lodge, watchtower, statues, crystals |
| 100 | Legendary sanctuary sparkle |

## Time of Day

`getTimeOfDay()` reads the local clock. A soft-light gradient overlay tints the scene. Fireflies spawn at night.

## Adding Future Features

The scene is a set of stacked `.camp-layer` divs. To add a new interactive element:

1. Add its sprite to `CampScene` at the correct z-order.
2. Add a modal in `modals/CampModals.tsx` and wire the `openBuilding` union.
3. If it depends on progression, gate rendering on a new field in `CampTier`.

Planned expansions (architecture supports without redesign):
- Furniture placement (extend `Inventory.items` with furniture type + camp slot)
- Seasonal events (extend `AmbientLayer` particle profile per season)
- NPC visitors (add `Visitors` component reading a visitor schedule)
- Fishing pond (open a new `FishingModal` when the pond decor is clicked)
- Photo mode (button on `.camp-tier-chip` that hides HUD and snapshots the scene)
