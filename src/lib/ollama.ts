import { createServerFn } from "@tanstack/react-start";

const OLLAMA_URL = "http://localhost:11434/api/generate";

export const ollamaGenerate = createServerFn({ method: "POST" })
  .validator((data: { prompt: string }) => data)
  .handler(async ({ data }) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ model: "llama3.2:1b", prompt: data.prompt, stream: false }),
      });
      if (!res.ok) return null;
      const json = await res.json();
      return (json.response ?? "").trim() || null;
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  });
