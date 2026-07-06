import { type Rarity, RARITY_COLOR } from "./shopData";

export function RarityBadge({ rarity }: { rarity: Rarity }) {
  return (
    <span
      className="font-pixel text-[0.55rem] px-2 py-0.5 rounded"
      style={{
        background: "color-mix(in oklab, " + RARITY_COLOR[rarity] + " 18%, transparent)",
        color: RARITY_COLOR[rarity],
        border: `1px solid ${RARITY_COLOR[rarity]}`,
      }}
    >
      {rarity.toUpperCase()}
    </span>
  );
}

export function OwnedBadge({
  label = "Owned",
  color = "var(--leaf)",
}: {
  label?: string;
  color?: string;
}) {
  return (
    <span
      className="font-pixel text-[0.55rem] px-2 py-0.5 rounded"
      style={{
        background: "color-mix(in oklab, " + color + " 22%, transparent)",
        color,
        border: `1px solid ${color}`,
      }}
    >
      {label}
    </span>
  );
}

export function PriceBadge({ price }: { price: number }) {
  return (
    <span className="font-pixel text-[0.7rem]" style={{ color: "var(--coin)" }}>
      🪙 {price === 0 ? "Free" : price.toLocaleString()}
    </span>
  );
}

export function SectionHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3 mb-4 flex-wrap">
      <div>
        <h3 className="font-display text-2xl leading-none">{title}</h3>
        {subtitle && (
          <p className="font-pixel text-[0.6rem] text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  );
}
