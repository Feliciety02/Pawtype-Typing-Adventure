import { useEffect } from "react";
import { LightingOverlay } from "./LightingOverlay";
import { MoonRenderer } from "./MoonRenderer";
import { SkyRenderer } from "./SkyRenderer";
import { StarsRenderer } from "./StarsRenderer";
import { SunRenderer } from "./SunRenderer";
import type { DayNightState } from "./DayNightController";
import { WorldParticles } from "./WorldParticles";
import { useDayNightState } from "./useDayNightState";

export type WorldRendererProps = {
  environmentSrc: string;
  className?: string;
  state?: DayNightState;
};

export function WorldRenderer({ environmentSrc, className = "", state }: WorldRendererProps) {
  const liveDayNight = useDayNightState();
  const dayNight = state ?? liveDayNight;

  useEffect(() => {
    const assets = [
      environmentSrc,
      "/camp/scenes/campscene-background-midnight.webp",
      "/camp/scenes/campscene-background-pre-dawn.webp",
      "/camp/scenes/campscene-background-sunrise.webp",
      "/camp/scenes/campscene-background-morning.webp",
      "/camp/scenes/campscene-background-noon.webp",
      "/camp/scenes/campscene-background-early-afternoon.webp",
      "/camp/scenes/campscene-background-sunset.webp",
      "/camp/scenes/campscene-background-twilight.webp",
    ];
    const images = assets.map((src) => {
      const image = new Image();
      image.decoding = "async";
      image.src = src;
      return image;
    });

    return () => {
      images.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [environmentSrc]);

  return (
    <div className={`world-renderer ${className}`} data-segment={dayNight.current}>
      <SkyRenderer state={dayNight} />
      <StarsRenderer state={dayNight} />
      <MoonRenderer state={dayNight} />
      <SunRenderer state={dayNight} />
      <div
        className="world-static-environment"
        aria-hidden="true"
        style={{ backgroundImage: `url("${environmentSrc}")` }}
      />
      <LightingOverlay state={dayNight} />
      <WorldParticles state={dayNight} />
    </div>
  );
}
