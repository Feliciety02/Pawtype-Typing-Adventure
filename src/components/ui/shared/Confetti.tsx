import { useEffect, useState } from "react";
import { PixelIcon } from "../../../lib/icons/PixelIcon";
import type { WorldId } from "./WorldTheme";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  burstX: number;
  burstY: number;
  rotation: number;
  emoji: string;
};

const WORLD_EMOJI: Record<WorldId, string> = {
  cafe: "☕",
  forest: "🍃",
  ocean: "🫧",
  sakura: "🌸",
  castle: "👑",
  space: "🌟",
  autumn: "🍂",
  mushroom: "🍄",
  sunflower: "🌻",
  "volcanic-forge": "🔥",
  "desert-oasis": "🌵",
  "steam-punk-workshop": "⚙️",
  "frostveil-kingdom": "❄️",
};

function themedEmoji(world: WorldId, stageEmoji?: string) {
  if (stageEmoji && !stageEmoji.includes("?")) return stageEmoji;
  return WORLD_EMOJI[world] ?? WORLD_EMOJI.cafe;
}

export function Confetti({
  active,
  onFinish,
  world = "cafe",
  stageEmoji,
}: {
  active: boolean;
  onFinish: () => void;
  world?: WorldId;
  stageEmoji?: string;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const emoji = themedEmoji(world, stageEmoji);
    const items: Particle[] = Array.from({ length: 300 }, (_, i) => {
      const angle = (-178 + Math.random() * 176) * (Math.PI / 180);
      const force = 220 + Math.random() * 740;
      const waveDelay = Math.floor(i / 75) * (0.18 + Math.random() * 0.16);
      return {
        id: i,
        x: 40 + Math.random() * 20,
        y: 38 + Math.random() * 20,
        size: 22 + Math.random() * 18,
        delay: waveDelay + Math.random() * 1.85,
        duration: 5.8 + Math.random() * 2.4,
        drift: -150 + Math.random() * 300,
        burstX: Math.cos(angle) * force,
        burstY: Math.sin(angle) * force,
        rotation: -780 + Math.random() * 1560,
        emoji,
      };
    });
    setParticles(items);

    const t = setTimeout(onFinish, 9000);
    return () => clearTimeout(t);
  }, [active, onFinish, stageEmoji, world]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            transform: "translate3d(-50%, -50%, 0) rotate(0deg) scale(0.35)",
            animation: `pixel-confetti-blowout ${p.duration}s ${p.delay}s cubic-bezier(0.16, 0.92, 0.28, 1) forwards`,
            opacity: 0,
            ["--confetti-drift" as string]: `${p.drift}px`,
            ["--confetti-burst-x" as string]: `${p.burstX}px`,
            ["--confetti-burst-y" as string]: `${p.burstY}px`,
            ["--confetti-rotate" as string]: `${p.rotation}deg`,
          }}
        >
          <PixelIcon emoji={p.emoji} className="celebration-particle-img" />
        </span>
      ))}
      <style>{`
        @keyframes pixel-confetti-blowout {
          0% { opacity: 0; transform: translate3d(-50%, -50%, 0) rotate(0deg) scale(0.35); }
          7% {
            opacity: 1;
            transform:
              translate3d(calc(-50% + (var(--confetti-burst-x) * 0.72)), calc(-50% + (var(--confetti-burst-y) * 0.72)), 0)
              rotate(calc(var(--confetti-rotate) * 0.34))
              scale(1.24);
          }
          22% {
            opacity: 1;
            transform:
              translate3d(calc(-50% + var(--confetti-burst-x)), calc(-50% + var(--confetti-burst-y) + 4vh), 0)
              rotate(calc(var(--confetti-rotate) * 0.62))
              scale(1);
          }
          54% {
            opacity: 0.96;
            transform:
              translate3d(calc(-50% + var(--confetti-burst-x) + (var(--confetti-drift) * 0.54)), calc(-50% + var(--confetti-burst-y) + 42vh), 0)
              rotate(calc(var(--confetti-rotate) * 0.84))
              scale(0.98);
          }
          82% {
            opacity: 0.7;
            transform:
              translate3d(calc(-50% + var(--confetti-burst-x) + (var(--confetti-drift) * 0.86)), calc(-50% + var(--confetti-burst-y) + 74vh), 0)
              rotate(var(--confetti-rotate))
              scale(0.82);
          }
          100% {
            opacity: 0;
            transform:
              translate3d(calc(-50% + var(--confetti-burst-x) + (var(--confetti-drift) * 1.14)), calc(-50% + var(--confetti-burst-y) + 108vh), 0)
              rotate(calc(var(--confetti-rotate) + 130deg))
              scale(0.52);
          }
        }
      `}</style>
    </div>
  );
}
