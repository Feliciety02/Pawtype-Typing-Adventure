import { useState } from "react";
import { X } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { LESSONS, type Lesson } from "../lib/game/lessons";
import { TypingArena } from "./TypingArena";

const DIFFICULTY_STARS: Record<Lesson["difficulty"], number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

export function LessonsCard() {
  const [active, setActive] = useState<Lesson | null>(null);

  return (
    <div className="pixel-card p-5">
      <SectionHeader title="Lessons" subtitle="A gentle path from sprout to scholar." />
      <ul className="flex flex-col gap-3">
        {LESSONS.map((l) => {
          const stars = DIFFICULTY_STARS[l.difficulty];
          const isActive = active?.id === l.id;
          return (
            <li
              key={l.id}
              className="pixel-card-sm p-3 flex items-center gap-3"
              style={isActive ? { borderColor: "var(--coin)", boxShadow: "0 0 0 2px var(--coin) inset" } : undefined}
            >
              <div
                className="grid place-items-center text-2xl shrink-0"
                style={{
                  width: 48,
                  height: 48,
                  background: "var(--color-muted)",
                  border: "2px solid var(--color-border)",
                  borderRadius: 4,
                }}
              >
                {l.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-pixel text-sm truncate">{l.title}</div>
                <div className="font-pixel text-[0.6rem] text-muted-foreground mt-1">{l.meta}</div>
              </div>
              <div className="flex gap-0.5 mr-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="font-pixel text-sm"
                    style={{ color: i < stars ? "var(--coin)" : "var(--muted-foreground)" }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <button
                className="pixel-btn"
                onClick={() => setActive(isActive ? null : l)}
                title={isActive ? "Close lesson" : "Start lesson"}
              >
                {isActive ? "Close" : "Start"}
              </button>
            </li>
          );
        })}
      </ul>

      {active && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-display text-2xl leading-none">{active.emoji} {active.title}</div>
              <p className="font-pixel text-[0.6rem] text-muted-foreground mt-1">{active.meta}</p>
            </div>
            <button
              className="pixel-btn pixel-btn-secondary"
              onClick={() => setActive(null)}
              type="button"
              aria-label="Close lesson"
            >
              <X size={12} /> Close
            </button>
          </div>
          <TypingArena key={active.id} customWords={active.words} customTitle={active.title} />
        </div>
      )}
    </div>
  );
}
