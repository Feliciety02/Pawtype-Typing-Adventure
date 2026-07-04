import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useGame } from "../lib/game/store";
import { PixelPet } from "./PixelPet";
import type { PetType } from "../lib/game/types";

export function PetRoom({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useGame();
  const { inventory } = state;

  const treatCount = inventory.items.filter((i) => i === "pet-food-day-5").length;

  const feed = () => {
    if (treatCount === 0 || !inventory.activePet) return;
    dispatch({ type: "REMOVE_ITEM", itemId: "pet-food-day-5" });
    dispatch({ type: "ADD_PET_XP", amount: 25 });
  };

  return createPortal(
    <div className="results-overlay" role="dialog" aria-modal="true" aria-label="Pet Room" onClick={onClose}>
      <div className="results-card" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
        <button className="results-close-btn" type="button" onClick={onClose} aria-label="Close pet room">
          <X size={14} />
        </button>
        <div className="results-title">🏡 Pet Room</div>
        {inventory.pets.length === 0 ? (
          <p className="font-pixel text-[0.65rem] text-muted-foreground text-center mt-4">
            No pets yet. Adopt a friend in the Curiosity Cart!
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
              {inventory.pets.map((pet) => {
                const isActive = inventory.activePet === pet.type;
                return (
                  <button
                    key={pet.type}
                    type="button"
                    onClick={() => dispatch({ type: "SET_ACTIVE_PET", petType: pet.type as PetType })}
                    className="pixel-card-sm p-3 flex flex-col items-center"
                    style={{
                      borderColor: isActive ? "var(--coin)" : undefined,
                      boxShadow: isActive ? "0 0 0 2px var(--coin) inset" : undefined,
                    }}
                  >
                    <PixelPet pet={pet} size={72} />
                    {isActive && (
                      <span className="font-pixel text-[0.5rem] mt-1" style={{ color: "var(--coin)" }}>
                        ★ Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="results-actions mt-4">
              <button
                className="pixel-btn w-full"
                disabled={treatCount === 0 || !inventory.activePet}
                onClick={feed}
                title={treatCount === 0 ? "No treats — collect from daily rewards" : "Feed active pet"}
              >
                🍪 Feed Treat ({treatCount}) +25 XP
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  , document.body);
}
