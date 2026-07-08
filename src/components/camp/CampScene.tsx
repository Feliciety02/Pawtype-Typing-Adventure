import { useState } from "react";
import {
  ComingSoonModal,
  PaintersTentModal,
  PetNurseryModal,
  SupplyWagonModal,
  TrainingBoardModal,
} from "./modals/CampModals";
import { InventoryPage } from "../inventory/InventoryPage";
import { getCampTier } from "../../lib/camp/progression";
import { CampBuildings } from "../../lib/camp/assets/buildings";
import { useGame } from "../../lib/game/store";
import { getDailyReward } from "../../lib/game/types";
import { WorldRenderer } from "../world/WorldRenderer";
import { CampBuilding } from "./CampBuilding";

type CampPage = "cabin";
type OpenBuilding = "blacksmith" | "library" | "mailbox" | "nursery" | "tent" | "wagon";

const CAMP_STATIC_ENVIRONMENT = "/camp/scenes/campscene-background-morning.png";

export function CampScene() {
  const { state, dispatch } = useGame();
  const { player, inventory } = state;
  const tier = getCampTier(player.level);

  const [fading, setFading] = useState(false);
  const [activePage, setActivePage] = useState<CampPage | null>(null);
  const [openBuilding, setOpenBuilding] = useState<OpenBuilding | null>(null);

  const triggerFade = () => {
    setFading(true);
    window.setTimeout(() => setFading(false), 700);
  };

  const canClaim = !player.dailyRewardClaimed;
  const reward = getDailyReward(player.streak + 1);

  const claimReward = () => {
    if (canClaim) {
      dispatch({ type: "CLAIM_DAILY_REWARD" });
    }
  };

  const open = (building: OpenBuilding) => setOpenBuilding(building);
  const openCabin = () => {
    setOpenBuilding(null);
    setActivePage("cabin");
  };

  return (
    <div className="camp-scene" data-theme-fading={fading}>
      <div className="camp-scene-world">
        <WorldRenderer environmentSrc={CAMP_STATIC_ENVIRONMENT} />

      <div className="camp-layer">
        <CampBuilding
          id="library"
          asset={CampBuildings.library}
          label="Library"
          x={48.8}
          y={33}
          width={210}
          onClick={() => open("library")}
        />
        <CampBuilding
          id="cabin"
          asset={CampBuildings.cabin}
          label="The Cabin"
          x={26}
          y={40}
          width={200}
          onClick={openCabin}
        />
        <CampBuilding
          id="tent"
          asset={CampBuildings.paintersTent}
          label="Painter's Tent"
          x={67}
          y={38}
          width={168}
          onClick={() => open("tent")}
        />
        <CampBuilding
          id="nursery"
          asset={CampBuildings.petNursery}
          label="Pet Nursery"
          x={37}
          y={62}
          width={152}
          onClick={() => open("nursery")}
        />
        <CampBuilding
          id="wagon"
          asset={CampBuildings.supplyWagon}
          label={canClaim ? "Supply Wagon · Ready!" : "Supply Wagon"}
          x={79}
          y={52}
          width={166}
          glow={canClaim}
          onClick={() => open("wagon")}
        />
        <CampBuilding
          id="mailbox"
          asset={CampBuildings.mailbox}
          label="Mailbox"
          x={37}
          y={47}
          width={88}
          onClick={() => open("mailbox")}
        />
        <CampBuilding
          id="blacksmith"
          asset={CampBuildings.blacksmith}
          label="Blacksmith"
          x={62}
          y={61}
          width={190}
          onClick={() => open("blacksmith")}
        />
      </div>

      <div className="camp-layer">
        <CampBuilding
          id="campfire"
          asset={CampBuildings.campfire}
          label="Campfire"
          x={48}
          y={53}
          width={142}
        />
      </div>

      </div>

      {activePage === "cabin" && (
        <section className="camp-interior-page" aria-label="Cabin bag inventory">
          <div className="camp-interior-toolbar">
            <button
              type="button"
              className="camp-interior-back"
              onClick={() => setActivePage(null)}
            >
              ← Back to Camp
            </button>
            <div>
              <h1>Cabin Bag</h1>
              <p>Your eggs, pets, rewards, and camp collection live inside the cabin.</p>
            </div>
          </div>
          <InventoryPage />
        </section>
      )}
      {openBuilding === "tent" && (
        <PaintersTentModal onClose={() => setOpenBuilding(null)} onThemeChange={triggerFade} />
      )}
      {openBuilding === "nursery" && <PetNurseryModal onClose={() => setOpenBuilding(null)} />}
      {openBuilding === "library" && <TrainingBoardModal onClose={() => setOpenBuilding(null)} />}
      {openBuilding === "wagon" && (
        <SupplyWagonModal
          onClose={() => setOpenBuilding(null)}
          onClaim={claimReward}
          claimed={!canClaim}
          rewardLabel={reward.label}
          rewardCoins={reward.coins}
        />
      )}
      {openBuilding === "mailbox" && (
        <ComingSoonModal icon="📮" title="Mailbox" onClose={() => setOpenBuilding(null)}>
          Letters from friends and event announcements will arrive here.
        </ComingSoonModal>
      )}
      {openBuilding === "blacksmith" && (
        <ComingSoonModal icon="🔨" title="Blacksmith" onClose={() => setOpenBuilding(null)}>
          Forge powerful tools and upgrade your gear - coming soon!
        </ComingSoonModal>
      )}
    </div>
  );
}
