export const FUTURE_DOC = `# Future Addons - Roadmap & Ideas

## Shipped

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

### 🧭 HUD Layout Polish
✅ **Shipped** - The top HUD now uses a single-row desktop layout with a wider main navigation strip, shorter nav button labels, and a redesigned profile card with a framed pet tile, level badge, HP-style progress bar, darker outline treatment, no dropdown button, a simplified utility area focused on coins plus notifications, larger spacing before the main page content, and a wider shared content shell for every tab view.

### 🐾 Pet Room
✅ **Shipped** — A dedicated modal to see your active pet larger, interact with it, feed treats, and view evolution progress. All pets you own appear in a row with active-pet highlighting.

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
