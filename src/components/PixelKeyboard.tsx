const ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M"],
];

export function PixelKeyboard({ active, pressedChars }: { active?: string; pressedChars?: Record<string, "correct" | "wrong"> }) {
  const key = active?.toUpperCase();
  return (
    <div className="mech-keyboard">
      {ROWS.map((row, i) => (
        <div key={i} className="key-row">
          {row.map((k) => {
            const isActive = k === key;
            const charState = pressedChars?.[k];
            let cls = "mech-key";
            if (isActive) cls += " active";
            else if (charState === "correct") cls += " correct";
            else if (charState === "wrong") cls += " wrong";
            return (
              <div key={k} className={cls}>{k}</div>
            );
          })}
        </div>
      ))}
      <div className={`mech-space ${key === " " ? "active" : ""}`}>
        SPACE
      </div>
    </div>
  );
}
