import { type ShopTab } from "@/lib/shop/shopData";

export function SegmentedSwitcher({
  value,
  onChange,
}: {
  value: ShopTab;
  onChange: (t: ShopTab) => void;
}) {
  const tabs: { id: ShopTab; label: string; icon: string }[] = [
    { id: "pets", label: "Pets", icon: "🐾" },
    { id: "themes", label: "Themes & Doodads", icon: "🏡" },
  ];
  return (
    <div
      className="shop-segmented-switcher inline-flex p-1 rounded-lg gap-1"
      style={{
        background: "var(--color-muted)",
        border: "2px solid var(--color-border)",
        boxShadow: "3px 3px 0 0 var(--color-border)",
      }}
    >
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="shop-segmented-button font-pixel text-[0.7rem] px-4 py-2 rounded-md transition-all"
            style={{
              background: active ? "var(--color-primary)" : "transparent",
              color: active ? "var(--color-primary-foreground)" : "var(--color-foreground)",
              transform: active ? "translateY(-1px)" : "none",
              boxShadow: active ? "2px 2px 0 0 var(--color-border)" : "none",
            }}
          >
            <span className="mr-1">{t.icon}</span>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
