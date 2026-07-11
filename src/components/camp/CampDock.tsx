import { useNavigate } from "@tanstack/react-router";

const DOCK_ITEMS: { icon: string; label: string; path: string }[] = [
  { icon: "⌨", label: "Train", path: "/practice" },
  { icon: "🗺", label: "Quest", path: "/adventure" },
  { icon: "📖", label: "Learn", path: "/lessons" },
  { icon: "🛒", label: "Shop", path: "/shop" },
  { icon: "🎖️", label: "Awards", path: "/achievements" },
  { icon: "⚙", label: "Settings", path: "/settings" },
];

export function CampDock() {
  const navigate = useNavigate();
  return (
    <div className="camp-dock" role="navigation" aria-label="Camp dock">
      {DOCK_ITEMS.map((item) => (
        <button
          key={item.path}
          type="button"
          className="camp-dock-btn"
          onClick={() => navigate({ to: item.path })}
        >
          <span className="camp-dock-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
