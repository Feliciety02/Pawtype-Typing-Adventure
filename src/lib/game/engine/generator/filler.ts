import type { WordBank } from "./types";
import { trackUsed, pickFresh } from "./tracker";

// ============================================================
export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function conjugate(verb: string): string {
  if (verb.endsWith("s") || verb.endsWith("x") || verb.endsWith("ch") || verb.endsWith("sh"))
    return verb + "es";
  if (verb.endsWith("y") && !/[aeiou]y/.test(verb)) return verb.slice(0, -1) + "ies";
  return verb + "s";
}

function pluralize(word: string): string {
  if (word.endsWith("s") || word.endsWith("x") || word.endsWith("ch") || word.endsWith("sh"))
    return word + "es";
  if (word.endsWith("y") && !/[aeiou]y/.test(word)) return word.slice(0, -1) + "ies";
  return word + "s";
}

export function fillTemplate(tpl: string, bank: WordBank): string {
  let result = tpl
    .replace(/\{noun\}s/g, () => {
      const w = pick(pickFresh(bank.nouns, 30));
      trackUsed([w]);
      return pluralize(w);
    })
    .replace(/\{noun\}/g, () => {
      const w = pick(pickFresh(bank.nouns, 30));
      trackUsed([w]);
      return w;
    })
    .replace(/\{adj\}/g, () => {
      const w = pick(pickFresh(bank.adjs, 20));
      trackUsed([w]);
      return w;
    })
    .replace(/\{adv\}/g, () => pick(bank.advs))
    .replace(/\{vrb\}/g, () => {
      const w = pick(pickFresh(bank.verbs, 25));
      trackUsed([w]);
      return w;
    })
    .replace(/\{verb\}/g, () => {
      const w = pick(pickFresh(bank.verbs, 25));
      trackUsed([w]);
      return conjugate(w);
    })
    .replace(/\{prep\}/g, () => pick(bank.preps));

  // Handle determiner variants
  result = result.replace(/\{det\}/g, () => pick(bank.dets));
  result = result.replace(/\{DET\}/g, () => {
    const d = pick(bank.dets);
    return d.charAt(0).toUpperCase() + d.slice(1);
  });

  // First letter uppercase
  result = result.charAt(0).toUpperCase() + result.slice(1);

  // Ensure it ends with a period
  if (!/[.!?]$/.test(result)) result += ".";

  return result;
}
