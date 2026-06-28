import { useEffect, useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
  rotation: number;
};

const COLORS = ["var(--coin)", "var(--sakura)", "var(--leaf)", "var(--sky)", "var(--color-primary)"];

export function Confetti({ active, onFinish }: { active: boolean; onFinish: () => void }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const items: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: -10 - Math.random() * 20,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 4 + Math.random() * 6,
      delay: Math.random() * 0.3,
      rotation: Math.random() * 360,
    }));
    setParticles(items);

    const t = setTimeout(onFinish, 1500);
    return () => clearTimeout(t);
  }, [active, onFinish]);

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
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: 2,
            transform: `rotate(${p.rotation}deg)`,
            animation: `pixel-confetti-fall 1.2s ${p.delay}s ease-out forwards`,
            opacity: 0,
          }}
        />
      ))}
      <style>{`
        @keyframes pixel-confetti-fall {
          0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
          100% { opacity: 0; transform: translateY(100vh) rotate(720deg) scale(0.5); }
        }
      `}</style>
    </div>
  );
}
