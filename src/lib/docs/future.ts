export const FUTURE_DOC = `# Future Addons - Roadmap & Ideas

## Shipped

✅ **Shipped** - The Blacksmith Workshop's left selector and right Inspector are now 10% taller, extending upward while keeping their lower edges aligned with the workbench. The live keyboard name also sits 10 percentage points higher on the title plaque.

✅ **Shipped** - Route changes now remount one optimized entrance transition, with regular page sections appearing in short staggered steps instead of popping in together. Authentication and lazy-route fallbacks use the same compact paw-and-dots loading sequence, and all entrance/stagger animations are disabled when reduced motion is preferred.

✅ **Shipped** - The raster library was re-audited and optimized after the Blacksmith UI import. Eight oversized full-scene WebPs, both authentication frames, and the new Workshop and shared UI art now use display-aware dimensions and conservative role-specific WebP settings while preserving alpha and aspect ratios. Six byte-identical Workshop hover sprites were removed and now reuse their active-state artwork; the footer's missing divider image request was replaced with a lightweight CSS separator.

✅ **Shipped** - The embedded Blacksmith's left customization rail and right Inspector now continue below the centered action buttons by a responsive visual gap. Both side panels retain matching full-workbench height while the footer sits slightly higher, keeping the panel bottoms clearly longer without crowding the viewport edge.

✅ **Shipped** - The Blacksmith Workshop title plaque is displayed 40% smaller across desktop and compact layouts while preserving the supplied artwork's native aspect ratio and transparency.

✅ **Shipped** - The Blacksmith Workshop title now uses the supplied complete 2048:710 plaque artwork with transparent surrounding space. Responsive sizing follows that native aspect ratio, preserving the original top and bottom padding without cropping or stretching.

✅ **Shipped** - The Blacksmith interior now centers an illustrated Blacksmith Workshop plaque above the forge editor and displays the active keyboard's live name on the sign directly below its main title lettering. The separate Back to Camp control stays independently aligned on the left instead of being wrapped into the plaque or selector sidebar.

✅ **Shipped** - The embedded Blacksmith layout no longer draws an outer container around the keyboard, selector sidebar, and Inspector modal. Its structural wrapper is transparent, borderless, outline-free, and shadow-free while retaining the responsive three-area grid.

✅ **Shipped** - The Blacksmith Workshop selector now labels Presets as step 4 and uses the same state-accurate accordion chevron as the first three steps: right when collapsed and down when expanded.

✅ **Shipped** - The Keyboard Workshop's centered Typing/rest camera now uses one canonical startup, Reset, and primary-drag-release composition matching the straight, more elevated reference: direction \`[0, 12, 13]\`, complete keyboard framed 20% smaller, and projection shifted upward by 15% of its displayed height, another five percentage units lower than the prior position. OrbitControls damping is explicitly disabled instead of relying on the library default, which is enabled and was retaining a rotation delta that caused hidden post-release movement. Wheel events emitted while the primary button remains held continue zooming from the current inspection angle; their immediate OrbitControls end events cannot request a rest return, which now waits for the actual primary release. DOM pointer tracking and OrbitControls' own interaction-end event otherwise provide redundant, deduplicated return triggers. A click already at the destination skips animation entirely, while the optimized return keeps a fixed world-up reference and hands the exact final transform to the controls without a second constraint pass.

✅ **Shipped** - The public image library is fully WebP: all 470 public raster assets use \`.webp\`, with no remaining PNG, JPEG, GIF, BMP, or TIFF files. Render-diagnostic paths and documentation also reference their WebP replacements, while the lossless conversion utility remains available for future source imports.

✅ **Shipped** - The Blacksmith's left customization sidebar now keeps one fixed responsive width while sections expand or collapse. Its scrollbar gutter is permanently reserved and its contents are inline-size-contained, preventing taller button grids or the scrollbar from shrinking, widening, or horizontally shifting the rail.

✅ **Shipped** - Releasing the primary mouse button after rotating the Keyboard Workshop preview restores a straight, centered Typing presentation instead of leaving the keyboard diagonally in the Isometric view. One post-pointer-event return owns camera position, orientation, zoom, and projection offset; direct orbit input has no competing damping or control remount, while mouse-wheel zoom remains independently usable.

✅ **Shipped** - The Keyboard Workshop camera now supports unlimited level 360-degree horizontal orbit plus top-to-underside tilt without permitting sideways camera roll. Camera presets restore a level horizon, while zoom, pan, interaction fades, distance limits, and orthographic Front view remain supported.

✅ **Shipped** - The Blacksmith footer's ISO, Front, Reset, Undo, and Redo controls now share Test Typing's larger proportional footprint. All six primary buttons use equal grid space and retain their native 456:168 artwork ratio, increasing both height and length without stretching; compact layouts scale the complete row down together.

✅ **Shipped** - The embedded Blacksmith keyboard canvas now spans the full workbench behind the selector and Inspector instead of being clipped to the center column. Its default camera fit reserves the visible panel widths, free orbit/pan/zoom can use the complete workbench when the panels fade, and the action footer remains constrained to the unobstructed center.

✅ **Shipped** - The Blacksmith Workshop's left selector is wider, and its Back to Camp control now lives in the shared, independent Camp interior toolbar above the workbench. It uses the same responsive size, artwork scale, and centered 1400px alignment as the other Camp interior Back controls without being wrapped by the selector rail.

✅ **Shipped** - Rotating, panning, or zooming the Keyboard Workshop's 3D preview now fades out the left selector and right Inspector for an unobstructed view. A held primary mouse button keeps both panels hidden across overlapping orbit and zoom input, and they fade back in only after the button is released and zooming stops. The bottom action footer remains visible and usable throughout.

✅ **Shipped** - The Blacksmith footer's More build-actions menu now renders in a page-level portal anchored above the gear button, so it can extend outside the footer and workshop clipping boundaries.

✅ **Shipped** - The embedded Blacksmith Workshop center grid is fully transparent, removing the translucent dark rectangle around the 3D keyboard so the forge background remains unobstructed.

✅ **Shipped** - The public image library has been pruned of 145 verified-unused WebP files (1.20 MB): the superseded Stardust keycap set, unloaded directional side sprites, side sizes absent from every available layout, the unused knob top, the retired outdoor Bag sprite, and three replaced login controls. Dynamic Adventure, Awards, Camp, Shop, nursery-egg, and login-leaf assets remain intact.

✅ **Shipped** - Every remaining public PNG asset now has a lossless WebP replacement. All 272 converted images preserve their dimensions, alpha, and visible RGBA pixels, while the Blacksmith backgrounds and Workshop keycap assets shrink from 6.61 MB to 5.23 MB overall. Runtime paths and keycap-generation tools now use WebP directly so PNG files are not reintroduced.

✅ **Shipped** - The Keyboard Workshop mechanical layout now restores the 1u right Ctrl key between Fn and the arrow cluster, using the existing bundled \`CtrlR.webp\` top artwork and matching fitted side artwork. Saved builds receive the restored key automatically without losing their customizations.

✅ **Shipped** - Keyboard Workshop side artwork now fits the exact base, shoulder, and top outline of every keycap. Texture rows are cropped to the narrowing wall instead of extending beyond it, and the surface offset stays inside the inter-key seam so the 2u Backspace artwork no longer overlaps adjacent keys.

✅ **Shipped** - The mechanical keyboard in the Keyboard Workshop now displays the existing royal-cream Enter key image on its top surface, matching the rest of the bundled keycap set while retaining its fitted 2.25u shape and side artwork.

✅ **Shipped** - The Keyboard Workshop 3D layout now closes the visual seam between keycaps from 0.5 mm to 0.15 mm, shortening the whole keyboard matrix while keeping the 18 mm keycap size. Because the case, frame, and plate bounds are derived from the key positions, they automatically shrink with the tighter gaps and stay equally spaced from the keycaps.

✅ **Shipped** - The Keyboard Workshop case now uses the same compact keycap-to-shell clearance on its left, right, top, and bottom edges. Removing the oversized top and front lips shortens the case while preserving the key layout, switch pitch, and aligned frame and plate.

✅ **Shipped** - Keyboard Workshop bevel geometry now matches the bundled side sprite's measured 72% top-to-base silhouette, with the intermediate shoulder constrained to the same straight bevel plane so transparent artwork cannot expose mismatched wedges. Top and side backing materials now use cached, alpha-aware majority colors from the images wrapping those surfaces; side backings receive the same palette tint as the rendered side image so the exposed shell remains an exact visual match.

✅ **Shipped** - Wide Keyboard Workshop keys now preserve the same fixed physical bevel inset as a 1u key. The spacebar and modifiers grow only through their flat center span, so their end-wall angle matches neighboring normal keys instead of becoming progressively steeper with width.

✅ **Shipped** - The supplied royal-cream top atlas drives the visible standard default keycaps: cream alphas and numbers, purple modifiers and Enter, cream navigation keys, charcoal arrows, the decorated paw-print Space top, the purple arrow Backspace top, and distinct long-left and short-right Shift tops are cropped into dedicated transparent assets. The rotary knob is rendered from customizable 3D geometry rather than a top image. Crop boundaries follow the actual cap rows and per-key starts, remove the outer baked sprite fringe, and normalize each generated output to its physical key width. Bundled non-square artwork fills its complete top plane; sampled light tops select cream walls, neutral black tops select charcoal walls, and saturated dark tops retain the purple wall set.

✅ **Shipped** - Bundled top artwork now UV-wraps onto an exact duplicate of each keycap's top-face geometry instead of a floating rectangular plane, keeping square and wide images clipped to the real surface and aligned with the bevel. Aspect-preserving custom artwork retains its centered contain behavior.

✅ **Shipped** - Keycap pixel textures now disable transparent-edge mipmaps and clamp their outer texels, removing black texture bleed at angled views. Side-art meshes span the full base extent so the sprites' own 72% opaque silhouette supplies the taper exactly once, reaching the outer top corners without a second inset or dark vertical seams.

✅ **Shipped** - Royal-cream side sprites now use a cleaned warm edge ramp in place of the source artwork's near-black opaque outline, eliminating the compressed black stripe on end faces while retaining visible pixel bevel detail. Purple and charcoal side palettes keep their intended dark outlines.

✅ **Shipped** - Artwork-backed keycap shells now use the same unlit majority colors as their top and side sprites. Transparent side-sprite margins no longer expose a standard-lit backing face that turns black at oblique angles.

✅ **Shipped** - Royal-cream wall artwork now stretches vertically by a 4% overscan at each edge, overlapping the top/body junction to conceal residual seams. Purple and charcoal side artwork retains its original proportions.

✅ **Shipped** - Bundled Keyboard Workshop keycaps now use the squared front-wall sprite on both physical end faces. The triangular left/right atlas profiles were removed from rendering, so front, back, left, and right views all retain the same boxier side-panel treatment.

✅ **Shipped** - The bundled keycap side atlas uses the opposite front/back assignment in 3D to account for the atlas viewpoint convention.

✅ **Shipped** - Bundled Keyboard Workshop side sprites now retain their full silhouette instead of being tapered twice and partially hidden inside the solid keycap wall. Their overlays follow the keycap's base, shoulder, and top bevel rings, while left/right end artwork is selected by physical key depth so wide modifiers and the spacebar no longer crush or crop long-side images onto their short ends.

✅ **Shipped** - The embedded Blacksmith Workshop now removes its redundant top part shortcut strip and bottom key-group strip because those controls already live in the left rail. Its header uses the Blacksmith plaque without repeating the generic Workshop title, leaving a simpler workbench with one part navigator, one Inspector, and one compact camera/typing/history action bar.

✅ **Shipped** - The Keyboard Workshop camera now fits the complete rendered keyboard and case to the available 3D viewport for every full-board preset. It responds to narrow Blacksmith side-panel layouts, viewport resizing, and exploded view dimensions without cropping the model, while dedicated close-up presets retain their tighter framing.

✅ **Shipped** - The default Keyboard Workshop model now follows the AULA F75 key layout reference: an 81-key 75% arrangement with a top-right rotary knob, standard ANSI modifier widths, an 18 mm cap on a 19.05 mm pitch, and compact navigation and inverted-T arrow clusters. Row alignment is handled by cluster spacing rather than stretched keycaps.

✅ **Shipped** - The bundled purple-and-gold Keyboard Workshop skin uses dedicated front and back wall artwork instead of repeating each top crop on all walls. The squared front sprite is reused on both physical ends across the eight width classes required by the available layouts, preserving the sheet's bevels, gold corner accents, wide modifiers, and spacebar proportions. Custom uploaded full-wrap artwork retains its original wrapping behavior.

✅ **Shipped** - Keyboard Workshop keycaps now use one consistent AULA F75-inspired Cherry shape across every keyboard row. Wider modifiers and the spacebar extend the same shared footprint without changing its height, tilt, or bevel, and the Inspector no longer offers conflicting per-key shape choices.

✅ **Shipped** - The Keyboard Workshop now ships with the supplied royal-cream, purple, and charcoal pixel keycap set. Every physical key uses its own transparent top crop, including wide modifiers, navigation keys, arrows, and the decorated spacebar, while the rotary knob uses customizable 3D geometry. Existing saved builds follow the latest bundled source while custom uploads and intentionally removed artwork remain independent.

✅ **Shipped** - The Blacksmith Keyboard Workshop now uses a forge-bench layout inspired by the camp's pixel-art workshop: a dedicated title plaque, collection rail, central transparent 3D keyboard bench, and a parchment-style Inspector. Existing keyboard editing, testing, saving, and equipping controls remain available within the new layout.

✅ **Shipped** - The Blacksmith Workshop rail now uses clean button plates extracted from the supplied reference art: brown is the baseline for section, size, part, key-group, and preset controls, while the isolated violet plate is used for hover, focus, pressed, and selected states. Reference modal surrounds and baked dropdown arrows are excluded so live labels, icons, and chevrons remain accessible UI elements.

✅ **Shipped** - The Blacksmith selector panel and every nested control group now span the full available sidebar width. Its redundant My Keyboard title bar has been removed, while Back to Camp sits outside the sidebar in the shared interior toolbar and preserves the existing focus-return ref.

✅ **Shipped** - Blacksmith sidebar buttons now use larger touch targets, labels, icons, chevrons, padding, and row spacing across section headers, keyboard sizes, parts, key groups, and presets.

✅ **Shipped** - The Blacksmith footer now includes extracted pixel-art Save, Delete, and More buttons. Save persists the current build, Delete requires confirmation before replacing it with a fresh build, and More exposes Equip Keyboard and Export JSON without removing the primary camera, typing, and history controls.

✅ **Shipped** - Keyboard Workshop Test Typing keeps high-frequency keypress state separate from the persisted editor store and applies it directly to 3D refs, so keydown and keyup no longer cause React component renders. Keycap travel and RGB flare use a near-instant attack with a softer release, switch stems update only when their own pressed state changes, and scene lighting reads the current held-key count inside the render loop. A single low-latency audio context is reused across presses, browser defaults and duplicate/auto-repeat events are suppressed, and held keys are released on blur or mode exit for an immediate, reliable preview.

✅ **Shipped** - Keyboard Workshop now has Aula-style reactive RGB backlighting: every key keeps a subtle colored underglow and pulses brightly when clicked in the 3D preview or pressed in Test Typing mode.

✅ **Shipped** - The Camp Blacksmith now opens as a dedicated morning/evening forge interior with the full Keyboard Workshop directly overlaid on the scene. Its supplied PNG backgrounds crossfade after the evening artwork has loaded, follow the global Day/Night display mode, and remain visible through the transparent 3D keyboard viewport while controls retain a readable solid surface. The workshop fills the available interior height down to the screen edge. Back to Camp, Escape, and focus restoration match Pet Nursery and Mailbox.

✅ **Shipped** - Keyboard Workshop keycap edits now save immediately to the active local build, including intentional blank legends. Keycap side color, legend size, and material finish all update in the live preview.

✅ **Shipped** - The Keyboard Workshop is now part of Pawtype Studio. The new Workshop tab offers a live 3D keyboard editor with locally saved builds, test typing, part customization, and JSON export.

✅ **Shipped** - Keyboard Workshop now includes a configurator-style overview: default legends, a neutral premium build, keyboard-wide keycap and legend color controls, key search, bulk selection, visible build statistics, contextual Inspector labels, and key hover feedback.

✅ **Shipped** - Desktop Practice, Quest, Shop, and Learn now use viewport-locked page shells with the same inset shared HUD placement. Practice keeps its typing panel, companion art, and compact keyboard fully visible without browser-page scrolling; Quest, Shop, and Learn share the fixed document shell while preserving responsive scrolling on smaller screens.

✅ **Shipped** - Owned Shop doodads now appear as persistent decorations around the Camp scene, using the existing decor inventory as the placement source.

✅ **Shipped** - Mystery Eggs in the Pet Shop now spend coins to hatch one randomly selected, currently unlocked companion that the player does not already own.

✅ **Shipped** - The Camp Blacksmith is now a functional coin sink with persistent forge upgrades for combo, companion-care, and keyboard cosmetics.

✅ **Shipped** - Daily lesson goals now form a claimable Daily Quest: completing the target grants 75 coins and 20 active-companion XP once per day, with claim state persisted locally.

✅ **Shipped** - Pet Nursery's Companions tray now uses the supplied pixel-art \`companion-button.webp\` asset. The native image button preserves its open/close behavior, accessible state, keyboard focus, and live companion-count badge, which reuses the HUD notification indicator styling.

✅ **Shipped** - Gamification pass: Lessons page gained a daily-goal ring with a persistent daily-streak counter, and every lesson clear now floats an XP/coin/pet-XP burst overlay. Pet Nursery gained a live mood chip (Happy → Content → Hungry) that decays over time, feeding the active pet or petting the wandering companion refreshes the mood, and a "Buy Snack" fallback lets players spend coins for a treat when the pantry is empty. The wandering pet also gives a small pet-XP nudge on interaction with a cooldown.

✅ **Shipped** - Camp interior toolbars now share the main HUD’s responsive width and outer margin. The illustrated Back controls in Cabin, Pet Nursery, and Mailbox align with the header edge at every viewport size.

✅ **Shipped** - The shared HUD uses a supplied pixel-art frame from the top edge of every header. Header and frame move together with a consistent 5px top offset, stay pinned while a page scrolls, retain a responsive mobile fit, and never block header navigation or controls.

✅ **Shipped** - Camp interior pages now use the supplied pixel-art Back artwork through one shared, accessible button component. Cabin, Pet Nursery, and Mailbox preserve their Back to Camp action, keyboard focus treatment, Escape return flow, and focus restoration.

✅ **Shipped** - The Camp Mailbox now opens as its own morning/evening interior. Its stacked artwork crossfades safely after the evening scene loads, follows the global Day/Night display mode, and supports Back to Camp, Escape, and focus restoration like the Pet Nursery.

✅ **Shipped** - All project PNG assets now have pixel-identical, lossless WebP replacements. Runtime image paths use WebP for the login screen, authentication artwork, Awards wing buttons, and leaf sprites; the original PNGs were removed after verification.

✅ **Shipped** - Login title-screen leaves now include a stronger mix of small distant leaves and larger foreground leaves, creating clearer depth while they fall.

✅ **Shipped** - The HUD notification dropdown uses a compact standard popover with clear title, message, metadata, and action hierarchy for both empty and populated notification states.

✅ **Shipped** - Pet Nursery now presents its egg row as a compact, mid-ground Nest Stage: eggs are enlarged a further 20%, individually seated in their nest cradles, and spaced 20% farther apart. Nests remain 30% larger than the compact baseline, the lesson ramp is enlarged 50%, and the whole set remains pushed back into the hall for stronger perspective. The nursery overview reads as small carved wood plaques.

✅ **Shipped** - All public raster assets were audited for file format, dimensions, size, and duplicates. The oversized Awards and Pet Nursery scene assets were recompressed with conservative WebP settings, while already-efficient and transparency-sensitive artwork was preserved.

✅ **Shipped** - The Awards wing selector now uses extracted transparent PNG button assets for every cream inactive and colored active category state. The source art preserves matching icon, label, marker, and pixel-bevel layouts; hover previews a pale version of the corresponding active asset.

✅ **Shipped** - Awards badge halos now use a layered, masked radial fade so the glow feathers naturally into the shelf instead of ending as a solid circular disc.

✅ **Shipped** - Standard Awards shelf badges are now 30% larger across every museum wing, while the dedicated largest relic keeps its existing showcase scale.

✅ **Shipped** - The game now deters casual artwork downloads by blocking the browser context menu, image dragging, and common save/source shortcuts. Static browser assets cannot be made fully private after download; sensitive future artwork should be served through authenticated, expiring URLs.

✅ **Shipped** - The Awards museum uses a compact banner with enlarged badge display for clearer collection browsing. Its oval pedestals now use feathered, glowing edges instead of solid discs while preserving the surrounding fantasy hall in view.

✅ **Shipped** - All CSS light-ray overlays were removed. Awards now relies solely on the lighting painted into its background artwork.

✅ **Shipped** - The app now suppresses accidental image dragging and text selection across the game UI. A text cursor and selection remain available only inside editable fields, while interactive controls keep their pointer cursor.

✅ **Shipped** - The centered PawType logo on the Login title screen is 50% larger for stronger visual prominence.

✅ **Shipped** - The Login title screen now has six reference-inspired pixel leaf variants falling continuously from the left tree. Their smaller sizes, spawn positions, wind drift, tumble, and timings vary so the canopy never has an empty pause; alternating depth layers pass behind and in front of the logo and Play button, with reduced-motion support.

✅ **Shipped** - The Login page is now a clean title screen using its dedicated painted background and centered combined PawType logo. The Play button opens the account-access modal without leaving the page.

âœ… **Shipped** - Duplicate artwork was consolidated: Cozy Campsite uses one shared scene asset for its preview and final quest node, while the identical Sunrise Camp backdrop now reuses the Morning asset.

âœ… **Shipped** - The full-screen Login page UI now lives in \`src/components/login/\`; shared sign-in controls remain in \`src/components/auth/\` because they are also used by Header and Settings.

âœ… **Shipped** - Shared brand art now uses compact WebP files: the emblem is named \`emblem-logo.webp\`, with matching \`wordmark-logo.webp\` and \`combined-logo.webp\` variants for future page and marketing use.

âœ… **Shipped** - The Learn route now owns its page-specific UI in \`src/components/lessons/\`, separating the lesson list, lesson-results modal, and star display from shared gameplay components.

âœ… **Shipped** - Public artwork is now arranged by consuming page: Adventure nodes and scenes, Shop theme previews, Camp art, Awards scenes and badges, plus shared icons and brand assets. Runtime paths were updated with the move so the visual output is unchanged.

âœ… **Shipped** - Unreferenced Pet Nursery PNG source duplicates were removed after verifying matching WebP runtime assets, reducing the project's raster payload by 6.16 MB without changing the rendered artwork.

âœ… **Shipped** - Modal layouts now use one code-first pixel RPG size scale: Small (420px), Medium (680px), Large (760px), Extra Large (1040px), and a 1280px game-screen variant reserved for major result and story moments. Modal heights remain content-led with viewport-safe scrolling.

✅ **Shipped** - The Pet Nursery foreground light-ray overlay was removed, leaving the illustrated room art unobscured in both display modes.

✅ **Shipped** - The Awards museum no longer uses diagonal CSS window-light rays; its lighting comes entirely from the painted hall artwork.

✅ **Shipped** - Pet Nursery nests and its ramp now gain a subtle cool-white glow at night, with small randomly sized and drifting white sparkle orbs inspired by the Awards badge display.

✅ **Shipped** - Pet Nursery's ambient sparkle orbs and soft asset glow remain visible with the morning backdrop as well as at night.

✅ **Shipped** - Pet Nursery eggs now share their nest's vertical slot alignment, use individual egg-only horizontal and vertical adjustments, and every nest-and-egg pair shares a generously sized grid gap.

✅ **Shipped** - Every Pet Nursery egg now uses a separately centered circular interaction target, so the clickable and keyboard-focus region follows the visible egg rather than its transparent artwork canvas.

✅ **Shipped** - The full Pet Nursery egg controls, including their sprites and centered interaction targets, now sit 30% farther right without moving their matching nests.

✅ **Shipped** - Pet Nursery now exposes an individual horizontal pair position for all five nest-and-egg pairs, allowing their gaps to be adjusted independently.

✅ **Shipped** - The fifth Pet Nursery nest-and-egg pair now uses its independent pair position to sit 18% farther right.

✅ **Shipped** - Pet Nursery eggs now have soft Awards-style colored ambient orbs behind their pixel art, with brighter glow for ready, hovered, and focused eggs.

✅ **Shipped** - Pet Nursery egg orbs are aligned to the visual centers of their sprites, and eggs now share the small night-time sparkle orbs used by the nests and ramp.

✅ **Shipped** - Pet Nursery now exposes individual horizontal and vertical placement values for all five eggs, allowing each egg to be adjusted without moving its nest.

✅ **Shipped** - Camp skies now schedule randomized shooting stars from twilight through pre-dawn. Every meteor receives a different wait time, start position, path, speed, and glowing trail length instead of replaying one fixed animation.

**Shipped** - Pet Nursery now follows the global light/dark display mode used by Awards, showing \`pet-nursery_morning.webp\` in light mode and a WebP-converted \`pet-nursery_evening.webp\` in dark mode.

✅ **Shipped** - Locked Lessons content now uses a higher-contrast stone palette in light mode. Disabled chapters, path steps, cards, artwork, and actions remain clearly identifiable as unavailable while their labels and lock controls stay readable.

✅ **Shipped** - The Pet Nursery now keeps its label-free, spaced egg-and-nest row on the left, with every egg visually centered over its nest and both layers moved down together. All nests and eggs are enlarged by 20%, with the tier-two nest and tier-five egg retaining their additional tier upgrade. Its decorative WebP ramp sits on the right, shifted 55% left and 30% upward, and enlarged by 70% from its prior size. Ramp and egg assets retain their original colors, while eggs, nests, and ramp use pronounced stepped pixel-art shadows.

✅ **Shipped** - The blacksmith now uses the camp's shared warm ground halo, matching the other interactive buildings while keeping its forge visually lit.

✅ **Shipped** - The Camp home screen now has a soft background-only vignette. It darkens the outer edges of the full painted world and atmosphere without layering over buildings, HUD controls, or open page content.

✅ **Shipped** - Pet Nursery nests and eggs now render in separate positionable layers. The egg collection can move together, while every egg keeps independent horizontal and vertical placement without moving its nest.
âœ… **Shipped** - Camp lit buildings now use one shared warm halo system. The campfire and reward-ready wagon reuse the same ground-glow recipe as the rest of the scene, so boosted light effects stay readable without looking like a separate bloom style.

âœ… **Shipped** - Pet Nursery copy is now pared back, locked eggs stay fully solid with no faded opacity, the Next Unlock badge stays solid, egg nest spacing is tighter across the stage, each nest now supports its own vertical offset, and clickable eggs open the hatch flow directly from the nursery. The centered nursery row scales down with the viewport so all five nests remain visible, while unavailable nests are non-interactive and each egg has a subtle staggered hover-and-wobble treatment.

âœ… **Shipped** - Camp styles are now split out of the old monolithic \`camp.css\` file into \`src/styles/camp/scene.css\`, \`nursery.css\`, \`modals.css\`, and \`animations.css\`, with \`src/styles/camp/index.css\` as the ordered entrypoint.

✅ **Shipped** - The Lessons quest log now has a dedicated high-readability dark palette. Chapter headers, egg milestones, progress tracks, lesson descriptions, reward tiles, current actions, path nodes, focus rings, and locked states use clearer contrast while preserving the pixel RPG hierarchy.

✅ **Shipped** - The active top-HUD navigation tab now keeps the same label color as inactive tabs, removing the white-text state while preserving the highlighted button background and glow.

✅ **Shipped** - Adventure and lesson result dialogs now use the shared modal behavior and consistent action iconography. Adventure results gain dialog semantics, backdrop dismissal, Escape handling, trapped/restored focus, and bounded responsive scrolling while retaining their layer above the quest scene; lesson results use a semantic heading, announce asynchronous coach feedback, expose the earned star count, and replace placeholder glyphs with clear retry/next/back icons.

✅ **Shipped** - Camp building dialogs now use consistent compact and wide modal layouts, semantic headings, shared responsive spacing, and bounded mobile scrolling. The Pet Nursery now opens as a dedicated full-page camp interior with an unboxed, floor-anchored egg roost, a viewport-locked layout, and compact overlay companion controls, while the Supply Wagon still announces reward progress, disables its chest after activation, and clears pending animation timers when closed.
✅ **Shipped** - Camp building hover labels now raise above adjacent sprites while active, preventing nearby art like the mailbox from covering floating text over entries such as the Pet Nursery.

✅ **Shipped** - Camp building interactions now separate decorative scenery from real buttons, use consistent keyboard focus and accessible names, and keep the background scene inert while the Cabin inventory is open. Cabin navigation uses the shared button style, supports Escape, restores focus to the Cabin on return, and stacks cleanly on phones; the library sprite is consistently identified as the Training Board it opens.

✅ **Shipped** - HUD XP, pet XP, Shop collections, lesson chapters and egg milestones, inventory milestones, Adventure completion, boss health, stage timing, and typing completion now use one accessible pixel progress component. Every bar clamps invalid values, reports its current value and maximum, supports consistent sizes and semantic color tones, and remains legible in high-contrast mode.

✅ **Shipped** - Selectable Shop cards now share consistent hover, selected, focus, and high-contrast states. Pet cards use a dedicated keyboard-accessible details control instead of a clickable container with nested actions, while favorites, equipped pets, and active theme sets expose their pressed state to assistive technology.

✅ **Shipped** - Ordinary text inputs, native selects, and checkbox fields now share one pixel form-control system with consistent sizing, theme-aware surfaces, labels, hover, disabled, invalid, keyboard-focus, and high-contrast states. Pet filters use fully clickable native labels, while hidden typing capture inputs remain visually untouched.

✅ **Shipped** - Shop section tabs, pet/theme/doodad category filters, and Library document tabs now share one responsive pixel choice bar. Tabs connect to their active panels, filters expose pressed states, and all variants use consistent selected, hover, focus, high-contrast, and arrow-key behavior without inline styling.

✅ **Shipped** - Shop, Settings, and Library tab panels now use the same subtle fade-and-rise transition on each switch, softening abrupt layout changes and masking panel-to-panel visual differences without overriding reduced-motion preferences.

✅ **Shipped** - The shared HUD now adapts from the full desktop profile/navigation layout to compact icon-first tablet controls and a two-row phone layout. All six destinations remain visible without horizontal page overflow, while profile and notification controls expose accessible labels, focus states, current-page state, and expanded-menu state.

✅ **Shipped** - Settings now has its own responsive stylesheet and stable two-column desktop layout that stacks cleanly on smaller screens. General and Library use accessible keyboard-navigable tabs, world/display/effect controls expose their selected states, and account actions resize consistently without depending on login-screen styles.

✅ **Shipped** - Standard buttons now share one pixel-game component and consistent primary, secondary, destructive, ghost, link, size, disabled, and keyboard-focus states. HUD menus, Settings account actions, notifications, world switching, Shop purchases, typing controls, and modal actions now use that shared foundation.

✅ **Shipped** - The global HUD day/night toggle is back. The header and Settings now use one synchronized saved theme choice, so display mode stays consistent across the app.

✅ **Shipped** - Camp now follows the global Day/Night toggle without losing its local-clock behavior. Night mode forces the campsite into night only when the real local time is still daytime, Day mode forces a morning campsite only when the real local time is already night, and matching toggle/time combinations keep the normal real-time scene progression.

✅ **Shipped** - Awards museum shelf art, badges, and pedestal platforms now move downward together by 30% as one aligned exhibit group.

✅ **Shipped** - Awards museum shelf group was moved 5px lower while keeping badge and pedestal alignment locked inside the shelf.

✅ **Shipped** - Adventure quest stage typing now uses the clipped hidden capture input, removing the visible raw textbox from quest level nodes while preserving keyboard focus.

✅ **Shipped** - Awards artifact spotlight circles were softened into wider fading ambient glows so the shelf alcove highlights are less obvious.

✅ **Shipped** - Legendary Awards artifacts no longer render the translucent square frame behind the badge; only the relic, glow, sparkles, and fixed pedestal remain.

✅ **Shipped** - Challenge Wing banner progress text and pips now have a dedicated 2px lower alignment without affecting the other Awards wing banners.

✅ **Shipped** - Awards museum shelf, badge artifacts, legendary relics, and fixed pedestal platforms were scaled up together while preserving the normalized shelf-square alignment.

✅ **Shipped** - Awards shelf pedestal platforms were removed from the badge conjure and vanish animations; only the badge frame now lifts, pops, and disappears while the platform stays fixed in its shelf square.

✅ **Shipped** - Awards shelf platforms were rebuilt around fixed normalized cubby anchors so each pedestal sits exactly centered in its shelf square and stays the same size for locked, unlocked, normal, and legendary badges.

✅ **Shipped** - Awards outgoing banner pull-up endpoint was raised farther above the viewport for a cleaner complete retraction.

✅ **Shipped** - Awards incoming banner drop now starts farther above the viewport for a stronger lowered-from-the-rafters effect.

✅ **Shipped** - Awards incoming banner now starts from the same off-screen rafter point where the outgoing banner finishes, making the pull-up and pull-down feel connected.

✅ **Shipped** - Awards incoming banner drop now starts exactly at -150px for a cleaner controlled descent.

✅ **Shipped** - Awards banner retraction now travels far above the viewport so the old banner fully clears the scene before the next one drops.

✅ **Shipped** - Awards wing banners now animate like physical hanging cloth: fast chain-pulled retraction, a short anticipation pause, springy drop-in, squash/stretch landing, pendulum settle, and restrained landing sparkles without fading the banner PNG.

✅ **Shipped** - Awards banner pull-up timing was tightened into a faster game-style snap with a brief anticipation dip before the next banner drops.

✅ **Shipped** - Awards wing banner switching is now sequential: the old banner pulls up first, then the new banner pulls down without opacity fade effects.

✅ **Shipped** - Awards wing switching now uses an overlapping transition: the outgoing banner pulls upward, the incoming banner drops down, and badge relics vanish/reappear with staggered magical pop effects while the platform grid remains fixed.

✅ **Shipped** - Awards shelf layout now uses a reusable normalized upper/lower positioning grid with bottom-center platform anchors, so badges, platforms, spotlights, hover motion, and tooltips all originate from the same shelf coordinates.

✅ **Shipped** - Awards badge frames now anchor to the pedestal baseline instead of using independent idle float animation, keeping relics and platform bases perfectly aligned on the shelf.

✅ **Shipped** - Awards artifact bases were retuned again with tighter badge-to-platform spacing, smaller shelf-footprint ellipses, and stronger rim/contact shading so relics look seated instead of floating.

✅ **Shipped** - Awards artifact pedestal circles were flattened, lowered into the shelf planks, and layered under the badges so each relic reads as properly seated on the museum shelf.

✅ **Shipped** - Awards badge artifacts were enlarged again, and hover motion now affects only the badge frame so each pedestal platform circle stays fixed on the shelf.

✅ **Shipped** - Awards museum shelf and badge artifacts were enlarged while the wing banner and its progress overlay were reduced so the shelf reads as the primary exhibit.

✅ **Shipped** - Awards museum banner and shelf were moved higher together so the exhibit fits better in the viewport at normal browser zoom.

✅ **Shipped** - Awards banner collection count and progress pips were enlarged and shifted right so the active wing progress reads clearly inside the banner artwork.

Planned features and high-potential additions to expand the game.

---

## ✅ Shipped

### 🏕 Camp — Living Home Base
✅ **Shipped** - The Camp (Hub) is no longer a dashboard of cards. It is now a living pixel campsite scene with interactive buildings, a wandering pet, ambient particles, and time-of-day lighting. The blacksmith uses the shared warm ground halo so it matches the other interactive buildings. \`CampScene\` now swaps in dedicated painted background art for morning, afternoon, and evening/night directly from \`public/camp-scene\`, then places the library, cabin, tent, supply wagon, nursery, mailbox, blacksmith, and campfire to match the illustrated campsite composition. Buildings — Painter's Tent (themes), Pet Nursery, Supply Wagon (daily reward chest with shake/burst animation), Training Board (stats), Cabin (unlocks at Lv 20), Mailbox (Lv 10), Windmill (Lv 35) — open modals via click. The active pet wanders the ground autonomously and jumps on rewards. Ambient particles change per theme (butterflies in the meadow, petals under sakura, fireflies at night, stars in space, etc.). Selecting a theme in the tent triggers a scene crossfade. Camp visibly evolves through 7 progression tiers at levels 1/10/20/35/50/75/100, adding fence → cabin → windmill → stone paths → statues → sanctuary as the player levels up.


✅ **Shipped** - Shared page margins now use explicit app shell/view wrapper classes, and Shop, Awards, and Train have responsive layout safeguards so cards, filters, badge grids, and typing panels keep consistent gaps across desktop and smaller windows.

✅ **Shipped** - Camp buildings now share a soft sprite glow for readability across morning, afternoon, evening, and night scenes, with ready buildings keeping a stronger pulsing reward glow.

✅ **Shipped** - The Camp tab now lets CampScene own the full page box directly. Its background and buildings live inside a responsive 16:9 coordinate plane, so building sprites scale with the viewport while keeping their anchor positions tied to the painted scene.

✅ **Shipped** - CampScene's full-page layout now uses a concrete viewport-height flex shell so the scene cannot collapse to an empty Camp tab.

✅ **Shipped** - The Camp scene now starts at the very top of the body and runs behind the shared HUD, with the HUD overlaid instead of reserving blank space above the scene.

✅ **Shipped** - Camp now uses a reusable local-clock day/night renderer. The terrain and building layout stay static while sky, sun, moon, stars, constellations, lighting tint, water highlights, and particles interpolate continuously across the full 24-hour cycle, with the global Day/Night toggle able to force morning or night only when it would otherwise conflict with the current real local time.

✅ **Shipped** - The day/night renderer now updates on minute boundaries with long linear atmosphere transitions and a locked static environment layer, preventing subtle image shimmer while preserving the local-clock cycle.

✅ **Shipped** - The Camp day/night schedule was realigned to the standard parts of the day (Britannica/Wikipedia): night runs 21:30-04:30, pre-dawn 04:30-06:00, sunrise 06:00-07:00, morning 07:00-11:00, noon 11:00-13:00, afternoon 13:00-17:00, sunset/dusk 17:00-19:00, and evening 19:00-21:30. The eight scene backgrounds and their matching artwork stay mapped to the closest segment, so the output image at each real local hour now matches the part of day it actually represents.

✅ **Shipped** - The campfire sprite anchor was tuned to sit slightly lower and render 10% smaller, so the center of the campsite reads cleaner against the painted firepit art.

✅ **Shipped** - Camp building anchors and sprite scales were retuned against the full campsite reference image so the cabin, library, tent, wagon, nursery, mailbox, blacksmith, and campfire align with the visible path intersections and clearings on the current full-page scene.

✅ **Shipped** - The outdoor Bag sprite was removed from the camp map. Inventory now lives inside the always-available Cabin entry as a dedicated in-camp Bag page with a Back to Camp control, leaving that outdoor map location available for future home customization.

✅ **Shipped** - Camp building sprites now use reduced fixed pixel widths instead of viewport-fluid sizing, keeping the map objects from growing oversized when the browser window changes.

✅ **Shipped** - The Camp world plane is now top-aligned to the viewport, so the scene image begins at the top of the screen and all building anchors stay locked to that same shifted artwork.

✅ **Shipped** - The Train page no longer shows the fullscreen control, and its timer/reset toolbar now renders at full opacity above the typing scene overlay.

✅ **Shipped** - Awards badge artwork now renders larger with roomier responsive grid cells so the collection page feels more readable and closer to the pixel badge art scale.

✅ **Shipped** - The Awards tab now swaps between \`public/awards/awards-background-morning.webp\` and \`public/awards/awards-background-night.webp\`, and its full museum ambience follows the global day/night toggle with warmer morning light versus cooler night glow.

✅ **Shipped** - The Awards collection now renders as gamified trophy shelves, with each badge category displayed on a wooden shelf and each badge shown in its own collectible slot.

✅ **Shipped** - The Awards trophy cabinet now aligns to the shared HUD width and uses tighter shelf rows so the collection feels integrated with the hall scene instead of floating as oversized cards.

✅ **Shipped** - The Awards page has been refactored into a single-wing fantasy museum experience using the provided museum background, shelf art, and wing banner assets. Awards now sit as positioned collectible artifacts with hover plaques, locked exhibit states, legendary treatment, progress runes, and wing navigation.

✅ **Shipped** - The Awards museum now relies on the main app-shell background only, removing the duplicate in-component background layer that made the hall image appear constrained beneath the HUD.

✅ **Shipped** - Awards museum progress now lives inside the active wing banner, the separate bottom progress panel was removed, and the Awards view shell now spans the full body so the shelf can sit lower against the museum floor artwork.

✅ **Shipped** - Awards museum banner, shelf, artifacts, and wing controls were scaled down for normal 100% browser zoom so the page reads as a full scene instead of oversized foreground UI.

✅ **Shipped** - The Awards wing banner was reduced again and pulled upward so it reads as a background hanging banner rather than a large foreground panel.

✅ **Shipped** - Awards wing controls were moved from the bottom toolbar into a vertical museum sidebar on desktop, keeping the shelf and banner area clear.

✅ **Shipped** - The Awards museum now fills the viewport behind the HUD with overflow hidden, and the banner/shelf stage was lifted so the page does not need to scroll at normal desktop zoom.

✅ **Shipped** - Awards wing banner overlay was simplified to only show collection count and progress pips, and the banner/shelf group was lifted slightly higher.

✅ **Shipped** - Awards banner collection count and progress pips were moved lower inside the banner artwork for better alignment with the empty center space.

✅ **Shipped** - Awards museum dark overlay was removed so the hall background artwork keeps its original brightness.

✅ **Shipped** - Awards shelf now casts a subtle clipped mirror reflection onto the museum floor using the existing shelf artwork.

✅ **Shipped** - The Stats page now has explicit layout classes for summary cards, speed history, mistake heatmap, and recent sessions so the analytics view keeps normal spacing and full-width cards.

✅ **Shipped** - The main app footer was removed, and the large page surfaces for Shop, Awards, Stats, and Adventure world lists are now layout-only wrappers with no added background color, border, or shadow so the themed page backdrop shows through.

✅ **Shipped** - The Train page capture input is now hidden with a dedicated CSS class, removing the raw text field below the KPI row while preserving keyboard focus and typing behavior.

### Adventure Scene Intro Timing Fix
✅ **Shipped** - The adventure quest gameplay card no longer reuses the immediate \`animate-pixel-pop\` utility during the full-scene intro. Its dedicated delayed \`card-pop-in\` sequence now stays hidden while the biome artwork fades in, holds for the showcase, and dims before the typing card appears.

### Pixel RPG Modal Refresh
✅ **Shipped** - Practice results, compact lesson results, lesson popups, pet room, egg rewards, and wider adventure quest overlays now share a reusable parchment-style pixel modal system with layered frames, corner ornaments, visible X controls, Escape support, stronger close behavior, safer close-button spacing, and a premium cozy RPG presentation.

### Practice Toolbar Controls
✅ **Shipped** - Practice timer pills now switch between 15s, 30s, and 60s correctly, and the new-test control uses a proper pixel reset icon instead of placeholder text.

### Adventure Quest Scene Flow
✅ **Shipped** - Adventure quest typing now stays as a dedicated gameplay scene. Quest clear and fail states fade the live stage into the background, trigger biome-specific celebration or failure particles, and open a separate foreground results card instead of mixing victory UI directly into the typing surface. The live quest HUD now prioritizes the typing panel, keeps the stage image in a compact header card, and moves WPM/accuracy/time/goal into a short stats row below the words. Victory celebrations now use a world-aware particle engine with denser top-spawned particles, one signature confetti design per theme for a cleaner silhouette, reusable sprite mapping, and softer failure effects. Quest typing content now loads coherent world-and-node-aware route passages at stage start/retry instead of repeating tiny seed word pools.

### Theme-Aware Practice Confetti
✅ **Shipped** - Perfect practice runs now use the same world-aware celebration language as adventure stages: dense emoji particles burst outward from behind the results modal in staggered waves, use one signature emoji from the current theme for a cleaner burst silhouette, drift with a slower natural fall, and remain behind results modals for readability.

### 📚 PawType Curriculum (13 Units)
✅ **Shipped** - The Lessons view is now a full 13-unit curriculum with 90+ lessons: Getting Started, Top Row, Bottom Row, Capital Letters, Punctuation, Numbers, Symbols, Common English Words, Sentences, Paragraphs, Speed Building, Real World Typing, and Advanced Challenges. Each unit tracks progress, unlocks the next after completion, and expands into an accordion of lessons with curated word banks, difficulty (beginner -> master), target WPM, and target accuracy. Completion persists to localStorage and lessons can be replayed. Lesson cards now use a roomier three-column quest-card layout with larger status art, vertical lesson details, collectible reward badges, grouped progress actions, and no separate mascot callout column.


### Smart Coach Engine
✅ **Shipped** - Post-run coaching now analyzes recent session history from IndexedDB to detect trends (WPM up/down/flat, accuracy changes, combo consistency). Generates contextual insights referencing your improvement over time — spotting plateaus, praising streaks, and warning about accuracy dips. No external API required.

### Pattern Analyzer
✅ **Shipped** - Tracks per-character accuracy, bigram mistake patterns, and keyboard zone heat across all saved sessions. Identifies weak keys, problematic letter sequences, and hand zones. Feeds into the coach for targeted recommendations like "your left home row zone needs work" or "the 'th' sequence trips you up."

### Dynamic Passage Generator
✅ **Shipped** - Bigram (2-word) Markov chain generator that creates unique, natural-sounding typing passages per world. Uses expanded semantic word pools (80+ words per world with nouns, adjectives, verbs, prepositions) and 15 hand-crafted seed sentences per world for training. Sentence templates provide varied punctuation and structure. Integrates with the Pattern Analyzer to boost weak-spot characters. Falls back gracefully to the existing rotation-based word pool system.

### Adaptive Difficulty & Recommendations
✅ **Shipped** - Adventure stage WPM goals now adapt to each player's skill level based on recent session history (up to 15 sessions). Dynamic goal calculation adjusts Easy/Normal/Hard/Boss targets to match the player's average WPM. Hub dashboard shows a daily AI suggestion (speed drill, accuracy focus, weak key practice, warmup, or steady pace tip) based on session trends and pattern analysis. Progress summary tracks WPM changes, accuracy trends, and consistency over the last 30 sessions.

### Smart Mascot + Pixel Cloud Overlay
✅ **Shipped** - The mascot now references live session performance: combo streaks, weak keys, and mistake counts. Generates contextual lines like "40 keys in a row!" or "Watch the 'e' key — it's your most missed." A CSS pixel-art cloud overlay floats in the world-art panel with gentle animation. Both systems are 100% local.

### Cozy Campsite Adventure Refresh
✅ **Shipped** - The former Autumn Cottage world is now Cozy Campsite, with updated theme copy, shop and docs text, campsite-flavored typing prompts, ember ambience, and a dedicated five-node adventure art set wired using the same filename pattern as the other worlds.

### Adventure Replay Rules
✅ **Shipped** - Completed adventure stages can still be replayed for practice, but replay clears no longer grant extra XP or coin rewards. Completed node cards hide the reward strip, and cleared quest popups now stay open until the player exits with \`Esc\` or the \`X\` button.

### 📖 In-App Documentation Library
✅ **Shipped** - browsable from inside the Settings page (Library tab) with full markdown rendering, table of contents, and 5 doc sections (Achievements, Themes, Pets, Economy, Future Addons).

### 🔐 Cloud Sync & Auth
✅ **Shipped** - Sign-in/sign-up form with Supabase auth (email/password), Google and Facebook OAuth entry points, PKCE browser auth flow, server-backed auth cookies, safer callback redirects, stronger signup password rules, cloud save/load of game state on login/logout, and automatic 2-second debounced cloud sync while playing. Accessible from Header profile menu and Settings -> Account.

✅ **Shipped** - Supabase auth/cloud save now treat deployment env setup as optional at runtime: missing or placeholder \`SUPABASE_*\` / \`VITE_SUPABASE_*\` values no longer crash the app shell, and the auth callback shows a direct setup error instead.

### 🕹 Pixel Login Gate
✅ **Shipped** - The account-access modal now uses the supplied parchment save-file frame and illustrated log-in, sign-up, create-account, social, demo, and close controls while preserving the live email/password fields and authentication flows.
✅ **Shipped** - Dedicated full-screen pixel-art login page before the main game, with Google and Facebook OAuth entry points plus a local demo account mode for instant access without cloud sync. The title-screen backdrop uses the cozy sky, fluffy pixel clouds, sun, stepped mountain and hill layers, twinkles, and drifting leaves.

✅ **Shipped** - The save-file gate now has a clearer account panel with an explicit return-to-title control, stronger visual framing, focused keyboard states, responsive spacing, and concise save-sync assurances for a more polished first entry point.

### 🗺 Adventure Node Pixel UI Polish
✅ **Shipped** - Adventure node cards were polished for clearer stage states and rewards, and tab button labels stay contained inside their pixel button plates on compact layouts.

### 🗺 Quest World Scrolling
✅ **Shipped** - The desktop Quest map now scrolls inside its viewport-sized content area, so every themed world and its stages remain reachable while the shared HUD stays fixed in place.

### 🧭 HUD Layout Polish
✅ **Shipped** - The top HUD now uses a single-row desktop layout with a wider main navigation strip, shorter nav button labels, and a redesigned profile card with a framed pet tile, level badge, HP-style progress bar, darker outline treatment, no dropdown button, a simplified utility area focused on coins plus notifications, larger spacing before the main page content, and a wider shared content shell for every tab view.

### 🐾 Pet Room
✅ **Shipped** — A dedicated modal to see your active pet larger, interact with it, feed treats, and view evolution progress. All pets you own appear in a row with active-pet highlighting.

### Blacksmith Workshop Hanging Menu
✅ **Shipped** — The in-camp Blacksmith Workshop now uses a transparent, reference-aligned hanging sidebar with a carved WORKSHOP plaque, iron chains, eleven separate wooden part buttons, a single violet active state, gold pixel icons and diamond markers, visible row gaps, and a purple paw pennant. The standalone Workshop keeps its existing utility sidebar.

### Blacksmith Workshop Footer Toolbar
✅ **Shipped** — The embedded forge now uses a compact, reference-aligned wooden control rail containing only keyboard-size, vertically stacked part, key-group, and preset buttons. Selecting a part updates its wood-framed parchment Inspector on the right, while the compact action footer stays beneath the central keyboard canvas. The embedded My Keyboard / Blacksmith Workshop / Save and Equip header is removed so the forge opens directly on the editor; the standalone Workshop keeps its original header and separate panels.

✅ **Shipped** — The forge now has a compact wooden footer mounted beneath the central keyboard canvas so the left selector and right Inspector continue uninterrupted to the bottom of the workbench. Its six asset-driven controls use equal proportional slots and scale together responsively; ISO and orthographic FRONT views retain their selected state, RESET restores the straight centered Typing camera and zoom without touching customization, TEST TYPING stays the purple primary action, and history-aware UNDO/REDO stay aligned at the right.

✅ **Shipped** — The embedded forge now keeps a responsive, safe-area-aware margin below the complete workbench, preventing the lowest action bar and Inspector controls from touching or being clipped by the viewport edge.

---

## Medium Term

### 🎮 Multiplayer Typing Races
Real-time races against other players (or ghosts of past sessions). First to type the passage fastest with highest accuracy wins.

### 🧪 Custom Practice Generator
Pick specific characters, words per minute target, or difficulty. The AI generates a custom lesson targeting your weak spots.

### 🎵 Soundtrack Per World
Each world gets a unique lo-fi / ambient soundtrack that plays during typing. Volume slider, disable option.

### 📊 Advanced Stats Overlay
Click any stat on the results screen to see a 30-day trend line. Track your WPM, accuracy, and combo growth over time.

### 🏅 Seasonal Events
Time-limited events with exclusive badges (Spring Festival, Summer Splash, Harvest Hero, Winter Wonder, Anniversary).

---

## Long Term

### 🌟 Social Features
- Friend codes and leaderboards
- Typing parties (group sessions)
- Mentor system (experienced players help beginners)
- Profile pages with badge showcases

### 🌍 Community Worlds
A workshop where players can create and share their own themes:
- Upload a background image
- Pick 4 swatch colors
- Choose ambient effect type
- Set HUD decoration
- Share with a share code

### ⚔️ Adventure Expansion
- Procedurally generated stages (endless mode)
- World bosses with raid mechanics
- Guilds with shared progress
- Seasonal adventure ladders

### 🧬 Pet Breeding & Fusion
Breed two pets to create hybrid offspring with combined traits. Fusion system to create ultimate legendary pets.

### 💎 Premium Battle Pass
Seasonal pass with exclusive cosmetics, badges, and pets. Free track always available, premium track with one-time purchase.



---

## Technical Debt & Polish

- **Modal focus trap** ✅ Done — Tab cycling, previous focus restore, Escape via ref (stable handler)
- **Reducer side-effects** ✅ Done — \`persistence.clear()\` moved out of reducer into effect with ref flag
- **useEffect dependency storms** ✅ Done — Escape handler uses ref, word generator uses ref to break render cycle
- **CSS !important cleanup** ✅ Done — Replaced with specificity increases (header, login-screen)
- **Type-safety bypasses** ✅ Done — Replaced \`as unknown as Record\` casts with cleaner patterns
- **Dead code removal** ✅ Done — Removed \`ollama.ts\`, \`BiomeParticleEmitter\`
- **ai/ → engine/ rename** ✅ Done — Directory renamed, all imports updated
- **Cloud sync → React Query** ✅ Done — \`loadGameState\` / \`saveGameState\` migrated from manual \`useEffect\` + debounce to \`useQuery\` / \`useMutation\` with cache dedup and status tracking. Router QueryClient has default \`staleTime\` and \`refetchOnWindowFocus\` config.
- **Offline support** - full PWA with service worker caching
- **Accessibility pass** - screen reader support, high contrast mode, keyboard navigation audit
- **Mobile responsive** - typing on mobile with virtual keyboard
- **i18n** - localization for multiple languages
`;
