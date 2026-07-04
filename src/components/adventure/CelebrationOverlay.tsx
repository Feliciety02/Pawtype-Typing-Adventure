import { useMemo, type CSSProperties } from "react";
import type { WorldId } from "../WorldTheme";

type ResultState = "win" | "lose";

type CelebrationOverlayProps = {
  active: boolean;
  result: ResultState | null;
  world: WorldId;
  xp: number;
  coins: number;
};

type ParticleConfig = {
  glyphs: string[];
  confetti: string[];
  glow: string;
  dust: string[];
};

const PARTICLE_MAP: Record<WorldId, ParticleConfig> = {
  cafe: {
    glyphs: ["*", "+", "."],
    confetti: ["#f2b665", "#d98d53", "#f6e7c5", "#8fcf89"],
    glow: "rgba(241, 190, 115, 0.28)",
    dust: [".", "+", "~"],
  },
  forest: {
    glyphs: ["*", "v", "+"],
    confetti: ["#7abf6f", "#a8d98f", "#d6f0c7", "#f0ce7f"],
    glow: "rgba(120, 182, 114, 0.28)",
    dust: [".", ":", "+"],
  },
  ocean: {
    glyphs: ["o", "*", "~"],
    confetti: ["#6ab8e6", "#b2e6f8", "#85d2ff", "#f6e4ba"],
    glow: "rgba(110, 189, 235, 0.28)",
    dust: [".", "o", ":"],
  },
  sakura: {
    glyphs: ["*", "x", "+"],
    confetti: ["#f6b8c9", "#ffd6e3", "#f29fb3", "#f7e7c7"],
    glow: "rgba(243, 174, 198, 0.3)",
    dust: [".", "+", ":"],
  },
  castle: {
    glyphs: ["*", "+", "!"],
    confetti: ["#ceb1ff", "#f0d87c", "#8f7de0", "#f7efd8"],
    glow: "rgba(209, 180, 255, 0.28)",
    dust: [".", "+", ":"],
  },
  space: {
    glyphs: ["*", "+", "o"],
    confetti: ["#78cbff", "#b99bff", "#f7f2bf", "#7de0e0"],
    glow: "rgba(129, 196, 255, 0.32)",
    dust: [".", "*", ":"],
  },
  autumn: {
    glyphs: ["*", "v", "+"],
    confetti: ["#e8aa4e", "#ca7442", "#88b26a", "#f5d9a4"],
    glow: "rgba(225, 165, 75, 0.3)",
    dust: [".", "+", "~"],
  },
  mushroom: {
    glyphs: ["*", "o", "+"],
    confetti: ["#d8a0ff", "#f7c3ea", "#95e6b2", "#ffeaa9"],
    glow: "rgba(207, 164, 255, 0.3)",
    dust: [".", ":", "*"],
  },
  sunflower: {
    glyphs: ["*", "+", "."],
    confetti: ["#efc64d", "#ffe494", "#88be63", "#f7f0cf"],
    glow: "rgba(238, 201, 89, 0.3)",
    dust: [".", "+", ":"],
  },
  "volcanic-forge": {
    glyphs: ["*", "+", "!"],
    confetti: ["#ff9d4d", "#ff6c4d", "#f7d28c", "#d6563a"],
    glow: "rgba(255, 132, 83, 0.32)",
    dust: [".", "+", ":"],
  },
  "desert-oasis": {
    glyphs: ["*", ".", "+"],
    confetti: ["#e7c264", "#f7e6b6", "#9ec47a", "#d8a56d"],
    glow: "rgba(227, 193, 108, 0.3)",
    dust: [".", ":", "~"],
  },
  "steam-punk-workshop": {
    glyphs: ["*", "+", "#"],
    confetti: ["#c78152", "#efc180", "#7db0ce", "#f5ead7"],
    glow: "rgba(212, 152, 91, 0.3)",
    dust: [".", "+", ":"],
  },
  "frostveil-kingdom": {
    glyphs: ["*", "+", "o"],
    confetti: ["#b7dfff", "#f4fbff", "#a8c8ff", "#d9efff"],
    glow: "rgba(176, 221, 255, 0.3)",
    dust: [".", "*", ":"],
  },
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function PixelConfetti({
  world,
  active,
}: {
  world: WorldId;
  active: boolean;
}) {
  const config = PARTICLE_MAP[world];
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        side: index % 2 === 0 ? "left" : "right",
        left: index % 2 === 0 ? randomBetween(2, 18) : randomBetween(82, 98),
        delay: randomBetween(0, 0.35),
        duration: randomBetween(1.15, 1.8),
        drift: randomBetween(index % 2 === 0 ? 18 : -28, index % 2 === 0 ? 36 : -14),
        rotate: randomBetween(-220, 220),
        size: randomBetween(6, 13),
        color: config.confetti[index % config.confetti.length],
      })),
    [config.confetti],
  );

  if (!active) return null;

  return (
    <div className="celebration-confetti" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="celebration-confetti-piece"
          style={
            {
              left: `${piece.left}%`,
              "--particle-delay": `${piece.delay}s`,
              "--particle-duration": `${piece.duration}s`,
              "--particle-drift": `${piece.drift}px`,
              "--particle-rotate": `${piece.rotate}deg`,
              "--particle-size": `${piece.size}px`,
              "--particle-color": piece.color,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function BiomeParticleEmitter({
  world,
  active,
}: {
  world: WorldId;
  active: boolean;
}) {
  const config = PARTICLE_MAP[world];
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        id: index,
        glyph: config.glyphs[index % config.glyphs.length],
        left: randomBetween(6, 94),
        top: randomBetween(8, 40),
        delay: randomBetween(0, 0.9),
        duration: randomBetween(2.2, 4.2),
        drift: randomBetween(-24, 24),
        color: config.confetti[index % config.confetti.length],
      })),
    [config.confetti, config.glyphs],
  );

  if (!active) return null;

  return (
    <div className="celebration-biome-particles" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="celebration-biome-particle"
          style={
            {
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              color: particle.color,
              "--particle-delay": `${particle.delay}s`,
              "--particle-duration": `${particle.duration}s`,
              "--particle-drift": `${particle.drift}px`,
            } as CSSProperties
          }
        >
          {particle.glyph}
        </span>
      ))}
    </div>
  );
}

export function VictoryParticles({
  world,
  active,
  xp,
  coins,
}: {
  world: WorldId;
  active: boolean;
  xp: number;
  coins: number;
}) {
  const config = PARTICLE_MAP[world];
  const floaters = useMemo(
    () => [
      { id: "xp", text: `+${xp} XP`, left: "12%", delay: "0.22s" },
      { id: "coin", text: `+${coins} COINS`, left: "78%", delay: "0.34s" },
    ],
    [coins, xp],
  );

  if (!active) return null;

  return (
    <div className="celebration-victory" aria-hidden="true">
      <div className="celebration-glow" style={{ "--celebration-glow": config.glow } as CSSProperties} />
      <PixelConfetti active={active} world={world} />
      <BiomeParticleEmitter active={active} world={world} />
      <div className="celebration-floaters">
        {floaters.map((floater) => (
          <span
            key={floater.id}
            className="celebration-floater"
            style={{ left: floater.left, animationDelay: floater.delay }}
          >
            {floater.text}
          </span>
        ))}
      </div>
    </div>
  );
}

export function FailureParticles({
  world,
  active,
}: {
  world: WorldId;
  active: boolean;
}) {
  const config = PARTICLE_MAP[world];
  const fragments = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        glyph: config.dust[index % config.dust.length],
        left: randomBetween(12, 88),
        top: randomBetween(14, 72),
        delay: randomBetween(0, 0.25),
        drift: randomBetween(-18, 18),
      })),
    [config.dust],
  );

  if (!active) return null;

  return (
    <div className="celebration-failure" aria-hidden="true">
      <div className="celebration-failure-overlay" />
      <div className="celebration-failure-fragments">
        {fragments.map((fragment) => (
          <span
            key={fragment.id}
            className="celebration-failure-fragment"
            style={
              {
                left: `${fragment.left}%`,
                top: `${fragment.top}%`,
                "--particle-delay": `${fragment.delay}s`,
                "--particle-drift": `${fragment.drift}px`,
              } as CSSProperties
            }
          >
            {fragment.glyph}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CelebrationOverlay({
  active,
  result,
  world,
  xp,
  coins,
}: CelebrationOverlayProps) {
  if (!active || !result) return null;

  return result === "win" ? (
    <VictoryParticles active={active} world={world} xp={xp} coins={coins} />
  ) : (
    <FailureParticles active={active} world={world} />
  );
}
