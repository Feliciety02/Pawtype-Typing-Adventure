import type { WorldId } from "../../components/WorldTheme";

const OLLAMA_URL = "http://localhost:11434/api/generate";

async function ollamaGenerate(prompt: string): Promise<string | null> {
  try {
    const res = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama3.2:1b", prompt, stream: false }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.response ?? "").trim() || null;
  } catch {
    return null;
  }
}

const WORLD_THEMES: Record<WorldId, string> = {
  cafe: "a cozy café with warm coffee, rain tapping windows, and soft jazz",
  forest: "a mossy forest with ferns, dappled sunlight, and a babbling brook",
  ocean: "a tide pool with crashing waves, salty air, and hidden sea creatures",
  sakura: "a cherry blossom park with drifting petals, a koi pond, and paper lanterns",
  castle: "a royal castle with velvet drapes, candlelit halls, and stone archways",
  space: "a starfield with glowing nebulae, floating comets, and deep cosmic silence",
};

export async function generateWorldText(worldId: WorldId): Promise<string | null> {
  const theme = WORLD_THEMES[worldId];
  const prompt = `Write exactly two short, simple sentences describing ${theme}. Use only common English words. No markdown. No quotes. Just the text.`;
  return ollamaGenerate(prompt);
}

export async function generateWeakSpotWords(mistakeChars: string[]): Promise<string[] | null> {
  if (mistakeChars.length === 0) return null;
  const chars = [...new Set(mistakeChars)].join("");
  const prompt = `Generate 8 common English words that all contain the letters "${chars}". Return them as a comma-separated list. No markdown. No numbers. Just the words.`;
  const result = await ollamaGenerate(prompt);
  if (!result) return null;
  return result.split(",").map((w) => w.trim().toLowerCase()).filter(Boolean);
}

const MOOD_PROMPTS: Record<string, string> = {
  idle: "Generate a short, cute sentence (max 8 words) encouraging someone to start typing. Be pixel-cozy themed.",
  happy: "The user is typing well. Generate a short, cute sentence (max 8 words) praising them. Be pixel-cozy themed.",
  oops: "The user just made a typo. Generate a short, cute sentence (max 8 words) telling them to slow down and stay calm. Be pixel-cozy themed.",
  sleep: "Generate a short, cute sentence (max 8 words) asking someone to wake up and start typing. Be pixel-cozy themed.",
};

export async function generateMascotLine(mood: string): Promise<string | null> {
  const prompt = MOOD_PROMPTS[mood];
  if (!prompt) return null;
  return ollamaGenerate(prompt);
}

export async function generateQuestText(stageName: string, worldId: WorldId): Promise<string | null> {
  const theme = WORLD_THEMES[worldId];
  const prompt = `Write one short, atmospheric sentence (max 15 words) setting the scene for "${stageName}" in ${theme}. Make it feel like a cozy pixel-art game. No markdown. No quotes.`;
  return ollamaGenerate(prompt);
}
