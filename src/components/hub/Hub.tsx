import { CampScene } from "../camp/CampScene";
import type { View } from "../layout/Header";

/**
 * Camp - the living home base.
 * Renders the interactive pixel campsite scene without the old bottom dock.
 */
export function Hub({ onViewChange: _onViewChange }: { onViewChange: (v: View) => void }) {
  return <CampScene />;
}
