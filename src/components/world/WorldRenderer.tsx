import { useEffect } from "react";
import { LightingOverlay } from "./LightingOverlay";
import { MoonRenderer } from "./MoonRenderer";
import { SkyRenderer } from "./SkyRenderer";
import { StarsRenderer } from "./StarsRenderer";
import { SunRenderer } from "./SunRenderer";
import { WorldParticles } from "./WorldParticles";
import { useDayNightState } from "./useDayNightState";

export type WorldRendererProps = {
  environmentSrc: string;
  className?: string;
};

export function WorldRenderer({ environmentSrc, className = "" }: WorldRendererProps) {
  const dayNight = useDayNightState();

  useEffect(() => {
    const assets = [
      environmentSrc,
      "/camp/scenes/campscene-background-midnight.png",
      "/camp/scenes/campscene-background-pre-dawn.png",
      "/camp/scenes/campscene-background-sunrise.png",
      "/camp/scenes/campscene-background-morning.png",
      "/camp/scenes/campscene-background-noon.png",
      "/camp/scenes/campscene-background-early-afternoon.png",
      "/camp/scenes/campscene-background-sunset.png",
      "/camp/scenes/campscene-background-twilight.png",
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
