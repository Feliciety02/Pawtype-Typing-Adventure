import type { DayNightState } from "./DayNightController";

export function StarsRenderer({ state }: { state: DayNightState }) {
  return (
    <>
      <div className="world-stars" aria-hidden="true" style={{ opacity: state.starsOpacity }} />
      <div
        className="world-constellations"
        aria-hidden="true"
        style={{ opacity: state.constellationsOpacity }}
      />
    </>
  );
}
