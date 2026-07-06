import { useEffect, useRef, useState } from "react";
import type { PetState } from "../../lib/game/types";
import { PixelPet } from "../coach/PixelPet";

/**
 * WanderingPet — a pet that walks along the ground with waypoints, bobs while idle,
 * flips based on direction, jumps on click / reward events.
 *
 * Keeps state entirely local (no game state changes) — purely presentational.
 * Reward jumps triggered via `window` event: `pawtype-pet-celebrate`.
 */
export function WanderingPet({ pet }: { pet: PetState | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 20, flipped: false });
  const [jumping, setJumping] = useState(false);

  // wander loop — pick a new target every 3.5s
  useEffect(() => {
    const id: number | null = null;
    const wander = () => {
      const container = ref.current?.parentElement;
      if (!container) return;
      const width = container.clientWidth;
      const petWidth = 90;
      const target = Math.max(
        10,
        Math.min(width - petWidth - 10, Math.random() * (width - petWidth)),
      );
      setPos((prev) => ({ x: target, flipped: target < prev.x }));
    };
    wander();
    const interval = window.setInterval(wander, 3500);
    return () => {
      if (id) window.clearTimeout(id);
      window.clearInterval(interval);
    };
  }, []);

  // celebrate on external reward events
  useEffect(() => {
    const onCelebrate = () => {
      setJumping(true);
      window.setTimeout(() => setJumping(false), 520);
    };
    window.addEventListener("pawtype-pet-celebrate", onCelebrate);
    return () => window.removeEventListener("pawtype-pet-celebrate", onCelebrate);
  }, []);

  const click = () => {
    setJumping(true);
    window.setTimeout(() => setJumping(false), 520);
  };

  if (!pet) return null;

  return (
    <div
      ref={ref}
      className={`camp-pet ${jumping ? "is-jumping" : ""} ${pos.flipped ? "is-flipped" : ""}`}
      style={{ transform: `translateX(${pos.x}px)` }}
      onClick={click}
      role="button"
      tabIndex={0}
      aria-label={`${pet.name} — click to play`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") click();
      }}
    >
      <div className="camp-pet-inner">
        <PixelPet pet={pet} size={70} showDetails={false} />
      </div>
    </div>
  );
}
