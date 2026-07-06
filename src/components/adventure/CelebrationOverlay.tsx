import { useMemo, type CSSProperties } from "react";
import { PixelIcon } from "../../lib/icons/PixelIcon";
import type { WorldId } from "../shared/WorldTheme";

type ResultState = "win" | "lose";

type CelebrationOverlayProps = {
  active: boolean;
  result: ResultState | null;
  world: WorldId;
  stageEmoji?: string;
  xp: number;
  coins: number;
};

type ParticleAsset = {
  id: string;
  emoji: string;
};

type ParticleInstance = {
  id: number;
  asset: ParticleAsset;
  left: number;
  top?: number;
  origin: "left" | "center" | "right";
  delay: number;
  duration: number;
  drift: number;
  burstX?: number;
  burstY?: number;
  rotate: number;
  scale: number;
  bottomBounce: number;
};

type ParticleConfig = {
  victory: string[];
  glow: string;
  failure: string[];
};

const UNIVERSAL_VICTORY = ["🎉", "🎊", "✨", "🌟", "⭐", "🏆", "🪙", "💰", "❤️", "🐾"];

const FAILURE_PARTICLES = ["🍂", "💨", "🌧️", "💧", "🪨", "🩶", "🤍"];

const PARTICLE_MAP: Record<WorldId, ParticleConfig> = {
  cafe: {
    victory: ["☕", "✨", "⭐", "🪙", "💖", "🍃", "🌼", "🐾"],
    glow: "rgba(241, 190, 115, 0.32)",
    failure: FAILURE_PARTICLES,
  },
  forest: {
    victory: ["🍃", "🌿", "🍀", "🍄", "🌼", "🦋", "🪵", "✨"],
    glow: "rgba(120, 182, 114, 0.34)",
    failure: FAILURE_PARTICLES,
  },
  ocean: {
    victory: ["🫧", "💧", "🐚", "⭐", "🪸", "🌊", "✨", "🐠"],
    glow: "rgba(110, 189, 235, 0.34)",
    failure: FAILURE_PARTICLES,
  },
  sakura: {
    victory: ["🌸", "🌺", "🌼", "🍃", "🍀", "✨", "⭐", "💖", "🦋"],
    glow: "rgba(243, 174, 198, 0.36)",
    failure: FAILURE_PARTICLES,
  },
  castle: {
    victory: ["👑", "✨", "⭐", "🏆", "🪙", "💖", "⚔️", "💎"],
    glow: "rgba(209, 180, 255, 0.32)",
    failure: FAILURE_PARTICLES,
  },
  space: {
    victory: ["⭐", "🌟", "✨", "💫", "☄️", "🪐", "🌙", "🌠"],
    glow: "rgba(129, 196, 255, 0.36)",
    failure: FAILURE_PARTICLES,
  },
  autumn: {
    victory: ["🍃", "🍂", "🔥", "✨", "⭐", "🪵", "🌲", "🪙"],
    glow: "rgba(225, 165, 75, 0.34)",
    failure: FAILURE_PARTICLES,
  },
  mushroom: {
    victory: ["🍄", "✨", "⭐", "🍀", "🌸", "🦋", "💜"],
    glow: "rgba(207, 164, 255, 0.35)",
    failure: FAILURE_PARTICLES,
  },
  moonlit: {
    victory: ["🌙", "✨", "⭐", "🌟", "💫", "🤍", "🍃"],
    glow: "rgba(167, 184, 255, 0.34)",
    failure: FAILURE_PARTICLES,
  },
  rainy: {
    victory: ["🌧️", "💧", "🫧", "✨", "⭐", "🍃", "🤍"],
    glow: "rgba(142, 168, 196, 0.34)",
    failure: FAILURE_PARTICLES,
  },
  snowy: {
    victory: ["❄️", "🧊", "✨", "⭐", "💎", "🤍"],
    glow: "rgba(230, 242, 255, 0.36)",
    failure: FAILURE_PARTICLES,
  },
  sunflower: {
    victory: ["🌻", "🌼", "🌸", "🍃", "🐝", "🦋", "✨", "💛"],
    glow: "rgba(238, 201, 89, 0.36)",
    failure: FAILURE_PARTICLES,
  },
  "volcanic-forge": {
    victory: ["🔥", "✨", "⚡", "💥", "🪨", "❤️", "🧡", "💛"],
    glow: "rgba(255, 132, 83, 0.38)",
    failure: FAILURE_PARTICLES,
  },
  "desert-oasis": {
    victory: ["✨", "⭐", "🌼", "🍃", "🪙", "💛", "💎", "🌵"],
    glow: "rgba(227, 193, 108, 0.34)",
    failure: FAILURE_PARTICLES,
  },
  "steam-punk-workshop": {
    victory: ["⚙️", "🔥", "✨", "⚡", "⭐", "🪙", "💥", "🧡"],
    glow: "rgba(212, 152, 91, 0.34)",
    failure: FAILURE_PARTICLES,
  },
  "frostveil-kingdom": {
    victory: ["❄️", "🧊", "✨", "⭐", "💎", "🤍"],
    glow: "rgba(176, 221, 255, 0.36)",
    failure: FAILURE_PARTICLES,
  },
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function assetFor(emoji: string): ParticleAsset {
  return {
    id: emoji,
    emoji,
  };
}

function makeParticleAssets(emojis: string[]) {
  return emojis.map(assetFor);
}

function normalizeStageEmoji(stageEmoji?: string) {
  if (!stageEmoji || stageEmoji.includes("?")) return [];
  return [stageEmoji];
}

function makeVictoryParticles(world: WorldId, stageEmoji?: string) {
  const config = PARTICLE_MAP[world] ?? PARTICLE_MAP.cafe;
  const stageAssets = normalizeStageEmoji(stageEmoji);
  const assets = makeParticleAssets([
    ...stageAssets,
    ...config.victory,
    ...config.victory,
    ...config.victory,
    ...UNIVERSAL_VICTORY,
  ]);
  const originBands = [
    { origin: "left" as const, min: -4, max: 24 },
    { origin: "center" as const, min: 36, max: 64 },
    { origin: "right" as const, min: 76, max: 104 },
  ];

  return Array.from({ length: 360 }, (_, index): ParticleInstance => {
    const band = originBands[index % originBands.length];
    const angle = randomBetween(-178, -2) * (Math.PI / 180);
    const force = randomBetween(220, 760);
    const waveDelay = Math.floor(index / 90) * randomBetween(0.18, 0.34);
    return {
      id: index,
      asset: assets[index % assets.length],
      left: randomBetween(40, 60),
      top: randomBetween(38, 58),
      origin: band.origin,
      delay: waveDelay + randomBetween(0, 1.85),
      duration: randomBetween(5.8, 8.2),
      drift: randomBetween(band.origin === "left" ? 70 : -140, band.origin === "right" ? -70 : 140),
      burstX: Math.cos(angle) * force,
      burstY: Math.sin(angle) * force,
      rotate: randomBetween(-780, 780),
      scale: randomBetween(0.82, 1.42),
      bottomBounce: randomBetween(-42, -16),
    };
  });
}

function makeFailureParticles(world: WorldId) {
  const assets = makeParticleAssets((PARTICLE_MAP[world] ?? PARTICLE_MAP.cafe).failure);

  return Array.from({ length: 86 }, (_, index): ParticleInstance => {
    const origin = index % 3 === 0 ? "left" : index % 3 === 1 ? "center" : "right";
    const left =
      origin === "left"
        ? randomBetween(0, 30)
        : origin === "center"
          ? randomBetween(34, 66)
          : randomBetween(70, 100);
    return {
      id: index,
      asset: assets[index % assets.length],
      left,
      origin,
      delay: randomBetween(0, 2.2),
      duration: randomBetween(4.4, 6.2),
      drift: randomBetween(-28, 28),
      rotate: randomBetween(-140, 140),
      scale: randomBetween(0.78, 1.1),
      bottomBounce: randomBetween(-22, -8),
    };
  });
}

function ParticleAssetView({ asset }: { asset: ParticleAsset }) {
  return <PixelIcon emoji={asset.emoji} className="celebration-particle-img" />;
}

export function PixelConfetti({
  world,
  active,
  stageEmoji,
}: {
  world: WorldId;
  active: boolean;
  stageEmoji?: string;
}) {
  const particles = useMemo(() => makeVictoryParticles(world, stageEmoji), [stageEmoji, world]);

  if (!active) return null;

  return (
    <div className="celebration-particle-field" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className={`celebration-particle celebration-particle-${particle.origin}`}
          style={
            {
              left: `${particle.left}%`,
              top: particle.top == null ? undefined : `${particle.top}%`,
              "--particle-delay": `${particle.delay}s`,
              "--particle-duration": `${particle.duration}s`,
              "--particle-drift": `${particle.drift}px`,
              "--particle-burst-x": `${particle.burstX ?? 0}px`,
              "--particle-burst-y": `${particle.burstY ?? 0}px`,
              "--particle-rotate": `${particle.rotate}deg`,
              "--particle-scale": particle.scale,
              "--particle-bounce": `${particle.bottomBounce}px`,
            } as CSSProperties
          }
        >
          <ParticleAssetView asset={particle.asset} />
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
  stageEmoji,
}: {
  world: WorldId;
  active: boolean;
  xp: number;
  coins: number;
  stageEmoji?: string;
}) {
  const config = PARTICLE_MAP[world] ?? PARTICLE_MAP.cafe;
  const floaters = useMemo(
    () => [
      { id: "xp", text: `+${xp} XP`, left: "12%", delay: "0.42s" },
      { id: "coin", text: `+${coins} COINS`, left: "78%", delay: "0.68s" },
    ],
    [coins, xp],
  );

  if (!active) return null;

  return (
    <div className="celebration-victory" aria-hidden="true">
      <div
        className="celebration-glow"
        style={{ "--celebration-glow": config.glow } as CSSProperties}
      />
      <PixelConfetti active={active} world={world} stageEmoji={stageEmoji} />
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

export function FailureParticles({ world, active }: { world: WorldId; active: boolean }) {
  const particles = useMemo(() => makeFailureParticles(world), [world]);

  if (!active) return null;

  return (
    <div className="celebration-failure" aria-hidden="true">
      <div className="celebration-failure-overlay" />
      <div className="celebration-sad-pet">
        <ParticleAssetView asset={assetFor("🐾")} />
        <span className="celebration-sad-pet-text">Try again</span>
      </div>
      <div className="celebration-particle-field celebration-particle-field-failure">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className={`celebration-particle celebration-failure-fragment celebration-particle-${particle.origin}`}
            style={
              {
                left: `${particle.left}%`,
                "--particle-delay": `${particle.delay}s`,
                "--particle-duration": `${particle.duration}s`,
                "--particle-drift": `${particle.drift}px`,
                "--particle-rotate": `${particle.rotate}deg`,
                "--particle-scale": particle.scale,
                "--particle-bounce": `${particle.bottomBounce}px`,
              } as CSSProperties
            }
          >
            <ParticleAssetView asset={particle.asset} />
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
  stageEmoji,
  xp,
  coins,
}: CelebrationOverlayProps) {
  if (!active || !result) return null;

  return result === "win" ? (
    <VictoryParticles active={active} world={world} stageEmoji={stageEmoji} xp={xp} coins={coins} />
  ) : (
    <FailureParticles active={active} world={world} />
  );
}
