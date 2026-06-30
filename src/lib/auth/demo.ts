const DEMO_MODE_KEY = "pawtype-demo-mode";
const DEMO_MODE_EVENT = "pawtype-demo-mode-change";

export function isDemoModeEnabled() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DEMO_MODE_KEY) === "1";
}

export function setDemoModeEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  if (enabled) {
    window.localStorage.setItem(DEMO_MODE_KEY, "1");
  } else {
    window.localStorage.removeItem(DEMO_MODE_KEY);
  }
  window.dispatchEvent(new Event(DEMO_MODE_EVENT));
}

export function subscribeToDemoMode(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(DEMO_MODE_EVENT, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(DEMO_MODE_EVENT, handler);
  };
}
