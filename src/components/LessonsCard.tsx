import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Check, X, Lock } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import {
  UNITS,
  loadCompletedLessons,
  markLessonCompleted,
  unitProgress,
  type Lesson,
  type Unit,
  type LessonDifficulty,
} from "../lib/game/curriculum";
import { TypingArena } from "./TypingArena";

const DIFFICULTY_LABEL: Record<LessonDifficulty, { label: string; stars: number; color: string }> = {
  beginner:     { label: "Beginner",     stars: 1, color: "var(--leaf)" },
  easy:         { label: "Easy",         stars: 1, color: "var(--leaf)" },
  intermediate: { label: "Intermediate", stars: 2, color: "var(--coin)" },
  advanced:     { label: "Advanced",     stars: 3, color: "var(--color-primary)" },
  expert:       { label: "Expert",       stars: 3, color: "var(--color-primary)" },
  master:       { label: "Master",       stars: 3, color: "var(--color-destructive)" },
};

export function LessonsCard() {
  const [completed, setCompleted] = useState<Set<string>>(() => loadCompletedLessons());
  const [openUnits, setOpenUnits] = useState<Set<string>>(() => new Set([UNITS[0].id]));
  const [active, setActive] = useState<{ unit: Unit; lesson: Lesson } | null>(null);

  // Refresh completion state on external updates (e.g., from TypingArena).
  useEffect(() => {
    const refresh = () => setCompleted(loadCompletedLessons());
    window.addEventListener("pawtype-lesson-completed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("pawtype-lesson-completed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const totals = useMemo(() => {
    const total = UNITS.reduce((n, u) => n + u.lessons.length, 0);
    const done = UNITS.reduce(
      (n, u) => n + u.lessons.filter((l) => completed.has(l.id)).length,
      0,
    );
    return { done, total };
  }, [completed]);

  const toggleUnit = (id: string) => {
    setOpenUnits((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startLesson = (unit: Unit, lesson: Lesson) => {
    setActive({ unit, lesson });
    setTimeout(() => {
      document.getElementById("lesson-runner")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const closeLesson = () => setActive(null);

  const handleFinish = () => {
    if (!active) return;
    markLessonCompleted(active.lesson.id);
    setCompleted(loadCompletedLessons());
  };

  const isUnitUnlocked = (index: number) => {
    if (index === 0) return true;
    const prev = UNITS[index - 1];
    return prev.lessons.every((l) => completed.has(l.id));
  };

  return (
    <div className="pixel-card p-5">
      <SectionHeader
        title="Curriculum"
        subtitle={`A guided path from home row to graduation · ${totals.done}/${totals.total} lessons complete`}
      />

      <div className="flex flex-col gap-3 mt-2">
        {UNITS.map((unit, idx) => {
          const open = openUnits.has(unit.id);
          const prog = unitProgress(unit, completed);
          const unlocked = isUnitUnlocked(idx);
          const isDone = prog.done === prog.total;

          return (
            <div key={unit.id} className="pixel-card-sm">
              <button
                type="button"
                onClick={() => unlocked && toggleUnit(unit.id)}
                className="w-full flex items-center gap-3 p-3 text-left"
                style={{ opacity: unlocked ? 1 : 0.55, cursor: unlocked ? "pointer" : "not-allowed" }}
                aria-expanded={open}
              >
                <div
                  className="grid place-items-center text-xl shrink-0"
                  style={{
                    width: 40, height: 40,
                    background: "var(--color-muted)",
                    border: "2px solid var(--color-border)",
                    borderRadius: 4,
                  }}
                >
                  {unlocked ? unit.emoji : <Lock size={14} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-pixel text-sm truncate">
                    Unit {unit.number} · {unit.title}
                    {isDone && <span className="ml-2" style={{ color: "var(--leaf)" }}>✓</span>}
                  </div>
                  <div className="font-pixel text-[0.6rem] text-muted-foreground mt-1 truncate">
                    {unit.purpose}
                  </div>
                </div>
                <div className="font-pixel text-[0.6rem] mr-2 shrink-0" style={{ color: "var(--muted-foreground)" }}>
                  {prog.done}/{prog.total}
                </div>
                {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {open && unlocked && (
                <ul className="flex flex-col gap-2 p-3 pt-0">
                  {unit.lessons.map((lesson) => {
                    const done = completed.has(lesson.id);
                    const diff = DIFFICULTY_LABEL[lesson.difficulty];
                    const isActive = active?.lesson.id === lesson.id;
                    return (
                      <li
                        key={lesson.id}
                        className="pixel-card-sm p-2 flex items-center gap-3"
                        style={isActive ? { borderColor: "var(--coin)", boxShadow: "0 0 0 2px var(--coin) inset" } : undefined}
                      >
                        <div
                          className="grid place-items-center shrink-0"
                          style={{
                            width: 32, height: 32,
                            background: done ? "var(--leaf)" : "var(--color-muted)",
                            border: "2px solid var(--color-border)",
                            borderRadius: 4,
                            color: done ? "var(--color-background)" : undefined,
                          }}
                          aria-hidden
                        >
                          {done ? <Check size={14} /> : <span className="text-sm">{lesson.emoji}</span>}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-pixel text-[0.7rem] truncate">{lesson.title}</div>
                          <div className="font-pixel text-[0.55rem] text-muted-foreground mt-0.5 truncate">
                            {diff.label} · {lesson.targetWpm} WPM · {lesson.targetAccuracy}% acc
                          </div>
                        </div>
                        <div className="hidden sm:flex gap-0.5 mr-1" aria-hidden>
                          {[0, 1, 2].map((i) => (
                            <span
                              key={i}
                              className="font-pixel text-[0.65rem]"
                              style={{ color: i < diff.stars ? diff.color : "var(--muted-foreground)" }}
                            >★</span>
                          ))}
                        </div>
                        <button
                          className="pixel-btn"
                          onClick={() => (isActive ? closeLesson() : startLesson(unit, lesson))}
                          title={isActive ? "Close" : done ? "Replay" : "Start"}
                        >
                          {isActive ? "Close" : done ? "Replay" : "Start"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {active && (
        <div id="lesson-runner" className="mt-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <div className="font-pixel text-[0.55rem] uppercase text-muted-foreground">
                Unit {active.unit.number} · {active.unit.title}
              </div>
              <div className="font-display text-2xl leading-none mt-1">
                {active.lesson.emoji} {active.lesson.title}
              </div>
              {active.lesson.note && (
                <p className="font-pixel text-[0.6rem] text-muted-foreground mt-2 max-w-xl">
                  {active.lesson.note}
                </p>
              )}
              <div className="font-pixel text-[0.55rem] text-muted-foreground mt-2">
                Target {active.lesson.targetWpm} WPM · {active.lesson.targetAccuracy}% accuracy
                {completed.has(active.lesson.id) && (
                  <span className="ml-2" style={{ color: "var(--leaf)" }}>✓ completed</span>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {!completed.has(active.lesson.id) && (
                <button className="pixel-btn" onClick={handleFinish} type="button" title="Mark this lesson complete">
                  <Check size={12} /> Mark done
                </button>
              )}
              <button
                className="pixel-btn pixel-btn-secondary"
                onClick={closeLesson}
                type="button"
                aria-label="Close lesson"
              >
                <X size={12} /> Close
              </button>
            </div>
          </div>
          <TypingArena
            key={active.lesson.id}
            customWords={active.lesson.words}
            customTitle={`${active.unit.title} · ${active.lesson.title}`}
          />
        </div>
      )}
    </div>
  );
}
