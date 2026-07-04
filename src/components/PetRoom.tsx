import { useGame } from "../lib/game/store";
import { PixelPet } from "./PixelPet";
import type { PetType } from "../lib/game/types";
import { ModalShell, PixelButton } from "./modals/ModalShell";

export function PetRoom({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useGame();
  const { inventory } = state;

  const treatCount = inventory.items.filter((item) => item === "pet-food-day-5").length;

  const feed = () => {
    if (treatCount === 0 || !inventory.activePet) return;
    dispatch({ type: "REMOVE_ITEM", itemId: "pet-food-day-5" });
    dispatch({ type: "ADD_PET_XP", amount: 25 });
  };

  return (
    <ModalShell ariaLabel="Pet Room" onClose={onClose} className="pixel-modal-shell-pet-room">
      <div className="pet-room-modal">
        <div className="pet-room-modal-title">Pet Room</div>
        {inventory.pets.length === 0 ? (
          <p className="pet-room-empty">No pets yet. Adopt a friend in the Curiosity Cart!</p>
        ) : (
          <>
            <div className="pet-room-grid">
              {inventory.pets.map((pet) => {
                const isActive = inventory.activePet === pet.type;
                return (
                  <button
                    key={pet.type}
                    type="button"
                    onClick={() =>
                      dispatch({ type: "SET_ACTIVE_PET", petType: pet.type as PetType })
                    }
                    className="pet-room-pet-card"
                    style={{
                      borderColor: isActive ? "var(--coin)" : undefined,
                      boxShadow: isActive ? "0 0 0 2px var(--coin) inset" : undefined,
                    }}
                  >
                    <PixelPet pet={pet} size={72} />
                    {isActive ? <span className="pet-room-active-label"><img src="/Icons/star.png" alt="" className="pixel-icon" /> Active</span> : null}
                  </button>
                );
              })}
            </div>
            <div className="pet-room-actions">
              <PixelButton
                className="w-full"
                disabled={treatCount === 0 || !inventory.activePet}
                onClick={feed}
                title={treatCount === 0 ? "No treats - collect from daily rewards" : "Feed active pet"}
              >
                Feed Treat ({treatCount}) +25 XP
              </PixelButton>
            </div>
          </>
        )}
      </div>
    </ModalShell>
  );
}
