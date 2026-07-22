import { useEffect, useState } from "react";
import {
  getNotifications,
  markAllRead,
  clearNotifications,
  subscribeNotifications,
  type Notification,
} from "../../lib/game/notifications";
import { Button } from "../ui/button";

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
      id="hud-notifications-panel"
      className="hud-dropdown hud-dropdown-right hud-notifications-panel animate-pixel-pop"
    >
      <div className="hud-notifications-head">
        <div>
          <span className="hud-notifications-eyebrow">Message board</span>
          <h2 className="hud-dropdown-title">Notifications</h2>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => clearNotifications()}
            className="hud-notifications-clear"
          >
            Clear
          </button>
        )}
      </div>
      {items.length === 0 ? (
        <div className="hud-notifications-empty">
          <span className="hud-notifications-empty-mark" aria-hidden="true">✦</span>
          <p>No notifications yet</p>
          <span>Keep typing to earn updates.</span>
        </div>
      ) : (
        <ul className="hud-notifications-list">
          {items.map((n) => (
            <li
              key={n.id}
              className="hud-notification-item"
              style={{ borderColor: n.read ? undefined : "var(--coin)" }}
            >
              <span className="hud-notification-emoji">{n.emoji}</span>
              <div className="hud-notification-copy">
                <strong>{n.title}</strong>
                <p>{n.body}</p>
                <time>{formatAgo(n.timestamp)}</time>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Button variant="secondary" onClick={onClose} className="hud-notifications-close">
        Close
      </Button>
    </div>
  );
}
