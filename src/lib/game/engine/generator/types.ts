import type { WorldId } from "../../../../components/shared/WorldTheme";

export type Difficulty = "beginner" | "easy" | "intermediate" | "advanced" | "expert" | "master";
export type Zone = "home" | "top" | "bottom" | "numbers" | "symbols";
export type WordBank = {
  nouns: string[];
  verbs: string[];
  adjs: string[];
  advs: string[];
  preps: string[];
  dets: string[];
  symbols: string[];
};
export type WorldLexicon = {
  nouns: string[];
  adjs: string[];
  verbs: string[];
  preps: string[];
  seeds: string[];
};
export const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  beginner: 0,
  easy: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
  master: 5,
};
