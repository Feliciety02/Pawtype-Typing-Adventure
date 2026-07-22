import type { WordBank, Difficulty } from "./types";
import { pick, conjugate } from "./filler";
import { pickFresh, trackUsed } from "./tracker";

const FALLBACK_DETS = [
  "a",
  "an",
  "the",
  "this",
  "that",
  "every",
  "each",
  "some",
  "any",
  "no",
  "one",
  "two",
  "many",
  "several",
  "all",
  "both",
  "few",
  "more",
  "most",
];

const FALLBACK_PREPS = [
  "above",
  "across",
  "after",
  "along",
  "among",
  "around",
  "at",
  "before",
  "behind",
  "below",
  "beneath",
  "beside",
  "between",
  "beyond",
  "by",
  "down",
  "for",
  "from",
  "in",
  "inside",
  "into",
  "near",
  "of",
  "off",
  "on",
  "onto",
  "out",
  "outside",
  "over",
  "past",
  "through",
  "to",
  "toward",
  "under",
  "up",
  "upon",
  "with",
];

const SUB_CONJ = [
  "when",
  "while",
  "although",
  "because",
  "if",
  "though",
  "as",
  "since",
  "until",
  "after",
];

const COORD_CONJ = ["and", "but", "so", "yet"];

type GrammarLimits = {
  maxAdj: number;
  maxPP: number;
  advInVP: boolean;
  advFront: boolean;
  ppFront: boolean;
  sub: boolean;
  comp: boolean;
};

const LIMITS: Record<Difficulty, GrammarLimits> = {
  beginner: {
    maxAdj: 0,
    maxPP: 1,
    advInVP: false,
    advFront: false,
    ppFront: false,
    sub: false,
    comp: false,
  },
  easy: {
    maxAdj: 1,
    maxPP: 1,
    advInVP: true,
    advFront: true,
    ppFront: false,
    sub: false,
    comp: false,
  },
  intermediate: {
    maxAdj: 1,
    maxPP: 2,
    advInVP: true,
    advFront: true,
    ppFront: true,
    sub: true,
    comp: false,
  },
  advanced: {
    maxAdj: 2,
    maxPP: 2,
    advInVP: true,
    advFront: true,
    ppFront: true,
    sub: true,
    comp: true,
  },
  expert: {
    maxAdj: 2,
    maxPP: 3,
    advInVP: true,
    advFront: true,
    ppFront: true,
    sub: true,
    comp: true,
  },
  master: {
    maxAdj: 3,
    maxPP: 3,
    advInVP: true,
    advFront: true,
    ppFront: true,
    sub: true,
    comp: true,
  },
};

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickFreshWord(words: string[], batchSize: number): string {
  const batch = pickFresh(words, batchSize);
  const word =
    batch.length > 0
      ? batch[Math.floor(Math.random() * batch.length)]
      : words[Math.floor(Math.random() * words.length)];
  trackUsed([word]);
  return word;
}

function getDets(bank: WordBank): string[] {
  return bank.dets.length > 0 ? bank.dets : FALLBACK_DETS;
}

function getPreps(bank: WordBank): string[] {
  return bank.preps.length > 0 ? bank.preps : FALLBACK_PREPS;
}

function adjustDet(det: string, nextWord: string): string {
  const vowelStart = /^[aeiou]/i.test(nextWord);
  if (det === "a" && vowelStart) return "an";
  if (det === "an" && !vowelStart) return "a";
  return det;
}

function generateNP(bank: WordBank, limits: GrammarLimits): string {
  const noun = pickFreshWord(bank.nouns, 20);
  const adjCount = randInt(0, limits.maxAdj);
  const adjs: string[] = [];
  for (let i = 0; i < adjCount; i++) {
    adjs.push(pickFreshWord(bank.adjs, 15));
  }
  let det = pick(getDets(bank));
  const firstWord = adjs.length > 0 ? adjs[0] : noun;
  det = adjustDet(det, firstWord);
  const adjStr = adjs.length > 0 ? `${adjs.join(" ")} ` : "";
  return `${det} ${adjStr}${noun}`;
}

function generateVP(bank: WordBank, limits: GrammarLimits): string {
  const verb = conjugate(pickFreshWord(bank.verbs, 15));
  if (limits.advInVP && Math.random() < 0.35 && bank.advs.length > 0) {
    const adv = pick(bank.advs);
    return Math.random() < 0.5 ? `${verb} ${adv}` : `${adv} ${verb}`;
  }
  return verb;
}

function generatePP(bank: WordBank, limits: GrammarLimits): string {
  const prep = pick(getPreps(bank));
  const subAdj = Math.min(limits.maxAdj, 1);
  const subLimits: GrammarLimits = { ...limits, maxAdj: subAdj };
  return `${prep} ${generateNP(bank, subLimits)}`;
}

function buildSimple(bank: WordBank, limits: GrammarLimits): string {
  let s = `${generateNP(bank, limits)} ${generateVP(bank, limits)}`;
  const ppCount = randInt(0, limits.maxPP);
  for (let i = 0; i < ppCount; i++) {
    s += ` ${generatePP(bank, limits)}`;
  }
  return s;
}

function buildAdvFront(bank: WordBank, limits: GrammarLimits): string {
  const adv = bank.advs.length > 0 ? pick(bank.advs) : "quietly";
  return `${adv}, ${generateNP(bank, limits)} ${generateVP(bank, limits)}`;
}

function buildPPFront(bank: WordBank, limits: GrammarLimits): string {
  const pp = generatePP(bank, limits);
  return `${pp}, ${generateNP(bank, limits)} ${generateVP(bank, limits)}`;
}

function buildSubFirst(bank: WordBank, limits: GrammarLimits): string {
  const conj = pick(SUB_CONJ);
  return `${conj} ${buildSimple(bank, limits)}, ${buildSimple(bank, limits)}`;
}

function buildCompound(bank: WordBank, limits: GrammarLimits): string {
  return `${buildSimple(bank, limits)} ${pick(COORD_CONJ)} ${buildSimple(bank, limits)}`;
}

export function generateSentence(bank: WordBank, difficulty: Difficulty): string {
  const limits = LIMITS[difficulty];

  interface Structure {
    weight: number;
    build: () => string;
  }

  const structures: Structure[] = [];
  structures.push({ weight: 6, build: () => buildSimple(bank, limits) });
  if (limits.advFront) structures.push({ weight: 2, build: () => buildAdvFront(bank, limits) });
  if (limits.ppFront) structures.push({ weight: 2, build: () => buildPPFront(bank, limits) });
  if (limits.sub) structures.push({ weight: 3, build: () => buildSubFirst(bank, limits) });
  if (limits.comp) structures.push({ weight: 2, build: () => buildCompound(bank, limits) });

  const totalWeight = structures.reduce((sum, s) => sum + s.weight, 0);
  let roll = Math.random() * totalWeight;
  let sentence = "";
  for (const s of structures) {
    roll -= s.weight;
    if (roll <= 0) {
      sentence = s.build();
      break;
    }
  }
  if (!sentence) sentence = buildSimple(bank, limits);

  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);

  const endRoll = Math.random();
  if (endRoll < 0.04) {
    sentence += "!";
  } else if (endRoll < 0.06) {
    sentence += "?";
  } else {
    sentence += ".";
  }

  return sentence;
}
