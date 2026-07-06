# Camp - Living Home Base

Camp is PawType's home screen: a living pixel campsite scene that grows with the player and now uses painted time-of-day background art inside the scene itself.

## Layout

- **Scene (`CampScene`)** - Full-bleed interactive pixel environment with background art for morning, afternoon, and evening/night, plus hand-placed buildings aligned to the campsite composition. No dashboard cards or bottom dock.

## Files

| Path                                           | Role                                                                                                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/hub/Hub.tsx`                   | Hosts the camp scene as the hub home view.                                                                                            |
| `src/components/camp/CampScene.tsx`            | Selects the background art by time of day, places buildings to match the campsite composition, and renders the HUD, pet, and overlay. |
| `src/components/camp/WanderingPet.tsx`         | Autonomous pet that walks between waypoints and jumps on `pawtype-pet-celebrate`.                                                     |
| `src/components/camp/ambient/AmbientLayer.tsx` | Theme-driven particles such as butterflies, fireflies, petals, leaves, clouds, and stars.                                             |
| `src/components/camp/modals/CampModals.tsx`    | One modal per building (Cabin, Painter's Tent, Pet Nursery, Training Board, Supply Wagon).                                            |
| `src/lib/camp/progression.ts`                  | `getCampTier(level)` helper for decor unlocks.                                                                                        |
| `src/lib/camp/timeOfDay.ts`                    | Morning, afternoon, evening, and night overlay driver.                                                                                |
| `src/styles/camp.css`                          | Camp scene styles and keyframes.                                                                                                      |

## Interaction Model

- Buildings are `<button>` sprites positioned absolutely on top of the painted camp background. Clicking a building opens its modal via the shared `ModalShell`.
- Building anchors are mapped to the illustrated campsite composition so the library, cabin, tent, wagon, nursery, mailbox, blacksmith, and campfire sit in the same visual zones as the reference scene.
- Painter's Tent wraps `ThemeSetsSection`; selecting a theme triggers a 700 ms crossfade of the scene.
- Supply Wagon opens a chest with shake, burst, and reward flow; it dispatches `pawtype-pet-celebrate` so the pet jumps.
- The pet's wandering loop is self-contained and does not write game state.

## Progression Tiers

Tiers unlock at levels 1 / 10 / 20 / 35 / 50 / 75 / 100. Each tier adds decor sprites conditionally rendered in `CampScene`. No new game state - the scene reads existing `player.level`.

| Level | Unlocks                                    |
| ----- | ------------------------------------------ |
| 1     | Tent, campfire, trees                      |
| 10    | Fence, garden, mailbox                     |
| 20    | Cabin, bridge, lanterns                    |
| 35    | Windmill, pond, flower beds                |
| 50    | Stone paths, visitors, decorations         |
| 75    | Great lodge, watchtower, statues, crystals |
| 100   | Legendary sanctuary sparkle                |

## Time Of Day

`getTimeOfDay()` reads the local clock. `CampScene` swaps background art for morning, afternoon, and evening, and reuses the evening art for night with a darker overlay tint. Fireflies spawn at night.

## Adding Future Features

The scene is a set of stacked `.camp-layer` divs. To add a new interactive element:

1. Add its sprite to `CampScene` at the correct z-order.
2. Add a modal in `modals/CampModals.tsx` and wire the `openBuilding` union.
3. If it depends on progression, gate rendering on a new field in `CampTier`.

Planned expansions the current architecture can support:

- Furniture placement by extending `Inventory.items` with furniture type and camp slot.
- Seasonal events by extending `AmbientLayer` particle profiles per season.
- NPC visitors via a `Visitors` component that reads a visitor schedule.
- Fishing pond via a new `FishingModal` when the pond decor is clicked.
- Photo mode via a control that hides HUD and snapshots the scene.
