import { useEffect, useState } from "react";
import {
  getNotifications,
  markAllRead,
  clearNotifications,
  subscribeNotifications,
  type Notification,
} from "../../lib/game/notifications";

function formatAgo(ts: number) {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<Notification[]>(getNotifications());

  useEffect(() => {
    const unsub = subscribeNotifications(() => setItems(getNotifications()));
    return unsub;
  }, []);

  useEffect(() => {
    if (items.some((n) => !n.read)) {
      const t = setTimeout(() => markAllRead(), 400);
      return () => clearTimeout(t);
    }
  }, [items]);

  return (
    <div
      className="hud-dropdown hud-dropdown-right animate-pixel-pop"
      style={{ minWidth: 280, maxWidth: 320 }}
    >
      <div className="hud-dropdown-title flex items-center justify-between">
        <span>Notifications</span>
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => clearNotifications()}
            className="font-pixel text-[0.5rem] underline"
            style={{ color: "var(--muted-foreground)" }}
          >
            Clear
          </button>
        )}
      </div>
      {items.length === 0 ? (
        <p className="font-pixel text-[0.6rem] text-muted-foreground py-3 text-center">
          No notifications yet. Keep typing!
        </p>
      ) : (
        <ul className="flex flex-col gap-2 max-h-[280px] overflow-auto">
          {items.map((n) => (
            <li
              key={n.id}
              className="pixel-card-sm p-2 flex items-start gap-2"
              style={{ borderColor: n.read ? undefined : "var(--coin)" }}
            >
              <span className="text-lg shrink-0">{n.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="font-pixel text-[0.6rem]">{n.title}</div>
                <p className="font-pixel text-[0.55rem] text-muted-foreground leading-snug mt-0.5">
                  {n.body}
                </p>
                <div className="font-pixel text-[0.5rem] text-muted-foreground mt-1">
                  {formatAgo(n.timestamp)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button type="button" onClick={onClose} className="pixel-btn pixel-btn-secondary w-full mt-2">
        Close
      </button>
    </div>
  );
}
