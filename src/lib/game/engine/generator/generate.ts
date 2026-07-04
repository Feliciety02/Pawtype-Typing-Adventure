import type { WorldId } from "../../../../components/shared/WorldTheme";
import type { Difficulty, Zone, WordBank, WorldLexicon } from "./types";
import { DIFFICULTY_VOCAB } from "./vocab";
import { LEXICONS } from "./lexicons";
import { TEMPLATES } from "./templates";
import { pickFact } from "./facts";
import { pickFresh } from "./tracker";
import { fillTemplate, pick } from "./filler";
import { wordZones } from "./zones";

/**
 * Generate a passage of adventure-themed words for a specific world.
 * Preserves original signature but uses improved sentence approach.
 */
export async function generateAdventureWords(
  stageName: string,
  worldId: WorldId,
  seedWords: string[],
  count = 36,
): Promise<string[] | null> {
  const lexicon = LEXICONS[worldId];
  if (!lexicon) return null;

  const bank: WordBank = {
    ...DIFFICULTY_VOCAB.easy,
    nouns: [...DIFFICULTY_VOCAB.easy.nouns, ...lexicon.nouns, ...seedWords],
    verbs: [...DIFFICULTY_VOCAB.easy.verbs, ...lexicon.verbs],
    adjs: [...DIFFICULTY_VOCAB.easy.adjs, ...lexicon.adjs],
  };

  const sentences: string[] = [];
  const sentenceCount = Math.ceil(count / 7);
  for (let i = 0; i < sentenceCount; i++) {
    const tpl = pick(TEMPLATES.easy);
    const sentence = fillTemplate(tpl, bank);
    sentences.push(sentence);
  }

  const allWords = sentences.join(" ").split(/\s+/).filter(Boolean);
  return allWords.slice(0, count);
}

/**
 * Generate a world-themed text passage.
 * Preserves original signature but now produces complete sentences.
 */
export async function generateWorldText(worldId: WorldId): Promise<string | null> {
  const lexicon = LEXICONS[worldId];
  if (!lexicon) return null;

  const bank: WordBank = {
    ...DIFFICULTY_VOCAB.easy,
    nouns: [...DIFFICULTY_VOCAB.easy.nouns, ...lexicon.nouns],
    verbs: [...DIFFICULTY_VOCAB.easy.verbs, ...lexicon.verbs],
    adjs: [...DIFFICULTY_VOCAB.easy.adjs, ...lexicon.adjs],
  };

  const sentences: string[] = [];
  for (let i = 0; i < 3; i++) {
    const tpl = pick(TEMPLATES.easy);
    const sentence = fillTemplate(tpl, bank);
    sentences.push(sentence);
  }
  return sentences.join(" ");
}

/**
 * Generate a quest-themed sentence.
 * Preserves original signature.
 */
export async function generateQuestText(stageName: string, worldId: WorldId): Promise<string | null> {
  const lexicon = LEXICONS[worldId];
  if (!lexicon) return null;

  const bank: WordBank = {
    ...DIFFICULTY_VOCAB.easy,
    nouns: [...DIFFICULTY_VOCAB.easy.nouns, ...lexicon.nouns],
    verbs: [...DIFFICULTY_VOCAB.easy.verbs, ...lexicon.verbs],
    adjs: [...DIFFICULTY_VOCAB.easy.adjs, ...lexicon.adjs],
  };

  const tpl = pick(TEMPLATES.easy);
  const sentence = fillTemplate(tpl, bank);
  return `${stageName}: ${sentence}`;
}

/**
 * Generate text appropriate for a specific lesson difficulty and keyboard focus.
 * New function — used by the lesson system.
 */
export async function generateLessonText(
  difficulty: Difficulty,
  targetZones: Zone[],
  count = 30,
): Promise<string> {
  const bank = DIFFICULTY_VOCAB[difficulty];

  // Filter vocabulary to prefer target zone words
  const zoneFiltered = (words: string[]) => {
    if (targetZones.length === 0) return pickFresh(words, Math.min(count, words.length));
    const matched = words.filter((w) => targetZones.some((z) => wordZones(w).has(z)));
    const pool = matched.length >= 10 ? matched : words;
    return pickFresh(pool, Math.min(count, pool.length));
  };

  const useBank: WordBank = {
    ...bank,
    nouns: zoneFiltered(bank.nouns),
    verbs: zoneFiltered(bank.verbs),
    adjs: zoneFiltered(bank.adjs),
  };

  const sentenceCount = Math.max(1, Math.ceil(count / 7));
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    const templates = TEMPLATES[difficulty];
    const tpl = pick(templates);
    const sentence = fillTemplate(tpl, useBank);
    sentences.push(sentence);
  }

  // Mix in an educational fact occasionally
  if (Math.random() < 0.3) {
    sentences.push(pickFact());
  }

  return sentences.join(" ");
}

/**
 * Generate sentences that target specific weak characters.
 */
export async function generateWeakSpotSentences(weakChars: string[]): Promise<string[]> {
  if (weakChars.length === 0) return [];

  const bank = DIFFICULTY_VOCAB.easy;
  const charSet = new Set(weakChars.map((c) => c.toLowerCase()));

  const matching = (words: string[]) => words.filter((w) => [...w].some((c) => charSet.has(c)));
  const useBank: WordBank = {
    ...bank,
    nouns: matching(bank.nouns).length >= 5 ? matching(bank.nouns) : bank.nouns,
    verbs: matching(bank.verbs).length >= 5 ? matching(bank.verbs) : bank.verbs,
    adjs: matching(bank.adjs).length >= 5 ? matching(bank.adjs) : bank.adjs,
  };

  const sentences: string[] = [];
  for (let i = 0; i < 4; i++) {
    const tpl = pick(TEMPLATES.easy);
    sentences.push(fillTemplate(tpl, useBank));
  }
  return sentences;
}

// ============================================================
// Re-export WordLexicon type for compatibility
// ============================================================
export type { WorldLexicon };

