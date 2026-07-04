const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export function PixelKeyboard({ active }: { active?: string }) {
  const key = active?.toUpperCase();
  return (
    <div className="pixel-keyboard select-none">
      {ROWS.map((row, i) => (
        <div key={i} className="pixel-keyboard-row" style={{ paddingLeft: i * 12 }}>
          {row.map((k) => {
            const isActive = k === key;
            return (
              <div
                key={k}
                className="pixel-key"
                style={{
                  background: isActive ? "var(--color-primary)" : "var(--color-card)",
                  color: isActive ? "var(--color-primary-foreground)" : "var(--color-foreground)",
                  boxShadow: isActive
                    ? "0 0 0 0 var(--color-border)"
                    : "2px 2px 0 0 var(--color-border)",
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
        className="pixel-key pixel-key-space"
        style={{
          background: key === " " ? "var(--color-primary)" : "var(--color-card)",
          color: key === " " ? "var(--color-primary-foreground)" : "var(--muted-foreground)",
          boxShadow:
            key === " " ? "0 0 0 0 var(--color-border)" : "2px 2px 0 0 var(--color-border)",
        }}
      >
        SPACE
      </div>
    </div>
  );
}
