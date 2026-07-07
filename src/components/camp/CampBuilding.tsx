import { useCallback, useRef, useState } from "react";

interface CampBuildingProps {
  id: string;
  asset: string;
  label: string;
  x: number;
  y: number;
  width?: number;
  locked?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

type CampParticle = {
  id: number;
  x: number;
  y: number;
  emoji: string;
};

export function CampBuilding({
  id,
  asset,
  label,
  x,
  y,
  width = 80,
  locked,
  glow,
  onClick,
}: CampBuildingProps) {
  const disabled = locked || id === "campfire";
  const [clicking, setClicking] = useState(false);
  const [particles, setParticles] = useState<CampParticle[]>([]);
  const [sparkles, setSparkles] = useState(false);
  const particleId = useRef(0);

  const emitParticles = useCallback(() => {
    const next: CampParticle[] = [];

    for (let i = 0; i < 3; i++) {
      particleId.current++;
      next.push({
        id: particleId.current,
        x: (Math.random() - 0.5) * 40,
        y: -Math.random() * 30 - 10,
        emoji: ["✨", "⭐", "💫"][i % 3],
      });
    }

    setParticles((prev) => [...prev.slice(-10), ...next]);
    setTimeout(
      () => setParticles((prev) => prev.filter((p) => p.id > particleId.current - 10)),
      800,
    );
  }, []);

  const handleClick = useCallback(() => {
    setClicking(true);
    setSparkles(true);
    emitParticles();
    setTimeout(() => {
      setClicking(false);
      setSparkles(false);
    }, 300);
    onClick?.();
  }, [emitParticles, onClick]);

  return (
    <div
      className="camp-building"
      data-id={id}
      data-locked={locked ? "true" : undefined}
      data-clicking={clicking ? "true" : undefined}
      data-glow={glow ? "true" : undefined}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        ["--camp-building-size" as string]: `${width}px`,
      }}
    >
      <button
        className="camp-building-btn"
        onClick={handleClick}
        aria-label={label}
        disabled={disabled}
        onMouseEnter={emitParticles}
      >
        <img
          className="camp-building-img"
          src={asset}
          alt={label}
          width={width}
        />
        {locked && (
          <div className="camp-building-lock">
            <span>🔒</span>
          </div>
        )}
        {sparkles && (
          <div className="camp-building-sparkle-burst" aria-hidden="true">
            {["✨", "⭐", "💫", "✨"].map((emoji, i) => (
              <span
                key={i}
                className="camp-building-sparkle"
                style={{
                  ["--sx" as string]: `${[-10, 10, -6, 6][i]}px`,
                  ["--sy" as string]: `${[-14, -12, -18, -16][i]}px`,
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}
      </button>
      <div className="camp-building-tag">{label}</div>
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="camp-building-particle"
          style={{
            ["--px" as string]: `${particle.x}px`,
            ["--py" as string]: `${particle.y}px`,
          }}
        >
          {particle.emoji}
        </span>
      ))}
    </div>
  );
}
