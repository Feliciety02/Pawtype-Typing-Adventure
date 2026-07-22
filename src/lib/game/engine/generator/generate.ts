// Lexicon-based text generator — merges world-specific words with difficulty vocabulary
// into proper sentences using a simple grammar engine
import type { WorldId } from "../../../../components/shared/WorldTheme";
import type { Difficulty, Zone, WordBank, WorldLexicon } from "./types";
import { DIFFICULTY_VOCAB } from "./vocab";
import { LEXICONS } from "./lexicons";
import { pickFact } from "./facts";
import { pickFresh } from "./tracker";
import { pick } from "./filler";
import { generateSentence } from "./grammar";
import { wordZones } from "./zones";

// Generate adventure-stage text by combining world lexicons with seed words
export async function generateAdventureWords(
  stageName: string,
  worldId: WorldId,
  seedWords: string[],
  count = 36,
): Promise<string[] | null> {
  const lexicon = LEXICONS[worldId];
  if (!lexicon) return null;

  // Merge easy vocab + world lexicon + stage seed words
  const bank: WordBank = {
    ...DIFFICULTY_VOCAB.easy,
    nouns: [...DIFFICULTY_VOCAB.easy.nouns, ...lexicon.nouns, ...seedWords],
    verbs: [...DIFFICULTY_VOCAB.easy.verbs, ...lexicon.verbs],
    adjs: [...DIFFICULTY_VOCAB.easy.adjs, ...lexicon.adjs],
  };

  const sentences: string[] = [];
  const sentenceCount = Math.ceil(count / 7);
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence(bank, "easy"));
  }

  const allWords = sentences.join(" ").split(/\s+/).filter(Boolean);
  return allWords.slice(0, count);
}

// Generate a short world-themed passage (3 sentences)
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
    sentences.push(generateSentence(bank, "easy"));
  }
  return sentences.join(" ");
}

// Generate a single quest-themed sentence with the stage name as a prefix
export async function generateQuestText(
  stageName: string,
  worldId: WorldId,
): Promise<string | null> {
  const lexicon = LEXICONS[worldId];
  if (!lexicon) return null;

  const bank: WordBank = {
    ...DIFFICULTY_VOCAB.easy,
    nouns: [...DIFFICULTY_VOCAB.easy.nouns, ...lexicon.nouns],
    verbs: [...DIFFICULTY_VOCAB.easy.verbs, ...lexicon.verbs],
    adjs: [...DIFFICULTY_VOCAB.easy.adjs, ...lexicon.adjs],
  };

  const sentence = generateSentence(bank, "easy");
  return `${stageName}: ${sentence}`;
}

// Generate lesson text targeting specific keyboard zones at a given difficulty
export async function generateLessonText(
  difficulty: Difficulty,
  targetZones: Zone[],
  count = 30,
): Promise<string> {
  const bank = DIFFICULTY_VOCAB[difficulty];

  // Prefer words that include letters from the target keyboard zones
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
    sentences.push(generateSentence(useBank, difficulty));
  }

  if (Math.random() < 0.3) {
    sentences.push(pickFact());
  }

  return sentences.join(" ");
}

// Generate sentences that incorporate characters the player struggles with
export async function generateWeakSpotSentences(weakChars: string[]): Promise<string[]> {
  if (weakChars.length === 0) return [];

  const bank = DIFFICULTY_VOCAB.easy;
  const charSet = new Set(weakChars.map((c) => c.toLowerCase()));

  // Filter vocabulary to only words containing weak characters
  const matching = (words: string[]) => words.filter((w) => [...w].some((c) => charSet.has(c)));
  const useBank: WordBank = {
    ...bank,
    nouns: matching(bank.nouns).length >= 5 ? matching(bank.nouns) : bank.nouns,
    verbs: matching(bank.verbs).length >= 5 ? matching(bank.verbs) : bank.verbs,
    adjs: matching(bank.adjs).length >= 5 ? matching(bank.adjs) : bank.adjs,
  };

  const sentences: string[] = [];
  for (let i = 0; i < 4; i++) {
    sentences.push(generateSentence(useBank, "easy"));
  }
  return sentences;
}

export type { WorldLexicon };
