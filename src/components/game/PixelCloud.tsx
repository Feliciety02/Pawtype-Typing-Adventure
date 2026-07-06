type Props = {
  count?: number;
};

const CLOUD_SHAPES = [
  // Small cloud
  `radial-gradient(circle at 20% 60%, rgba(255,255,255,0.35) 12px, transparent 12px),
   radial-gradient(circle at 45% 40%, rgba(255,255,255,0.4) 18px, transparent 18px),
   radial-gradient(circle at 75% 50%, rgba(255,255,255,0.35) 14px, transparent 14px),
   radial-gradient(circle at 90% 65%, rgba(255,255,255,0.2) 8px, transparent 8px)`,
  // Medium cloud
  `radial-gradient(circle at 15% 55%, rgba(255,255,255,0.3) 10px, transparent 10px),
   radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4) 16px, transparent 16px),
   radial-gradient(circle at 60% 45%, rgba(255,255,255,0.35) 20px, transparent 20px),
   radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 12px, transparent 12px)`,
  // Wide cloud
  `radial-gradient(circle at 10% 50%, rgba(255,255,255,0.25) 8px, transparent 8px),
   radial-gradient(circle at 25% 35%, rgba(255,255,255,0.35) 14px, transparent 14px),
   radial-gradient(circle at 45% 30%, rgba(255,255,255,0.4) 18px, transparent 18px),
   radial-gradient(circle at 65% 40%, rgba(255,255,255,0.35) 15px, transparent 15px),
   radial-gradient(circle at 85% 55%, rgba(255,255,255,0.25) 10px, transparent 10px)`,
  // Tall cloud
  `radial-gradient(circle at 30% 60%, rgba(255,255,255,0.3) 12px, transparent 12px),
   radial-gradient(circle at 50% 35%, rgba(255,255,255,0.4) 16px, transparent 16px),
   radial-gradient(circle at 70% 50%, rgba(255,255,255,0.3) 14px, transparent 14px),
   radial-gradient(circle at 85% 65%, rgba(255,255,255,0.2) 8px, transparent 8px)`,
];

const COLORS = [
  "rgba(255,255,255,0.3)",
  "rgba(255,255,255,0.2)",
  "rgba(255,255,255,0.25)",
  "rgba(200,220,255,0.15)",
];

export function PixelCloud({ count = 3 }: Props) {
  const clouds = Array.from({ length: count }, (_, i) => {
    const cloudIndex = i % CLOUD_SHAPES.length;
    const left = 5 + i * 25 + Math.sin(i * 2.3) * 8;
    const top = 5 + Math.cos(i * 1.7) * 10 + 8;
    const duration = 18 + ((i * 3) % 7);
    const delay = i * 4;
    const size = 40 + (i % 3) * 20;

    return (
      <div
        key={i}
        className="pixel-cloud"
        style={{
          position: "absolute",
          left: `${left}%`,
          top: `${top}%`,
          width: `${size}px`,
          height: `${size * 0.6}px`,
          background: CLOUD_SHAPES[cloudIndex],
          opacity: 0.5 + (i % 2) * 0.2,
          animation: `cloudFloat ${duration}s ease-in-out ${delay}s infinite`,
          pointerEvents: "none",
          imageRendering: "pixelated",
        }}
      />
    );
  });

  return <>{clouds}</>;
}
