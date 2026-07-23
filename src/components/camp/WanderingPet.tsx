import { useEffect, useRef, useState } from "react";
import type { PetState, PetType } from "../../lib/game/types";
import { PixelPet } from "../coach/PixelPet";
import { useGame } from "../../lib/game/store";
import { markFed } from "../../lib/game/petMood";

/**
 * WanderingPet — a pet that walks along the ground with waypoints, bobs while idle,
 * flips based on direction, jumps on click / reward events.
 *
 * Clicking (or Enter/Space) pets the companion: brief jump + heart bubble, and
 * grants a small XP nudge with a 15s cooldown so it can't be spammed.
 */
export function WanderingPet({ pet }: { pet: PetState | null }) {
  const { dispatch } = useGame();
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 20, flipped: false });
  const [jumping, setJumping] = useState(false);
  const [hearts, setHearts] = useState<number[]>([]);
  const lastPetRef = useRef(0);

  // wander loop — pick a new target every 3.5s
  useEffect(() => {
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
    return () => window.clearInterval(interval);
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
    // spawn a heart
    const id = Date.now();
    setHearts((h) => [...h, id]);
    window.setTimeout(() => setHearts((h) => h.filter((x) => x !== id)), 900);

    // XP nudge with 15s cooldown
    const now = Date.now();
    if (pet && now - lastPetRef.current > 15_000) {
      lastPetRef.current = now;
      dispatch({ type: "ADD_PET_XP", amount: 5 });
      markFed(pet.type as PetType);
    }
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
      <div className="camp-pet-inner" style={{ position: "relative" }}>
        <PixelPet pet={pet} size={70} showDetails={false} />
        {hearts.map((id) => (
          <span key={id} className="camp-pet-heart" aria-hidden="true">
            💖
          </span>
        ))}
      </div>
    </div>
  );
}
