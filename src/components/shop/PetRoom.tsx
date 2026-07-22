import { PixelIcon } from "../../lib/icons/PixelIcon";
import { useGame } from "../../lib/game/store";
import { PixelPet } from "../coach/PixelPet";
import type { PetType } from "../../lib/game/types";
import { ModalShell, PixelButton } from "../modals/ModalShell";
import { cn } from "../../lib/utils/utils";

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
    <ModalShell
      ariaLabel="Pet Nursery"
      onClose={onClose}
      className="pixel-modal-shell-camp pixel-modal-shell-pet-room"
      size="md"
      contentClassName="camp-modal-content"
    >
      <div className="pet-room-modal">
        <header className="pet-room-header">
          <h2 className="pet-room-modal-title">Pet Nursery</h2>
          <p className="pet-room-modal-subtitle">Choose your active companion and share treats.</p>
        </header>
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
                    className={cn("pet-room-pet-card", isActive && "is-active")}
                    aria-pressed={isActive}
                    aria-label={`${pet.name}, ${isActive ? "active companion" : "make active companion"}`}
                  >
                    <PixelPet pet={pet} size={72} showDetails={false} />
                    {isActive ? (
                      <span className="pet-room-active-label">
                        <PixelIcon emoji="⭐" /> Active
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            <div className="pet-room-actions">
              <PixelButton
                className="w-full"
                disabled={treatCount === 0 || !inventory.activePet}
                onClick={feed}
                title={
                  treatCount === 0 ? "No treats - collect from daily rewards" : "Feed active pet"
                }
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
