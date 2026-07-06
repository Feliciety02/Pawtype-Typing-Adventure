import { ComingSoonBadge } from "../shared/ComingSoonBadge";

export function SectionHeader({
  title,
  subtitle,
  comingSoon = false,
}: {
  title: string;
  subtitle: string;
  comingSoon?: boolean;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-3xl">{title}</h2>
        <p className="font-pixel text-[0.65rem] text-muted-foreground mt-1">{subtitle}</p>
      </div>
      {comingSoon && <ComingSoonBadge />}
    </div>
  );
}
