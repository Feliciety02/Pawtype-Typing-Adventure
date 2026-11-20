<p align="center">
  <img src="docs/readme/title-screen.webp" width="1200" alt="Pawtype title screen: a pixel-art valley, castle, and Play button">
</p>

<h1 align="center">Pawtype Studio</h1>

<p align="center">A cozy typing adventure. Practice in themed rooms, clear lessons and world quests, collect companions and awards, and make a pixel-art camp your own.</p>

<p align="center"><code>TanStack Start</code> &nbsp; <code>React 19</code> &nbsp; <code>Tailwind CSS 4</code> &nbsp; <code>Supabase for accounts and cloud saves</code></p>

<p align="center">
  <a href="#run-locally"><img src="docs/readme/run-button.svg" width="216" alt="Run locally"></a>
  <br>
  <sub>Want to look around first? Choose <strong>Play</strong> → <strong>Play Demo</strong>. No account or Supabase project is needed for demo mode.</sub>
</p>

<p align="center">
  <a href="#at-a-glance"><strong>At a glance</strong></a> &nbsp;·&nbsp;
  <a href="#the-ui"><strong>The UI</strong></a> &nbsp;·&nbsp;
  <a href="#how-to-play"><strong>How to play</strong></a> &nbsp;·&nbsp;
  <a href="#run-locally"><strong>Run locally</strong></a> &nbsp;·&nbsp;
  <a href="#accounts-and-saves"><strong>Accounts and saves</strong></a> &nbsp;·&nbsp;
  <a href="#explore-the-repository"><strong>Explore the repository</strong></a>
</p>

## At a glance

<table>
  <tr>
    <td align="center" width="25%"><strong>01 · Train</strong><br><sub>Take timed typing tests and review speed, accuracy, and mistakes.</sub></td>
    <td align="center" width="25%"><strong>02 · Learn</strong><br><sub>Follow a guided lesson path with goals and rewards.</sub></td>
    <td align="center" width="25%"><strong>03 · Explore</strong><br><sub>Clear stages across themed world maps.</sub></td>
    <td align="center" width="25%"><strong>04 · Collect</strong><br><sub>Earn coins, raise pets, customize worlds, and browse awards.</sub></td>
  </tr>
</table>

## The UI

These are desktop screenshots of the running app in **Play Demo** mode (mostly 1440 × 900; the Workshop is 1600 × 900). The stats screen shows a completed practice session; other screens show the demo save.

### Camp

The camp is the home hub. Its buildings open the Cabin Bag, Pet Nursery, Blacksmith Workshop, Training Board, Painter’s Tent, Mailbox, and Supply Wagon.

<p align="center"><img src="docs/readme/camp.webp" width="1200" alt="Pawtype camp with interactive pixel-art buildings and the navigation HUD"></p>

### Practice and adventure

<table>
  <tr><th width="50%">Train · typing practice</th><th width="50%">Quest · adventure map</th></tr>
  <tr>
    <td><img src="docs/readme/practice.webp" width="100%" alt="Timed typing practice with live text, a world room, and an on-screen keyboard"></td>
    <td><img src="docs/readme/adventure.webp" width="100%" alt="Adventure map showing world stages, completion, and locked nodes"></td>
  </tr>
</table>

### Lessons and shop

<table>
  <tr><th width="50%">Learn · lesson path</th><th width="50%">Shop · companions</th></tr>
  <tr>
    <td><img src="docs/readme/lessons.webp" width="100%" alt="Quest Log lesson path with units, lesson goals, and rewards"></td>
    <td><img src="docs/readme/shop-pets.webp" width="100%" alt="Curiosity Cart showing collectible pets and the selected companion"></td>
  </tr>
  <tr><th colspan="2">Shop · worlds and decorations</th></tr>
  <tr><td colspan="2" align="center"><img src="docs/readme/shop-themes.webp" width="95%" alt="Shop themes tab showing purchasable world themes"></td></tr>
</table>

### Progress and customization

<table>
  <tr><th width="50%">Awards · badge museum</th><th width="50%">Stats · practice history</th></tr>
  <tr>
    <td><img src="docs/readme/awards.webp" width="100%" alt="Awards museum with themed wings and earned badges"></td>
    <td><img src="docs/readme/stats.webp" width="100%" alt="Stats page showing practice summary and session history"></td>
  </tr>
  <tr><th>Settings · worlds and display</th><th>Camp · Blacksmith Workshop</th></tr>
  <tr>
    <td><img src="docs/readme/settings.webp" width="100%" alt="Settings with world choices, display mode, and effects"></td>
    <td><img src="docs/readme/blacksmith.webp" width="100%" alt="Blacksmith Workshop with keyboard customization controls and 3D preview"></td>
  </tr>
</table>

### Starting screen

<p align="center"><img src="docs/readme/sign-in.webp" width="720" alt="Sign-in panel with email, social sign-in, and Play Demo option"></p>

## How to play

1. Select **Play**, then **Play Demo** to enter without an account. The demo starts with a sample player, pets, coins, and some cleared stages.
2. Use the HUD to open **Train**, **Quest**, **Learn**, **Shop**, or **Awards**. Open the profile menu for **Stats** and **Settings**.
3. Finish typing sessions or lessons to track practice and earn in-game progress. Return to Camp to visit its buildings, including the Blacksmith Workshop.

The demo save lives in this browser. An account can sync game state through Supabase when the project is configured.

## Run locally

You need Node.js and npm.

```powershell
npm ci
npm run dev
```

Open the URL Vite prints (normally **http://localhost:8080**), select **Play**, then **Play Demo**. A local demo does not require environment variables or an external editor.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the production app |
| `npm run preview` | Preview a local production build |
| `npm run lint` | Run ESLint |

## Accounts and saves

| Mode | Setup | Save behavior |
| --- | --- | --- |
| **Play Demo** | None | Game state is stored in browser local storage. |
| **Signed-in account** | Configure Supabase using [`.env.example`](.env.example) | Authentication and cloud game-state storage use Supabase; the app also keeps a local copy. |

For Google or Facebook sign-in, enable the provider in Supabase and add the callback URL described in [`.env.example`](.env.example). Set both server variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) and browser variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) for account features.

## Explore the repository

| Area | Start here | What it contains |
| --- | --- | --- |
| Routes | [`src/routes/`](src/routes/) | File-based views for Camp, practice, adventure, lessons, shop, awards, stats, settings, and workshop |
| Feature UI | [`src/components/`](src/components/) | Camp, typing, lessons, pets, shop, awards, and shared HUD components |
| Game logic | [`src/lib/game/`](src/lib/game/) | Progress, curriculum, achievements, game state, and typing content |
| Authentication and saves | [`src/lib/auth/`](src/lib/auth/) · [`src/lib/supabase/`](src/lib/supabase/) | Demo mode, account access, and cloud persistence |
| In-app guide | [`src/lib/docs/`](src/lib/docs/) | Documentation shown in Settings → Library |
| Project docs | [`docs/`](docs/) | Camp, achievements, and badge design notes |
