import type { DocEntry } from "./types";
import { ACHIEVEMENTS_DOC } from "./achievements";
import { THEMES_DOC } from "./themes";
import { PETS_DOC } from "./pets";
import { ECONOMY_DOC } from "./economy";
import { FUTURE_DOC } from "./future";
import { BADGE_DESIGN_SPEC } from "./badgeDesignSpec";

export const DOCS: DocEntry[] = [
  { id: "achievements", title: "Achievements & Badges", emoji: "🏆", content: ACHIEVEMENTS_DOC },
  { id: "bds", title: "Badge Design Spec", emoji: "📐", content: BADGE_DESIGN_SPEC },
  { id: "themes", title: "Dreaming Worlds", emoji: "🌍", content: THEMES_DOC },
  { id: "pets", title: "Fuzzy Friends", emoji: "🐾", content: PETS_DOC },
  { id: "economy", title: "Curiosity Cart", emoji: "🪙", content: ECONOMY_DOC },
  { id: "future", title: "Future Addons", emoji: "🔮", content: FUTURE_DOC },
];

export type { DocEntry };
