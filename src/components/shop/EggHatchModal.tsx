import { useEffect, useRef, useState } from "react";
import { ModalShell, PixelButton } from "../modals/ModalShell";
import { PixelPet } from "../coach/PixelPet";
import { markEggClaimed, petLabel, type EggMilestone } from "../../lib/game/eggs";
import { useGame } from "../../lib/game/store";
import { PET_NAMES } from "../../lib/game/types";

type Phase = "intro" | "shake" | "crack" | "reveal";

type Props = {
  milestone: EggMilestone;
  onClose: () => void;
};

export function EggHatchModal({ milestone, onClose }: Props) {
  const { state, dispatch } = useGame();
  const [phase, setPhase] = useState<Phase>("intro");
  const hatchTimers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const alreadyOwned = state.inventory.pets.some((p) => p.type === milestone.petType);

  useEffect(() => {
    return () => {
      hatchTimers.current.forEach((timer) => clearTimeout(timer));
      hatchTimers.current = [];
    };
  }, []);

  useEffect(() => {
    if (phase !== "reveal") return;
    // grant pet + bonus coins once (or coins-only if already owned)
    if (!alreadyOwned) {
      dispatch({
        type: "ADOPT_PET",
        pet: {
          type: milestone.petType,
          name: PET_NAMES[milestone.petType],
          xp: 0,
          level: 1,
          adoptedAt: Date.now(),
        },
      });
    } else {
      dispatch({ type: "EARN_COINS", amount: 250 });
    }
    markEggClaimed(milestone.index);
  }, [phase, milestone, alreadyOwned, dispatch]);

  const startHatch = () => {
    hatchTimers.current.forEach((timer) => clearTimeout(timer));
    hatchTimers.current = [];
    setPhase("shake");
    hatchTimers.current = [
      setTimeout(() => setPhase("crack"), 900),
      setTimeout(() => setPhase("reveal"), 1900),
    ];
  };

  return (
    <ModalShell ariaLabel="Egg reward" onClose={onClose} className="pixel-modal-shell-egg">
      <div className="egg-hatch-modal">
        <div className="egg-hatch-header">
          <div className="egg-hatch-kicker">Milestone Reward</div>
          <div className="egg-hatch-title">
            {phase === "reveal" ? "A new friend hatched!" : `Egg #${milestone.index}`}
          </div>
          <div className="egg-hatch-sub">
            {phase === "reveal"
              ? alreadyOwned
                ? `You already had ${petLabel(milestone.petType)} — enjoy 250 bonus coins!`
                : `Meet ${petLabel(milestone.petType)}, your new pixel companion.`
              : `You completed ${milestone.threshold} lessons. Tap the egg to hatch it!`}
          </div>
        </div>

        <div className="egg-hatch-stage">
          <div className={`egg-hatch-glow egg-hatch-glow-${phase}`} aria-hidden="true" />
          {phase !== "reveal" ? (
            <button
              type="button"
              className={`egg-hatch-egg egg-hatch-egg-${phase}`}
              onClick={phase === "intro" ? startHatch : undefined}
              aria-label="Hatch egg"
            >
              <span className="egg-hatch-egg-shell" />
              <span className="egg-hatch-egg-crack" />
              <span className="egg-hatch-egg-spot egg-hatch-egg-spot-1" />
              <span className="egg-hatch-egg-spot egg-hatch-egg-spot-2" />
              <span className="egg-hatch-egg-spot egg-hatch-egg-spot-3" />
            </button>
          ) : (
            <div className="egg-hatch-reveal">
              <PixelPet
                pet={{
                  type: milestone.petType,
                  name: PET_NAMES[milestone.petType],
                  xp: 0,
                  level: 1,
                  adoptedAt: Date.now(),
                }}
                size={140}
                showDetails={false}
              />
            </div>
          )}
          {/* sparkles */}
          <div className="egg-hatch-sparkles" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="egg-hatch-sparkle" style={{ ["--i" as string]: i }} />
            ))}
          </div>
        </div>

        <div className="egg-hatch-actions">
          {phase === "intro" && (
            <PixelButton variant="primary" onClick={startHatch}>
              Tap to hatch
            </PixelButton>
          )}
          {phase === "reveal" && (
            <PixelButton variant="primary" onClick={onClose}>
              {alreadyOwned ? "Collect Coins" : "Add to Party"}
            </PixelButton>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
