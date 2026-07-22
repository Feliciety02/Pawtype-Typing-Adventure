import type { DayNightState } from "./DayNightController";

export function MoonRenderer({ state }: { state: DayNightState }) {
  return (
    <div
      className="world-moon"
      aria-hidden="true"
      style={{
        left: `${state.moon.x}%`,
        top: `${state.moon.y}%`,
        opacity: state.moon.opacity,
        ["--world-moon-glow" as string]: state.moon.glow,
      }}
    />
  );
}
