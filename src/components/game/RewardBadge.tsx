import { PixelIcon } from "../../lib/icons/PixelIcon";

export function RewardBadge({ icon, label, value, collected = false }: { icon: string; label: string; value: number; collected?: boolean }) {
  return (
    <span className={`quest-reward-badge ${collected ? "is-collected" : ""}`}>
      <PixelIcon emoji={icon} className="quest-reward-icon" />
      <span className="quest-reward-value">{collected ? value : `+${value}`}</span>
      <span className="quest-reward-label">{label}</span>
    </span>
  );
}
