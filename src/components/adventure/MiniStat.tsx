export function MiniStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="pixel-card-sm p-2 text-center" style={{ borderLeft: `4px solid ${accent}` }}>
      <div className="font-pixel text-[0.55rem] text-muted-foreground uppercase">{label}</div>
      <div className="font-display text-xl leading-tight" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}
