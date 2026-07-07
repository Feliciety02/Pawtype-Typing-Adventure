import type { DayNightState } from "./DayNightController";

export function SunRenderer({ state }: { state: DayNightState }) {
  return (
    <div
      className="world-sun"
      aria-hidden="true"
      style={{
        left: `${state.sun.x}%`,
        top: `${state.sun.y}%`,
        opacity: state.sun.opacity,
        ["--world-sun-glow" as string]: state.sun.glow,
      }}
    />
  );
}

