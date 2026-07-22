import type { DayNightState } from "./DayNightController";

export function LightingOverlay({ state }: { state: DayNightState }) {
  return (
    <>
      <div
        className="world-cloud-tint"
        aria-hidden="true"
        style={{ background: state.cloudTint }}
      />
      <div
        className="world-water-reflection"
        aria-hidden="true"
        style={{ opacity: state.waterHighlightOpacity }}
      />
      <div
        className="world-lighting-overlay"
        aria-hidden="true"
        style={{ background: state.lightingOverlay }}
      />
    </>
  );
}
