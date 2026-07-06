export type Notification = {
  id: string;
  emoji: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
};

const KEY = "pawtype-notifications";
const MAX = 20;

function load(): Notification[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(list: Notification[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
    window.dispatchEvent(new Event("pawtype-notif-change"));
  } catch {
    /* ignore */
  }
}

export function getNotifications(): Notification[] {
  return load();
}

export function pushNotification(n: Omit<Notification, "id" | "timestamp" | "read">) {
  const id = `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const next: Notification[] = [{ ...n, id, timestamp: Date.now(), read: false }, ...load()].slice(
    0,
    MAX,
  );
  save(next);
}

export function markAllRead() {
  save(load().map((n) => ({ ...n, read: true })));
}

export function clearNotifications() {
  save([]);
}

export function subscribeNotifications(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener("pawtype-notif-change", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("pawtype-notif-change", handler);
    window.removeEventListener("storage", handler);
  };
}
