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
  const interactive = Boolean(onClick);
  const disabled = Boolean(locked || !interactive);
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
    if (disabled) return;
    setClicking(true);
    setSparkles(true);
    emitParticles();
    setTimeout(() => {
      setClicking(false);
      setSparkles(false);
    }, 300);
    onClick?.();
  }, [disabled, emitParticles, onClick]);

  const artwork = (
    <>
      <img className="camp-building-img" src={asset} alt="" aria-hidden="true" width={width} />
      {locked && (
        <span className="camp-building-lock" aria-hidden="true">
          <span>🔒</span>
        </span>
      )}
      {sparkles && (
        <span className="camp-building-sparkle-burst" aria-hidden="true">
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
        </span>
      )}
    </>
  );

  return (
    <div
      className="camp-building"
      data-id={id}
      data-locked={locked ? "true" : undefined}
      data-clicking={clicking ? "true" : undefined}
      data-glow={glow ? "true" : undefined}
      data-interactive={interactive ? "true" : "false"}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        ["--camp-building-size" as string]: `${width}px`,
      }}
    >
      {interactive ? (
        <button
          type="button"
          className="camp-building-btn"
          onClick={handleClick}
          aria-label={locked ? `${label} (locked)` : label}
          disabled={disabled}
          onMouseEnter={disabled ? undefined : emitParticles}
        >
          {artwork}
        </button>
      ) : (
        <div className="camp-building-btn" aria-hidden="true">
          {artwork}
        </div>
      )}
      {interactive && (
        <div className="camp-building-tag" aria-hidden="true">
          {label}
        </div>
      )}
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="camp-building-particle"
          aria-hidden="true"
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
