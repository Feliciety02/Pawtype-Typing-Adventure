import type { View } from "../layout/Header";

type DockItem = { icon: string; label: string; view: View };

const DOCK_ITEMS: DockItem[] = [
  { icon: "⌨", label: "Train", view: "practice" },
  { icon: "🗺", label: "Quest", view: "adventure" },
  { icon: "📖", label: "Learn", view: "lessons" },
  { icon: "🛒", label: "Shop", view: "shop" },
  { icon: "🎖️", label: "Awards", view: "achievements" },
  { icon: "⚙", label: "Settings", view: "settings" },
];

export function CampDock({ onViewChange }: { onViewChange: (v: View) => void }) {
  return (
    <div className="camp-dock" role="navigation" aria-label="Camp dock">
      {DOCK_ITEMS.map((item) => (
        <button
          key={item.view}
          type="button"
          className="camp-dock-btn"
          onClick={() => onViewChange(item.view)}
        >
          <span className="camp-dock-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
