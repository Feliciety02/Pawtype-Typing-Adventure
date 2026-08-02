# Camp - Living Home Base

Camp is PawType's home screen: a living pixel campsite scene that grows with the player and now uses a real-time local-clock day/night atmosphere over a static environment.

## Layout

- **Scene (`CampScene`)** - Full-page interactive pixel environment with a static terrain/environment layer, a background-only edge vignette, and adaptive atmosphere layers. The scene owns the Camp tab page box directly with no extra wrapper panel, dashboard cards, or bottom dock.

## Files

| Path                                           | Role                                                                                                                              |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/hub/Hub.tsx`                   | Hosts the camp scene as the hub home view.                                                                                        |
| `src/components/camp/CampScene.tsx`            | Places responsive building sprites on the static world plane and renders Cabin inventory, modals, and the interactive camp layer. |
| `src/components/camp/WanderingPet.tsx`         | Autonomous pet that walks between waypoints and jumps on `pawtype-pet-celebrate`.                                                 |
| `src/components/camp/ambient/AmbientLayer.tsx` | Theme-driven particles such as butterflies, fireflies, petals, leaves, clouds, and stars.                                         |
| `src/components/world/*`                       | Reusable local-clock day/night controller and render layers for sky, sun, moon, stars, lighting, water reflection, and particles. |
| `src/components/camp/modals/CampModals.tsx`    | Shared compact/wide Camp dialogs for the Painter's Tent, Training Board, Supply Wagon, and future Camp building overlays.         |
| `src/components/camp/PetNurseryPage.tsx`       | Full-page Pet Nursery interior with separately anchored nest and egg layers, milestone progress, and compact companion care.      |
| `src/lib/camp/progression.ts`                  | `getCampTier(level)` helper for decor unlocks.                                                                                    |
| `src/styles/camp/index.css`                    | Ordered camp style entrypoint that pulls together the modular scene, nursery, modal, and animation styles.                        |
| `src/styles/camp/scene.css`                    | Camp scene, world atmosphere, buildings, decor, and dock styles.                                                                  |
| `src/styles/camp/nursery.css`                  | Pet Nursery room layout, independently positionable egg/nest layers, companion overlays, and responsive rules.                    |
| `src/styles/camp/modals.css`                   | Camp modal, supply wagon chest, and Pet Room presentation overrides.                                                              |
| `src/styles/camp/animations.css`               | Camp and world keyframes plus reduced-motion overrides.                                                                           |

## Interaction Model

- Interactive buildings are `<button>` sprites positioned absolutely on a 16:9 `.camp-scene-world` coordinate plane with a shared soft glow and keyboard-focus treatment. Decorative scenery such as the campfire uses non-interactive markup instead of disabled buttons; its sprite's own fire remains visible without an additional ground halo spilling over the nearby blacksmith path.
- The blacksmith uses the same shared warm ground halo as the other interactive buildings, keeping its forge visually lit in the camp scene.
- Hovered or keyboard-focused buildings temporarily raise above neighboring sprites so floating name tags stay readable instead of being covered by nearby objects such as the mailbox.
- Building anchors are mapped to the illustrated campsite composition so the Training Board/library sprite, cabin, tent, wagon, mailbox, nursery, blacksmith, and campfire sit on the same dirt-path landmarks as the reference scene. The world plane is top-aligned to the viewport, scales/crops like the background artwork, and keeps the scene image and building anchors moving together, while each building sprite uses a fixed pixel width so viewport resizing does not make the sprites grow.
- The Bag is no longer an outdoor map sprite. It lives inside the Cabin as a dedicated in-camp inventory page with a shared Back to Camp button, keeping the outdoor spot free for future home/customization placement. While the inventory is open the outdoor scene is inert, `Escape` returns to Camp, and focus returns to the Cabin trigger.
- A soft vignette is layered inside the world renderer, so it shades the full painted background and atmosphere while leaving buildings, the HUD, and open Camp pages unaffected.
- Painter's Tent wraps `ThemeSetsSection`; selecting a theme triggers a 700 ms crossfade of the scene.
- Camp building dialogs use semantic headings, consistent compact or wide widths, and bounded scrolling so their framed content remains usable on phones and short viewports.
- The Cabin, Pet Nursery, and Mailbox all use the shared `CampBackButton` component. It is a native keyboard-accessible button with the supplied pixel-art Back artwork, preserving the same Back to Camp action, focus restoration, and Escape behavior as the former CSS button.
- Pet Nursery opens as a dedicated, non-scrolling in-camp room using `public/camp/pet-nursery-page/pet-nursery_morning.webp` in light mode and the WebP-converted `pet-nursery_evening.webp` in dark mode. It follows the same global light/dark display-mode switch as the Awards page. Its label-free nest and egg layers form a compact Nest Stage anchored in the rear half of the hall floor, so the artwork remains the dominant scene. Eggs use the artwork’s visual center to align over their own nests, and both layers move together. Each egg has a separate centered circular interaction target, preventing its transparent image canvas from offsetting the pointer or keyboard focus region. Eggs and nests are 30% larger than the compact stage baseline, while `ramp.webp` is enlarged, shifted 60% left, and raised 30%; the tier-two nest and tier-five egg retain their relative upgrade. The ramp and eggs retain their original asset colors, while eggs, nests, and ramp have pronounced stepped pixel-art shadows. The layout scales down with the viewport rather than being cropped, eggs use subtle staggered wobble and only enlarge/open when available, and milestone progress stays at the bottom edge. The supplied `public/shared/buttons/companion-button.webp` artwork is the accessible Companions tray toggle, preserving its open/close state and live companion count. Its count uses the shared HUD notification-badge styling. Its artwork is 20% larger and shares the Back control's displayed height, top edge, and 20%-height gap below the header at all breakpoints. Companion selection, XP, and feeding remain available through the compact overlay tray so they do not extend the page below the viewport.
- Both Nursery backdrop images remain mounted and crossfade only after the incoming night art is loaded, eliminating blank lapse during light/dark switches.
- In dark mode, Pet Nursery eggs, nests, and the ramp gain a subtle cool-white glow. Eggs, nests, and the ramp use softened stepped depth shadows; in morning mode, the ramp retains only that soft shadow. Small white orbs reuse the Awards badge sparkle behavior, varying in size, placement, timing, and upward drift around those assets. The colored ambient glow behind each egg is positioned slightly right to match the visual center of its sprite.
- Supply Wagon opens a chest with shake, burst, and reward flow; it announces the opening/claimed status, disables the chest as soon as activation starts, clears animation timers when closed, and dispatches `pawtype-pet-celebrate` so the pet jumps.
- The pet's wandering loop is self-contained and does not write game state.

Mailbox opens as a dedicated, non-scrolling in-camp room using `public/camp/mailbox-page/mailbox_background_morning.webp` and `mailbox_background_evening.webp`. Both backgrounds remain mounted and crossfade only after the evening artwork loads. The room follows the global light/dark display-mode switch and the same Back to Camp, Escape, and focus-restoration behavior as the Pet Nursery.

Blacksmith opens as a dedicated in-camp forge using `public/camp/blacksmith-page/blacksmith-background-morning.png` and `blacksmith-background-evening.png`. Both backgrounds stay mounted and crossfade only after the evening art loads. The forge follows the global light/dark display-mode switch and directly overlays the full Keyboard Workshop on the scene, filling the available interior height. The 3D viewport is transparent so the keyboard appears directly over the forge artwork, while workshop controls remain opaque and readable. Its Back control returns to Camp, and Escape plus focus restoration behave like Pet Nursery and Mailbox.

The Blacksmith's Keyboard Workshop has Aula-style reactive RGB backlighting. Each key carries a subtle colored underglow and flashes brighter when clicked in the 3D preview or pressed in Test Typing mode.

The workshop's default keyboard uses the supplied royal-cream, purple, and charcoal pixel keycap artwork as individually cropped transparent top assets under `public/workshop/keycaps/royal-cream/`. Each bundled top maps to its exact crop from `royal-cream-keycap-atlas.png`, including the cream alphas and number row, purple modifiers and Enter key, cream navigation column, charcoal arrow cluster, knob, decorated paw-print Space key, purple arrow Backspace, and distinct long-left and short-right Shift tops. Crop boundaries follow the six actual key rows and the start of each physical cap, excluding neighboring shadows, colored bleed, inter-row artifacts, and the outer four-pixel baked sprite fringe. Output canvases are normalized to the physical aspect ratio of each 1u or wide key. The fixed 3D text layer stays hidden for this bundled skin because its legends are already part of the artwork; custom uploads and explicit artwork removal continue to persist per key.

The 3D camera fits the complete rendered keyboard and case inside the live center viewport for all full-keyboard presets. It recalculates against the available canvas dimensions, including the narrower Blacksmith workbench between its side panels, so responsive layouts and real-pitch keyboard dimensions do not crop the model. Close-up presets keep their intentionally tighter framing.

Bundled full-wrap keycaps use matched wall sprites from `public/workshop/keycaps/sides/royal-purple/`, `royal-cream/`, and `royal-charcoal/`. The renderer samples each top crop: cream and white tops receive cream front, back, left, and right walls; neutral black tops receive charcoal walls; and saturated purple tops retain the darker purple set. It chooses the nearest supplied 1u, 1.25u, 1.5u, 1.75u, 2u, 2.25u, 2.75u, 3u, 6.25u, or 7u size for the long front and back walls. The physical left and right ends select against key depth and reuse the squared front-wall artwork instead of the atlas's triangular directional profiles, giving every viewing angle the same boxier panel treatment. Front and back atlas directions remain assigned to the opposite scene wall because the supplied sprite viewpoint uses the inverse convention from the 3D coordinate system. Each sprite retains its complete transparent silhouette. Its mesh spans the full base extent while following the keycap's vertical base, shoulder, and top coordinates, allowing the sprite's own measured 72% opaque taper to define the visible edge exactly once. This prevents a second geometry taper from pulling the artwork inward and exposing dark corner strips. The sprites are surface artwork only: they do not add another keycap shell or change geometry. User-uploaded full-wrap images continue to wrap their own source on every side.

The generated royal-cream walls replace the purple source sprite's near-black opaque outline with a warm cream-brown edge ramp. This preserves the pixel-art bevel contrast while preventing the compressed end-face outline from appearing as a black vertical stripe at oblique camera angles. Cream wall artwork also receives a small 4% vertical overscan at both its top and bottom edges, overlapping the top/body junction so no seam can remain visible. Royal-purple and royal-charcoal walls retain their darker outline treatment and original vertical proportions. Artwork-backed top and wall shells use unlit majority-color materials, matching the unlit pixel sprites above them; transparent tapered margins therefore reveal the same color rather than a lit backing face that can fall to near-black when turned away from the scene lights.

Every keycap now uses one uniformly beveled AULA F75-inspired Cherry shape. Keyboard rows share the same height, top angle, taper, and shoulder treatment. The body uses the bundled wall sprite's measured 72% top-to-base silhouette, and its intermediate shoulder lies directly on that same straight bevel plane instead of bulging through the transparent artwork. Wide modifiers and the spacebar extend only the flat center span: their left/right bevel inset remains the same fixed physical width as a 1u key, preventing percentage-based scaling from turning the spacebar end into a steep triangular wall. The Inspector identifies this fixed shape instead of offering per-key profile choices.

Every bundled top texture maps at the same shared physical angle. Bundled artwork is UV-wrapped onto geometry that duplicates the keycap's exact top-face outline and surface coordinates instead of floating on a rectangular plane. It therefore fills non-square modifiers without spilling past the cap, exposing a rectangular edge, or separating visually from the bevel. Pixel textures use nearest filtering without mipmaps and clamp at their outer texel, preventing transparent black RGB data from bleeding into the visible top edge at oblique camera angles. Side-art meshes follow the exact base, shoulder, and top spans of each wall. Their UV rows crop rather than resize the source art as the wall narrows, and the surface offset stays smaller than the inter-key seam, preventing wide-key decorations from spilling onto neighboring caps. Custom artwork in contain mode retains its centered aspect-preserving plane. Keycap backing materials sample a cached, alpha-aware majority color from the loaded top and side textures. The top shell uses the top image's sampled color, while the wall shell uses the side images' sampled color multiplied by the same display tint as those images. Transparent sprite pixels therefore reveal the exact rendered majority color rather than a fixed gray, a brighter backing shell, or unrelated purple. Custom uploaded artwork receives the same adaptive backing-color treatment.

The default 3D model uses the AULA F75 as its key-layout reference: 81 keys plus a top-right rotary knob. One pitch is 19.05 mm center-to-center, a 1u cap is modeled as 18 mm square, and the remaining approximately 1.05 mm forms the visible seam between neighboring caps. Multi-unit caps stay aligned to the same pitch grid; Backspace is 2u, Backslash is 1.5u, Enter is 2.25u, and right Shift is 1.75u. The bottom row includes the existing 1u right Ctrl keycap between Fn and the arrow cluster. Navigation and arrow clusters remain contiguous because row compensation is inserted before each cluster rather than inside it. The outer case uses the same compact keycap-to-shell clearance on every edge, eliminating the former oversized top and front lips while keeping the frame and plate aligned.

The Blacksmith Workshop uses a streamlined three-column forge-bench layout: the left rail is the single source for layout, parts, key groups, and presets; the transparent central workbench hosts the live 3D keyboard; and the parchment Inspector on the right exposes part controls. The duplicate top part shortcuts and bottom key-group shortcuts used by the standalone Workshop are omitted here, leaving one compact action bar for camera, typing, undo, and redo. The embedded header also relies on the Blacksmith plaque instead of repeating the generic Keyboard Workshop title. The layout reduces to a focused central workbench on narrower screens.

Test Typing keeps its high-frequency pressed-key state outside the persisted editor store and applies it directly to 3D object refs, so keydown and keyup do not cause React component renders. Keycap travel and RGB flare have a near-instant attack with a softer release, switch stems update only when their pressed state changes, and scene lighting reads the held-key count during the render loop. The sound engine reuses one interactive-latency audio context instead of creating and closing one per key. Mapped keys suppress browser defaults, repeated or duplicate keydown events are ignored, and blur or mode exit releases all held keys to prevent stuck visuals.

## Progression Tiers

The progression helper defines future decor tiers at levels 1 / 10 / 20 / 35 / 50 / 75 / 100. The current painted Camp composition keeps its core building sprites visible, and the Cabin remains available at every level so inventory is never blocked.

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

`WorldRenderer` reads the player's local clock and continuously interpolates through midnight, pre-dawn, sunrise, morning, noon, afternoon, sunset, and twilight. Camp now also respects the global Day/Night display toggle:

- If the player chooses Night mode during real-time daytime, Camp forces the night presentation.
- If the player chooses Day mode during real-time nighttime, Camp forces the morning presentation.
- If the toggle already matches local time, Camp keeps the normal real-time scene progression.

The camp background art and atmosphere layers stay in sync, so a forced morning/night choice does not leave the sky, lighting, and painted environment mismatched.

From twilight through pre-dawn, the sky also schedules occasional shooting stars. Each event uses a new random wait time, starting position, downward path, speed, and trail length so the meteors do not repeat on a fixed loop.

The Pet Nursery moves every nest and egg down together by 20%, then applies individual egg-only placement adjustments within every slot so the egg rests cleanly in its cradle; the larger fifth egg sits slightly higher in its upgraded pedestal. Eggs are enlarged by 20% from the Nest Stage scale. Both layers use one shared grid gap widened by 20%, keeping every egg paired with its nest while creating clear separation across the compact mid-ground Nest Stage.

Each egg's independent `x` and `y` adjustment lives in `NURSERY_EGG_OFFSETS` in `PetNurseryPage.tsx`, so its sprite and centered interaction target can be tuned per egg without moving its nest. The current offsets keep eggs just left of center while lowering them 30% toward their nests.

`NURSERY_PAIR_X_OFFSETS` in the same file provides one horizontal adjustment per nest-and-egg pair, allowing each gap to be tuned independently while the pair stays together. The fifth pair uses a 14% right offset to give it additional clearance.

Each nursery egg also has an Awards-style soft ambient orb behind it. The glow stays behind the pixel art, sits slightly right to match the sprite’s visual center, uses a color matched to the egg slot, and brightens for eggs ready to hatch or when focused/hovered.

## Cabin Bag / Inventory

The Bag tab was removed from the top navigation bar and now lives inside the Cabin. Clicking the Cabin opens a dedicated camp page that wraps `InventoryPage`, showing eggs, pets, claimed rewards, and treasure chest progress. The Back to Camp button or `Escape` returns to the outdoor scene and restores keyboard focus to the Cabin.

## Adding Future Features

## Modal Design System

Camp dialogs use the shared code-first pixel modal shell. Choose `sm` (420px) for compact rewards, `md` (680px) for standard camp interactions, `lg` (760px) for readable detail views, and `xl` (1040px) for grids and collections. The shell supplies the consistent wood frame, parchment panel, pixel corners, close control, viewport-safe scrolling, and reusable card/button treatment; new modals should extend those components instead of creating a one-off panel style.

## Asset Location

All Camp artwork is stored in `public/camp/`: `scenes/` contains the day/night backdrops, `buildings/` contains interactive building sprites, `blacksmith-page/` and `mailbox-page/` contain their interior backgrounds, and `pet-nursery-page/` contains nursery backgrounds, nests, eggs, and the ramp. Shared UI icons are in `public/shared/icons/`; do not add new Camp art to the public root.

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
