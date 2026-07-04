import { useEffect, useState } from "react";
import { getCoachFeedback, type CoachInsight } from "../lib/game/coach";

const INSIGHT_STYLES: Record<CoachInsight["type"], { emoji: string; icon: string; accent: string }> = {
  praise: { emoji: "🌟", icon: "/Icons/glowing-star.png", accent: "var(--color-primary)" },
  tip: { emoji: "💡", icon: "/Icons/lightbulb.png", accent: "var(--coin)" },
  warning: { emoji: "⚠️", icon: "", accent: "var(--color-destructive)" },
  milestone: { emoji: "🏆", icon: "/Icons/trophy.png", accent: "var(--leaf)" },
  trend: { emoji: "📈", icon: "", accent: "var(--color-primary)" },
};

type Props = {
  wpm: number;
  accuracy: number;
  duration: number;
  correctChars: number;
  mistakes: number;
  bestCombo: number;
  keystrokes: { correct: boolean; target: string }[];
};

export function AICoach(props: Props) {
  const [insight, setInsight] = useState<CoachInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const isPersonalBest = props.wpm > 0 && props.wpm > parseInt(localStorage.getItem("pawtype-best-wpm") ?? "0");
    const isPerfect = props.accuracy === 100;

    if (isPersonalBest && props.wpm > 0) {
      try {
        localStorage.setItem("pawtype-best-wpm", String(props.wpm));
      } catch {}
    }

    getCoachFeedback({ ...props, isPersonalBest, isPerfect })
      .then((result) => {
        if (!cancelled) {
          setInsight(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [props.wpm, props.accuracy, props.duration, props.correctChars, props.mistakes, props.bestCombo, props.keystrokes]);

  if (loading) {
    return (
      <div className="pixel-card-sm p-3 flex items-center gap-2">
        <span className="font-pixel text-[0.55rem] animate-sparkle"><img src="/Icons/brain.png" alt="" className="pixel-icon" /></span>
        <span className="font-pixel text-[0.6rem] text-muted-foreground">Coach is checking your run...</span>
      </div>
    );
  }

  if (error || !insight) {
    return (
      <div className="pixel-card-sm p-3 flex items-center gap-2" style={{ opacity: 0.6 }}>
        <span className="font-pixel text-[0.55rem]"><img src="/Icons/robot-head.png" alt="" className="pixel-icon" /></span>
        <span className="font-pixel text-[0.6rem] text-muted-foreground">
          {error ? "Coach feedback is unavailable right now." : "Keep typing and I'll have feedback ready!"}
        </span>
      </div>
    );
  }

  const style = INSIGHT_STYLES[insight.type];

  return (
    <div
      className="pixel-card-sm p-3 flex items-start gap-2"
      style={{ borderLeft: `3px solid ${style.accent}` }}
    >
      <span className="font-pixel text-sm shrink-0 mt-0.5">{style.icon ? <img src={style.icon} alt="" className="pixel-icon" /> : style.emoji}</span>
      <div>
        <div className="font-pixel text-[0.55rem] uppercase mb-0.5" style={{ color: style.accent }}>
          Coach
        </div>
        <p className="font-pixel text-[0.65rem] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          {insight.text}
        </p>
      </div>
    </div>
  );
}
