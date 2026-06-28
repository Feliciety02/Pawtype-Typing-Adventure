type Mood = "idle" | "happy" | "oops" | "sleep";

/** A tiny original pixel cat mascot, rendered with CSS-grid pixels. */
export function PixelMascot({ mood = "idle", size = 96 }: { mood?: Mood; size?: number }) {
  // 16x16 grid; legend: . = transparent, B = body, D = dark, P = pink (cheek/nose), W = white
  const idle = [
    "................",
    "................",
    "..B...........B.",
    ".BB...........BB",
    ".BBB.........BBB",
    ".BBBBBBBBBBBBBBB",
    ".BBDBBBBBBBBBDBB",
    ".BBBBBBPPBBBBBBB",
    ".BBBBBBBBBBBBBBB",
    ".BBPBBBBBBBBPBBB",
    ".BBBBBBBBBBBBBBB",
    "..BBBBBBBBBBBBB.",
    "..B.B.B...B.B.B.",
    "................",
    "................",
    "................",
  ];
  const sleep = idle.map((r, i) =>
    i === 6 ? ".BB-BBBBBBBBB-BB".replace(/-/g, "B") : i === 7 ? ".BBBBB__BB__BBBB".replace(/_/g, "D") : r,
  );
  const happy = idle.map((r, i) => (i === 7 ? ".BBBBBPPPPPPBBBB" : r));
  const oops = idle.map((r, i) =>
    i === 6 ? ".BBXBBBBBBBBBXBB".replace(/X/g, "D") : i === 7 ? ".BBBBBBDDBBBBBBB" : r,
  );

  const grid = mood === "sleep" ? sleep : mood === "happy" ? happy : mood === "oops" ? oops : idle;

  const colorFor = (c: string) => {
    switch (c) {
      case "B": return "var(--coin)";
      case "D": return "var(--ink)";
      case "P": return "var(--sakura)";
      case "W": return "var(--cream)";
      default:  return "transparent";
    }
  };

  return (
    <div
      className={mood === "sleep" ? "animate-float" : "animate-blink"}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(16, 1fr)`,
        width: size,
        height: size,
        imageRendering: "pixelated",
      }}
      aria-label="Pixel cat mascot"
      role="img"
    >
      {grid.flatMap((row, y) =>
        row.split("").map((c, x) => (
          <div key={`${x}-${y}`} style={{ background: colorFor(c) }} />
        )),
      )}
    </div>
  );
}
