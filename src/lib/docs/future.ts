export const FUTURE_DOC = `# Future Addons - Roadmap & Ideas

Planned features and high-potential additions to expand the game.

---

## âœ… Shipped

### Smart Coach Engine
âœ… **Shipped** - Post-run coaching now analyzes recent session history from IndexedDB to detect trends (WPM up/down/flat, accuracy changes, combo consistency). Generates contextual insights referencing your improvement over time — spotting plateaus, praising streaks, and warning about accuracy dips. No external API required.

### Cozy Campsite Adventure Refresh
âœ… **Shipped** - The former Autumn Cottage world is now Cozy Campsite, with updated theme copy, shop and docs text, campsite-flavored typing prompts, ember ambience, and a dedicated five-node adventure art set wired using the same filename pattern as the other worlds.

### Adventure Replay Rules
âœ… **Shipped** - Completed adventure stages can still be replayed for practice, but replay clears no longer grant extra XP or coin rewards. Completed node cards hide the reward strip, and cleared quest popups now stay open until the player exits with \`Esc\` or the \`X\` button.

### ðŸ“– In-App Documentation Library
âœ… **Shipped** - browsable from inside the Settings page (Library tab) with full markdown rendering, table of contents, and 5 doc sections (Achievements, Themes, Pets, Economy, Future Addons).

### ðŸ” Cloud Sync & Auth
âœ… **Shipped** - Sign-in/sign-up form with Supabase auth (email/password), Google and Facebook OAuth entry points, PKCE browser auth flow, server-backed auth cookies, safer callback redirects, stronger signup password rules, cloud save/load of game state on login/logout, and automatic 2-second debounced cloud sync while playing. Accessible from Header profile menu and Settings -> Account.

### ðŸ•¹ Pixel Login Gate
âœ… **Shipped** - Dedicated full-screen pixel-art login page before the main game, with Google and Facebook OAuth entry points plus a local demo account mode for instant access without cloud sync.

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
