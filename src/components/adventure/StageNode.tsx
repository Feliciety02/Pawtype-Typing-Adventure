import { type Stage, type Status, rewardsFor, LOCK_ICON } from "@/lib/adventure/adventureData";
import { AdventureNodeImage } from "./AdventureNodeImage";
import { PixelIcon } from "../../lib/icons/PixelIcon";

export function StageNode({
  stage,
  index,
  status,
  image,
  onPlay,
}: {
  stage: Stage;
  index: number;
  status: Status;
  image?: string;
  onPlay: () => void;
}) {
  const accent =
    stage.difficulty === "Boss"
      ? "var(--color-primary)"
      : stage.difficulty === "Hard"
        ? "var(--coin)"
        : stage.difficulty === "Normal"
          ? "var(--leaf)"
          : "var(--sky)";
  const { xp, coins } = rewardsFor(stage);
  const actionLabel =
    status === "complete"
      ? "Completed"
      : status === "locked"
        ? `Complete Stage ${index}`
        : "Start Quest";

  return (
    <button
      onClick={onPlay}
      disabled={status === "locked"}
      className={`adventure-node pixel-card-sm adventure-node-${status} adventure-node-${stage.difficulty.toLowerCase()} ${index % 2 === 0 ? "adventure-node-low" : "adventure-node-high"}`}
      style={{ "--stage-accent": accent } as Record<string, string>}
      type="button"
    >
      <div className="adventure-stage-ribbon">Stage {index + 1}</div>
      <div className="adventure-node-visual" data-has-image={Boolean(image)}>
        {image ? (
          <AdventureNodeImage
            src={image}
            alt={`${stage.name} node`}
            className="adventure-node-img"
          />
        ) : (
          <span className="adventure-node-fallback">
            <PixelIcon emoji={stage.emoji} />
          </span>
        )}
        {status === "locked" && (
          <span className="adventure-node-overlay">
            <img src={LOCK_ICON} alt="Locked" className="adventure-lock-img" draggable={false} />
          </span>
        )}
      </div>
      <div className="adventure-node-name-plaque">{stage.name}</div>
      <div className="adventure-node-meta">
        <span className="adventure-difficulty-pill">{stage.difficulty}</span>
        <span className="adventure-wpm-pill">{stage.goal} WPM</span>
      </div>
      {status !== "complete" && (
        <div className="adventure-node-reward">
          <span>+{xp} XP</span>
          <span>+{coins} Coins</span>
        </div>
      )}
      <div className="adventure-node-action">{actionLabel}</div>
    </button>
  );
}
