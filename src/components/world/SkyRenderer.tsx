import type { DayNightState } from "./DayNightController";
import type { DayNightSegment } from "./timeUtils";

const SKY_GRADIENTS: Record<DayNightSegment, string> = {
  midnight: "linear-gradient(180deg, #071027 0%, #12213f 42%, #24385e 100%)",
  predawn: "linear-gradient(180deg, #20254c 0%, #5f6da8 48%, #b6a6b5 100%)",
  sunrise: "linear-gradient(180deg, #2c95dc 0%, #8fd6f4 44%, #ffd1a6 100%)",
  morning: "linear-gradient(180deg, #0686d3 0%, #38c5ee 46%, #c7f1ff 100%)",
  noon: "linear-gradient(180deg, #0087d8 0%, #34bdea 52%, #c9f4ff 100%)",
  afternoon: "linear-gradient(180deg, #1a9ee0 0%, #62cdf0 50%, #fff1c4 100%)",
  sunset: "linear-gradient(180deg, #49346f 0%, #d87b56 45%, #ffbf74 100%)",
  twilight: "linear-gradient(180deg, #111a43 0%, #464b91 50%, #a37895 100%)",
};

export function SkyRenderer({ state }: { state: DayNightState }) {
  return (
    <div className="world-sky-layer" aria-hidden="true">
      <div className="world-sky-image" style={{ background: SKY_GRADIENTS[state.skyA] }} />
      <div
        className="world-sky-image world-sky-image-next"
        style={{
          background: SKY_GRADIENTS[state.skyB],
          opacity: state.skyOpacity,
        }}
      />
    </div>
  );
}
