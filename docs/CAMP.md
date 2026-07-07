# Camp - Living Home Base

Camp is PawType's home screen: a living pixel campsite scene that grows with the player and now uses a real-time local-clock day/night atmosphere over a static environment.

## Layout

- **Scene (`CampScene`)** - Full-page interactive pixel environment with a static terrain/environment layer and adaptive atmosphere layers. The scene owns the Camp tab page box directly with no extra wrapper panel, dashboard cards, or bottom dock.

## Files

| Path                                           | Role                                                                                                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/hub/Hub.tsx`                   | Hosts the camp scene as the hub home view.                                                                                            |
| `src/components/camp/CampScene.tsx`            | Places responsive building sprites on the static world plane and renders the pet, modals, and interactive camp layer.                 |
| `src/components/camp/WanderingPet.tsx`         | Autonomous pet that walks between waypoints and jumps on `pawtype-pet-celebrate`.                                                     |
| `src/components/camp/ambient/AmbientLayer.tsx` | Theme-driven particles such as butterflies, fireflies, petals, leaves, clouds, and stars.                                             |
| `src/components/world/*`                       | Reusable local-clock day/night controller and render layers for sky, sun, moon, stars, lighting, water reflection, and particles.      |
| `src/components/camp/modals/CampModals.tsx`    | One modal per building (Cabin, Painter's Tent, Pet Nursery, Training Board, Supply Wagon, Bag/Inventory).                             |
| `src/lib/camp/progression.ts`                  | `getCampTier(level)` helper for decor unlocks.                                                                                        |
| `src/styles/camp.css`                          | Camp scene styles and keyframes.                                                                                                      |

## Interaction Model

- Buildings are `<button>` sprites positioned absolutely on a 16:9 `.camp-scene-world` coordinate plane with a shared soft glow for readability. Clicking a building opens its modal via the shared `ModalShell`.
- Building anchors are mapped to the illustrated campsite composition so the library, cabin, tent, wagon, mailbox, nursery, blacksmith, and campfire sit on the same dirt-path landmarks as the reference scene. The world plane is top-aligned to the viewport, scales/crops like the background artwork, and keeps the scene image and building anchors moving together, while each building sprite uses a fixed pixel width so viewport resizing does not make the sprites grow.
- The Bag is no longer an outdoor map sprite. It lives inside the Cabin as a dedicated in-camp inventory page with a Back to Camp button, keeping the outdoor spot free for future home/customization placement. The Cabin entry remains available so inventory is not blocked by progression.
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

`WorldRenderer` reads the player's local clock and continuously interpolates through midnight, pre-dawn, sunrise, morning, noon, afternoon, sunset, and twilight. The environment image stays fixed; only sky gradients, sun/moon position, stars, constellations, lighting tint, water highlights, and particles change.

## Cabin Bag / Inventory

The Bag tab was removed from the top navigation bar and now lives inside the Cabin. Clicking the Cabin opens a dedicated camp page that wraps `InventoryPage`, showing eggs, pets, claimed rewards, and treasure chest progress. The Back to Camp button returns to the outdoor scene.

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
