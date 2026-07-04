export const FUTURE_DOC = `# Future Addons - Roadmap & Ideas

Planned features and high-potential additions to expand the game.

---

## âœ… Shipped

### Pixel RPG Modal Refresh
âœ… **Shipped** - Practice results, lesson popups, pet room, egg rewards, and adventure quest overlays now share a reusable parchment-style pixel modal system with layered frames, corner ornaments, visible X controls, Escape support, stronger close behavior, and a premium cozy RPG presentation.

### Adventure Quest Scene Flow
âœ… **Shipped** - Adventure quest typing now stays as a dedicated gameplay scene. Quest clear and fail states fade the live stage into the background, trigger biome-specific celebration or failure particles, and open a separate foreground results card instead of mixing victory UI directly into the typing surface. The live quest HUD now prioritizes the typing panel, keeps the stage image in a compact header card, and moves WPM/accuracy/time/goal into a short stats row below the words. Victory celebrations now use a world-aware emoji/sprite particle engine with denser top-spawned particles, biome-specific assets, reusable sprite mapping, and softer failure effects.

### ðŸ“š PawType Curriculum (13 Units)
âœ… **Shipped** - The Lessons view is now a full 13-unit curriculum with 90+ lessons: Getting Started, Top Row, Bottom Row, Capital Letters, Punctuation, Numbers, Symbols, Common English Words, Sentences, Paragraphs, Speed Building, Real World Typing, and Advanced Challenges. Each unit tracks progress, unlocks the next after completion, and expands into an accordion of lessons with curated word banks, difficulty (beginner -> master), target WPM, and target accuracy. Completion persists to localStorage and lessons can be replayed. Lesson cards now use a roomier three-column quest-card layout with larger status art, vertical lesson details, collectible reward badges, grouped progress actions, and no separate mascot callout column.


### Smart Coach Engine
âœ… **Shipped** - Post-run coaching now analyzes recent session history from IndexedDB to detect trends (WPM up/down/flat, accuracy changes, combo consistency). Generates contextual insights referencing your improvement over time — spotting plateaus, praising streaks, and warning about accuracy dips. No external API required.

### Pattern Analyzer
âœ… **Shipped** - Tracks per-character accuracy, bigram mistake patterns, and keyboard zone heat across all saved sessions. Identifies weak keys, problematic letter sequences, and hand zones. Feeds into the coach for targeted recommendations like "your left home row zone needs work" or "the 'th' sequence trips you up."

### Dynamic Passage Generator
âœ… **Shipped** - Bigram (2-word) Markov chain generator that creates unique, natural-sounding typing passages per world. Uses expanded semantic word pools (80+ words per world with nouns, adjectives, verbs, prepositions) and 15 hand-crafted seed sentences per world for training. Sentence templates provide varied punctuation and structure. Integrates with the Pattern Analyzer to boost weak-spot characters. Falls back gracefully to the existing rotation-based word pool system.

### Adaptive Difficulty & Recommendations
âœ… **Shipped** - Adventure stage WPM goals now adapt to each player's skill level based on recent session history (up to 15 sessions). Dynamic goal calculation adjusts Easy/Normal/Hard/Boss targets to match the player's average WPM. Hub dashboard shows a daily AI suggestion (speed drill, accuracy focus, weak key practice, warmup, or steady pace tip) based on session trends and pattern analysis. Progress summary tracks WPM changes, accuracy trends, and consistency over the last 30 sessions.

### Smart Mascot + Pixel Cloud Overlay
âœ… **Shipped** - The mascot now references live session performance: combo streaks, weak keys, and mistake counts. Generates contextual lines like "40 keys in a row!" or "Watch the 'e' key — it's your most missed." A CSS pixel-art cloud overlay floats in the world-art panel with gentle animation. Both systems are 100% local.

### Cozy Campsite Adventure Refresh
âœ… **Shipped** - The former Autumn Cottage world is now Cozy Campsite, with updated theme copy, shop and docs text, campsite-flavored typing prompts, ember ambience, and a dedicated five-node adventure art set wired using the same filename pattern as the other worlds.

### Adventure Replay Rules
âœ… **Shipped** - Completed adventure stages can still be replayed for practice, but replay clears no longer grant extra XP or coin rewards. Completed node cards hide the reward strip, and cleared quest popups now stay open until the player exits with \`Esc\` or the \`X\` button.

### ðŸ“– In-App Documentation Library
âœ… **Shipped** - browsable from inside the Settings page (Library tab) with full markdown rendering, table of contents, and 5 doc sections (Achievements, Themes, Pets, Economy, Future Addons).

### ðŸ” Cloud Sync & Auth
âœ… **Shipped** - Sign-in/sign-up form with Supabase auth (email/password), Google and Facebook OAuth entry points, PKCE browser auth flow, server-backed auth cookies, safer callback redirects, stronger signup password rules, cloud save/load of game state on login/logout, and automatic 2-second debounced cloud sync while playing. Accessible from Header profile menu and Settings -> Account.

### ðŸ•¹ Pixel Login Gate
âœ… **Shipped** - Dedicated full-screen pixel-art login page before the main game, with Google and Facebook OAuth entry points plus a local demo account mode for instant access without cloud sync. The title-screen backdrop uses the cozy sky, fluffy pixel clouds, sun, stepped mountain and hill layers, twinkles, and drifting leaves.

### ðŸ—º Adventure Node Pixel UI Polish
âœ… **Shipped** - Adventure node cards were polished for clearer stage states and rewards, and tab button labels stay contained inside their pixel button plates on compact layouts.

### ðŸ§­ HUD Layout Polish
âœ… **Shipped** - The top HUD now uses a single-row desktop layout with a wider main navigation strip, shorter nav button labels, and a redesigned profile card with a framed pet tile, level badge, HP-style progress bar, darker outline treatment, no dropdown button, a simplified utility area focused on coins plus notifications, larger spacing before the main page content, and a wider shared content shell for every tab view.

### ðŸ¾ Pet Room
A dedicated view to see your active pet larger, interact with it, feed treats, and view evolution progress. All pets you own appear in a row.

---

## Medium Term

### ðŸŽ® Multiplayer Typing Races
Real-time races against other players (or ghosts of past sessions). First to type the passage fastest with highest accuracy wins.

### ðŸ§ª Custom Practice Generator
Pick specific characters, words per minute target, or difficulty. The AI generates a custom lesson targeting your weak spots.

### ðŸŽµ Soundtrack Per World
Each world gets a unique lo-fi / ambient soundtrack that plays during typing. Volume slider, disable option.

### ðŸ“Š Advanced Stats Overlay
Click any stat on the results screen to see a 30-day trend line. Track your WPM, accuracy, and combo growth over time.

### ðŸ… Seasonal Events
Time-limited events with exclusive badges (Spring Festival, Summer Splash, Harvest Hero, Winter Wonder, Anniversary).

---

## Long Term

### ðŸŒŸ Social Features
- Friend codes and leaderboards
- Typing parties (group sessions)
- Mentor system (experienced players help beginners)
- Profile pages with badge showcases

### ðŸŒ Community Worlds
A workshop where players can create and share their own themes:
- Upload a background image
- Pick 4 swatch colors
- Choose ambient effect type
- Set HUD decoration
- Share with a share code

### âš”ï¸ Adventure Expansion
- Procedurally generated stages (endless mode)
- World bosses with raid mechanics
- Guilds with shared progress
- Seasonal adventure ladders

### ðŸ§¬ Pet Breeding & Fusion
Breed two pets to create hybrid offspring with combined traits. Fusion system to create ultimate legendary pets.

### ðŸ’Ž Premium Battle Pass
Seasonal pass with exclusive cosmetics, badges, and pets. Free track always available, premium track with one-time purchase.



---

## Technical Debt & Polish

- **Offline support** - full PWA with service worker caching
- **Accessibility pass** - screen reader support, high contrast mode, keyboard navigation audit
- **Mobile responsive** - typing on mobile with virtual keyboard
- **i18n** - localization for multiple languages
`;
