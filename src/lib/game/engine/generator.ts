// Barrel: re-exports from the modular generator/
export {
  generateAdventureWords,
  generateWorldText,
  generateQuestText,
  generateLessonText,
  generateWeakSpotSentences,
} from "./generator/index";
export type { WorldLexicon } from "./generator/types";
export type { Difficulty, Zone, WordBank } from "./generator/types";
