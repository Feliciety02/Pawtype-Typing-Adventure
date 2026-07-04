import { PixelIcon } from "../../lib/icons/PixelIcon";

export function BigStars({ count, size = 22 }: { count: 0 | 1 | 2 | 3; size?: number }) {
  return (
    <div className="quest-big-stars" aria-label={`${count} of 3 stars`}>
      {[0, 1, 2].map((i) => {
        const filled = i < count;
        const golden = count === 3;
        return (
          <span key={i} style={{ width: size, height: size, display: "inline-block" }}>
            <PixelIcon
              emoji="⭐"
              className={`quest-big-star ${filled ? "is-filled" : "is-empty"} ${golden && filled ? "is-golden" : ""}`}
            />
          </span>
        );
      })}
    </div>
  );
}
