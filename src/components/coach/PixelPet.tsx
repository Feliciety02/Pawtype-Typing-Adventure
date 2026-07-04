import type { PetState, EvolutionStage } from "../../lib/game/types";
import { petEvolutionStage, petXpForLevel } from "../../lib/game/types";
import { PixelMascot } from "./PixelMascot";
import { PixelIcon } from "../../lib/icons/PixelIcon";

const EVO_GLOW: Record<EvolutionStage, string> = {
  baby: "none",
  adult: "drop-shadow(0 0 4px var(--coin))",
  evolved: "drop-shadow(0 0 8px var(--color-primary))",
  legendary: "drop-shadow(0 0 12px var(--sakura))",
};

const EVO_LABEL: Record<EvolutionStage, string> = {
  baby: "Baby",
  adult: "Adult",
  evolved: "Evolved",
  legendary: "Legendary",
};

const EVO_EMOJI: Record<EvolutionStage, string> = {
  baby: "🥚",
  adult: "⭐",
  evolved: "🌟",
  legendary: "👑",
};

type Props = {
  pet: PetState;
  size?: number;
  showDetails?: boolean;
};

export function PixelPet({ pet, size = 96, showDetails = true }: Props) {
  const stage = petEvolutionStage(pet.level);
  const needed = petXpForLevel(pet.level);
  const xpPct = needed > 0 ? Math.min(Math.round((pet.xp / needed) * 100), 100) : 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        style={{
          filter: EVO_GLOW[stage],
          transition: "filter 0.5s ease",
        }}
      >
        {pet.type === "cat" ? (
          <PixelMascot mood="idle" size={size} />
        ) : (
          <PetEmoji type={pet.type} stage={stage} size={size} />
        )}
      </div>

      {showDetails && (
        <>
          <div className="flex items-center gap-1.5">
            <span className="font-pixel text-[0.55rem] text-muted-foreground">
              {stage === "baby" ? "🥚" : stage === "adult" ? <PixelIcon emoji="⭐" /> : stage === "evolved" ? <PixelIcon emoji="🌟" /> : stage === "legendary" ? <PixelIcon emoji="⭐" /> : EVO_EMOJI[stage]} {EVO_LABEL[stage]}
            </span>
          </div>

          <div className="font-pixel text-[0.6rem] flex items-center gap-1">
            <span>❤ Lv {pet.level}</span>
          </div>

          <div className="pixel-bar w-full max-w-[100px]" style={{ height: 6 }}>
            <div
              className="h-full transition-all"
              style={{ width: `${xpPct}%`, background: "var(--coin)" }}
            />
          </div>

          <p className="font-pixel text-[0.5rem] text-muted-foreground">
            {pet.xp} / {needed} XP
          </p>
        </>
      )}
    </div>
  );
}

const PET_COLORS: Record<string, string> = {
  dog: "#c8a87c",
  fox: "#e8a040",
  rabbit: "#e8c8d0",
  panda: "#e8e8e8",
  penguin: "#4060c8",
  dragon: "#60c840",
};

function PetEmoji({ type, stage, size }: { type: string; stage: EvolutionStage; size: number }) {
  const emojiMap: Record<string, string> = {
    dog: "🐶", fox: "🦊", rabbit: "🐰",
    panda: "🐼", penguin: "🐧", dragon: "🐉",
  };
  const emoji = emojiMap[type] ?? "🐾";
  const borderColor = PET_COLORS[type] ?? "var(--color-border)";
  const borderWidth = stage === "legendary" ? 3 : stage === "evolved" ? 2 : 1;

  return (
    <div
      className="grid place-items-center"
      style={{
        width: size,
        height: size,
        background: `color-mix(in oklab, ${borderColor} 20%, var(--color-card))`,
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: Math.round(size / 4),
        fontSize: Math.round(size * 0.55),
        imageRendering: "pixelated",
      }}
    >
      {emoji}
    </div>
  );
}
