const ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M"],
];

export function PixelKeyboard({ active }: { active?: string }) {
  const key = active?.toUpperCase();
  return (
    <div className="pixel-card p-4 flex flex-col items-center gap-1.5 select-none">
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-1.5" style={{ paddingLeft: i * 12 }}>
          {row.map((k) => {
            const isActive = k === key;
            return (
              <div
                key={k}
                className="font-pixel text-[0.7rem] grid place-items-center transition-all"
                style={{
                  width: 32, height: 32,
                  border: "2px solid var(--color-border)",
                  borderRadius: 4,
                  background: isActive ? "var(--color-primary)" : "var(--color-card)",
                  color: isActive ? "var(--color-primary-foreground)" : "var(--color-foreground)",
                  boxShadow: isActive ? "0 0 0 0 var(--color-border)" : "2px 2px 0 0 var(--color-border)",
                  transform: isActive ? "translate(2px,2px)" : "none",
                }}
              >
                {k}
              </div>
            );
          })}
        </div>
      ))}
      <div
        className="font-pixel text-[0.65rem] grid place-items-center mt-1"
        style={{
          width: 280, height: 28,
          border: "2px solid var(--color-border)",
          borderRadius: 4,
          background: key === " " ? "var(--color-primary)" : "var(--color-card)",
          color: key === " " ? "var(--color-primary-foreground)" : "var(--muted-foreground)",
          boxShadow: key === " " ? "0 0 0 0 var(--color-border)" : "2px 2px 0 0 var(--color-border)",
        }}
      >
        SPACE
      </div>
    </div>
  );
}
