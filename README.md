# Pawtype Studio

Pawtype Studio is a cozy pixel-themed typing tutor prototype built with TanStack Start, React 19, Vite, and Tailwind CSS v4. The current codebase is primarily a frontend-heavy experience, but it now includes Supabase-backed authentication, cloud save, and light server-side gameplay persistence.

This README is intended as a working product and engineering assessment so the project can be evaluated for next steps.

## 1. Product Summary

### Current concept

The app presents a gamified typing practice experience with:

- a hero section and brand framing
- a main typing test arena
- a world-based theme system
- an adventure map with unlockable stages
- lessons, quests, badges, coins, streaks, and rewards as UI concepts
- a pixel cat mascot and retro visual identity
- a default starter cat pet named Whiskers

### Current reality

The project is best described as a polished frontend prototype / vertical slice:

- the typing gameplay loop works locally in the browser
- the adventure stage unlock flow works locally per selected world
- world theme and dark mode persist in `localStorage`
- most progression, rewards, stats, lessons, badges, and economy are still static mock content
- Supabase auth and cloud save are live, but the broader backend product model is still early and there is still no leaderboard or full user profile system

## 2. Architecture Overview

### Frontend

- Framework: TanStack Start + React 19
- Routing: TanStack file-based routing
- Bundler: Vite
- Styling: Tailwind CSS v4 with custom CSS variables and utility classes
- UI primitives available: Radix + shadcn-style component set
- State management: local React state and `localStorage`
- Data fetching layer available but unused: React Query is configured, but no queries are implemented

### Backend / server

There is no large custom application backend in the usual sense.

What exists:

- `src/start.ts` defines a TanStack Start instance
- `src/server.ts` wraps the SSR server entry and normalizes catastrophic 500 errors
- `src/lib/error-capture.ts`, `src/lib/error-page.ts`, and `src/lib/lovable-error-reporting.ts` provide error capture/reporting utilities
- `src/lib/supabase/auth.ts` and `src/lib/supabase/game.ts` provide server functions for auth and cloud persistence
- Supabase handles authentication, session cookies, and cloud game-state storage

What does not exist:

- no REST API
- no large domain-specific API layer beyond the current server functions
- no admin tooling
- no production-grade content management or analytics stack

### Routes

The app currently has only one product route:

- `/` -> the full Pawtype landing/game page
- `/auth/callback` -> Supabase OAuth return route for Google/Facebook sign-in

There are no dedicated full pages yet for:

- lesson catalog
- profile
- stats history
- shop
- admin / content management

## 3. Repository Structure

High-level structure:

- `src/routes`
  - `__root.tsx`: HTML shell, metadata, query client provider, world provider, global error UI
  - `index.tsx`: the entire current product page
- `src/components`
  - `TypingArena.tsx`: main typing test
  - `AdventureMap.tsx`: stage progression modal and local unlock logic
  - `WorldTheme.tsx`: theme/world context and CSS class switching
  - `WorldSwitcher.tsx`: world picker dropdown
  - `ThemeToggle.tsx`: light/dark mode toggle
  - `PixelMascot.tsx`: CSS-grid mascot
  - `PixelKeyboard.tsx`: highlighted keyboard display
- `src/lib`
  - error handling helpers
  - `utils.ts` with `cn()`
- `src/components/ui`
  - a large generic shadcn-style UI library scaffold

## 4. Frontend Feature Breakdown

### A. Shell and branding

Implemented:

- responsive single-page layout
- retro pixel visual system
- custom fonts from Google Fonts
- cozy world-specific palettes
- manual light and dark mode

Status:

- visually strong and coherent
- suitable as a prototype or demo page

Gaps:

- metadata still contains leftover Lovable defaults in the root route
- no favicon / app icon setup
- no product-specific SEO structure beyond basic page meta

### B. Typing Arena

Implemented:

- random word generation from a local word bank
- selectable durations: 15s, 30s, 60s
- hidden input capture with real-time typed text comparison
- WPM calculation
- accuracy calculation
- live combo tracking
- best combo tracking
- timer progress bar
- finish modal with summary stats
- mascot mood changes
- sparkle effects
- keyboard highlighting

Status:

- this is the most complete functional part of the app
- it works entirely client-side

Gaps:

- no lesson curriculum or difficulty model behind the random word test
- no persistence of test history
- no profile-based progress
- no anti-cheat or validation
- no replay analytics or error heatmaps
- no support for punctuation, numbers, custom text, or language packs
- no audio feedback, accessibility settings, or proper focus states for all users

### C. Adventure Map

Implemented:

- separate stage sets per world
- scrollable multi-world adventure campaigns across all 12 available themes
- public `node-level` artwork for cafe, forest, ocean, sakura, castle, space, mushroom, and sunflower stage cards
- automatic alpha-bound alignment for transparent `node-level` PNGs so floating islands share a consistent visible top edge without per-image offsets
- shared `public/Icons/lock.png` lock overlay for locked adventure nodes and locked settings toggles
- stage difficulties and target WPM goals
- local unlock progression
- stage modal with focused typing challenge
- difficulty-based challenge timers
- extendable adventure typing text using Ollama when available with local fallback words
- pass/fail logic based on WPM and accuracy
- per-world completion persistence using `localStorage`

Status:

- concept is clear and playable
- good base for a campaign mode

Gaps:

- stage rewards are UI-only and not connected to a real player economy
- completion is stored only in the current browser
- autumn, moonlit, rainy, and snowy currently use fallback icons until matching `public/node-level` art sets are added
- no server-side save, sync, profile binding, or replayability rules
- no boss mechanics beyond harder word lists
- no content tools for authoring stages

### D. Lessons, quests, badges, coins, streaks

Implemented:

- all are displayed in the UI
- progress bars and cards communicate the product vision well
- new and reset saves start with Whiskers the Cat as the active pet

Status:

- these are currently placeholder content blocks

Gaps:

- lessons are static arrays, not real lesson modules
- quests are static values
- achievements are static values
- coins, XP, and streak are not backed by real logic
- no unlock economy, inventory, cosmetic system, or reward ledger

### E. Theme and world system

Implemented:

- twelve worlds: cafe, forest, ocean, sakura, castle, space, autumn, mushroom, moonlit, rainy, snowy, sunflower
- world-based CSS variable overrides
- unlocked-world selection grid in Settings
- persistent theme selection
- persistent world selection
- manual Day/Night preference that persists without following system theme automatically

Status:

- well executed visually
- one of the strongest extensibility points in the codebase

Gaps:

- world choice affects visuals and stage sets, but not broader systems
- no music, story, server-backed unlock tree, or content authoring tools yet

### F. Settings

Implemented:

- gamified Settings page with General and Library tabs
- inline unlocked-world theme grid with swatches
- manual Day/Night mode
- CRT, sparkle trail, focus glow, and reduced motion toggles
- account status and reset controls
- in-app documentation library

Status:

- settings are functional and persisted through `localStorage`
- unlocked worlds are filtered from inventory and base worlds

Gaps:

- settings are still local-only and not synced to a user profile

## 5. Backend Status

### Current status

Backend maturity is effectively `early MVP`.

There is SSR infrastructure, Supabase auth, server-side session handling, and cloud persistence for game state, but no broad product backend layer yet.

### What this means

The app currently behaves like a local-first frontend demo:

- Supabase user accounts exist
- cloud save exists for authenticated players
- no shared data
- no real analytics
- no leaderboard
- no moderation/admin system
- no content pipeline

## 6. Engineering Status

### What is good

- clean and readable component structure
- clear separation between route shell and feature components
- strong visual identity
- reasonable use of React hooks and local state
- route system is correctly set up
- error boundary / SSR fallback work has already started

### What is incomplete or risky

- only one route exists
- no tests
- no CI configuration in the repo
- no environment documentation
- no backend contract or domain model
- large `src/components/ui` library is present but mostly unused product scaffolding
- `@tanstack/react-query` is configured but currently unused
- navigation buttons in the header are UI only
- several product metrics shown on screen are mock data, not computed state

### Environment status

I could not verify build/lint execution in this workspace because:

- `bun` is referenced by the repo lockfile and scripts workflow
- `bun` is not installed in the current environment
- `node_modules` is also not present

So the codebase assessment is based on source inspection rather than a successful local build.

## 7. Product Gaps

The biggest product gaps are:

- onboarding and account access exist, but they are still lightweight
- no lesson progression system
- no long-term player progression
- no real economy or reward tracking
- no social/competitive features
- no teacher/student or classroom mode
- no content management for lessons and stages
- no historical stats dashboards
- no accessibility pass
- no mobile-first input design for serious typing practice

## 8. Technical Gaps

The biggest technical gaps are:

- no backend service layer
- only a minimal database shape and auth/session strategy exist today
- only a small set of server functions exist today
- no automated tests
- no telemetry / analytics instrumentation
- no validation layer for content or user state
- no deployment or ops documentation

## 9. Recommended Roadmap

### Phase 1: Turn the prototype into a usable MVP

Recommended first additions:

- define the core product model: users, lessons, attempts, worlds, stages, rewards
- add authentication
- add persistent user profiles
- save typing test attempts and stage progress to a database
- replace static quest/streak/XP/coin values with real calculations
- add a real lesson catalog route and lesson detail flow
- wire the header navigation to actual pages

### Phase 2: Make learning effective

- create a structured curriculum by skill level
- add character/hand/finger-specific drills
- add punctuation, number, and symbol lessons
- add adaptive difficulty based on performance
- add post-test analytics and mistake heatmaps
- add daily practice plans and retention loops

### Phase 3: Deepen engagement

- persistent achievements and reward economy
- unlockable cosmetics/themes/mascots
- leaderboards and friend challenges
- weekly quests and seasonal events
- narrative progression inside each world

### Phase 4: Operational maturity

- add test coverage for gameplay logic
- add CI for lint/build/test
- add analytics and error monitoring
- add admin tools for managing lessons/stages
- document deployment, environments, and content workflows

## 10. Recommended System Design Direction

If this project is intended to become a real product, a reasonable next architecture would be:

- TanStack Start frontend remains
- add server functions or a dedicated API layer
- add a relational database for users, attempts, lessons, stages, rewards
- add auth provider support
- keep local optimistic state for gameplay responsiveness
- use React Query for profile, progress, and leaderboard data

Suggested core entities:

- `User`
- `Profile`
- `Lesson`
- `LessonAttempt`
- `World`
- `Stage`
- `StageProgress`
- `Achievement`
- `Quest`
- `RewardTransaction`
- `TypingSession`

## 11. Priority Improvements

If the goal is to decide what to build next, these should be the top priorities:

1. Add real persistence for user progress and attempts.
2. Turn static lessons and quests into actual data-driven systems.
3. Create separate routes/pages for practice, lessons, stats, and profile.
4. Define a backend/data model before adding more frontend-only features.
5. Add tests around WPM, accuracy, progression, and stage-clear logic.

## 12. Current Verdict

Pawtype Studio is a strong visual concept with a partially functional gameplay prototype, not yet a complete application. The frontend communicates the product direction clearly and includes a solid base for theming and core typing interactions. The main limitation is that nearly all long-term product systems are still conceptual or mocked, and the backend has not been built.

That makes the project suitable for:

- product direction review
- UX refinement
- MVP planning
- backend/domain modeling
- content system design

It is not yet ready for:

- real user accounts
- persistent progression
- competitive features
- production analytics
- live release as a complete learning platform

## 13. Documentation

In-app documentation is available via the **📖 Library** tab. Raw markdown files live in [`docs/`](docs/):

| File | Content |
|------|---------|
| [`docs/ACHIEVEMENTS.md`](docs/ACHIEVEMENTS.md) | 12-tier badge system with 500+ collectible badges |
| `src/lib/docs/themes.ts` | All 12 worlds, palettes, ambient effects, HUD styling |
| `src/lib/docs/pets.ts` | Pet evolution, XP formula, pricing |
| `src/lib/docs/economy.ts` | Shop, daily rewards, earning rates |
| `src/lib/docs/future.ts` | Short/medium/long-term roadmap |

## 14. Run Notes

Once the environment is prepared, the expected workflow is likely:

```bash
bun install
bun run dev
```

If Bun is not preferred, the repo can likely be adapted to npm/pnpm, but that should be decided explicitly because the current lockfile is `bun.lock`.
