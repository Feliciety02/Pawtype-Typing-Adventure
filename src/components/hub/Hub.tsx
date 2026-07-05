import { CampScene } from "../camp/CampScene";
import { CampDock } from "../camp/CampDock";
import type { View } from "../layout/Header";

/**
 * Camp — the living home base. Two-zone layout:
 *   • Scene (70%): interactive pixel campsite with buildings, wandering pet, ambient FX.
 *   • Dock  (30%): RPG-style inventory buttons routing to the other views.
 */
export function Hub({ onViewChange }: { onViewChange: (v: View) => void }) {
  return (
    <div className="camp-root">
      <CampScene />
      <CampDock onViewChange={onViewChange} />
    </div>
  );
}
