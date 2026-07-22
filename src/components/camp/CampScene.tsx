import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  ComingSoonModal,
  PaintersTentModal,
  SupplyWagonModal,
  TrainingBoardModal,
} from "./modals/CampModals";
import { InventoryPage } from "../inventory/InventoryPage";
import { PetNurseryPage } from "./PetNurseryPage";
import { CampBuildings } from "../../lib/camp/assets/buildings";
import { useGame } from "../../lib/game/store";
import { getDailyReward } from "../../lib/game/types";
import { useThemeMode } from "@/hooks/use-theme-mode";
import { WorldRenderer } from "../world/WorldRenderer";
import { getDayNightState, type DayNightState } from "../world/DayNightController";
import { useDayNightState } from "../world/useDayNightState";
import { CampBuilding } from "./CampBuilding";
import { Button } from "@/components/ui/button";

type CampPage = "cabin" | "nursery";
type OpenBuilding = "blacksmith" | "mailbox" | "tent" | "training" | "wagon";
type CampBuildingConfig = {
  id: string;
  asset: string;
  label: string;
  x: number;
  y: number;
  width: number;
  glow?: boolean;
  onClick?: () => void;
};

const CAMP_ENVIRONMENT_BY_SEGMENT: Record<DayNightState["current"], string> = {
  midnight: "/camp/scenes/campscene-background-midnight.webp",
  predawn: "/camp/scenes/campscene-background-pre-dawn.webp",
  sunrise: "/camp/scenes/campscene-background-sunrise.webp",
  morning: "/camp/scenes/campscene-background-morning.webp",
  noon: "/camp/scenes/campscene-background-noon.webp",
  afternoon: "/camp/scenes/campscene-background-early-afternoon.webp",
  sunset: "/camp/scenes/campscene-background-sunset.webp",
  twilight: "/camp/scenes/campscene-background-twilight.webp",
};

for (const segment of Object.keys(CAMP_ENVIRONMENT_BY_SEGMENT) as DayNightState["current"][]) {
  CAMP_ENVIRONMENT_BY_SEGMENT[segment] = CAMP_ENVIRONMENT_BY_SEGMENT[segment].replace(
    "/camp/",
    "/pages/camp/",
  );
}

const FORCED_MORNING_STATE = getDayNightState(new Date(2024, 0, 1, 9, 0, 0, 0));
const FORCED_NIGHT_STATE = getDayNightState(new Date(2024, 0, 1, 22, 0, 0, 0));

function isRealTimeNight(minute: number) {
  return minute >= 18 * 60 || minute < 6 * 60;
}

export function CampScene() {
  const { state, dispatch } = useGame();
  const { player } = state;
  const { dark } = useThemeMode();
  const liveDayNight = useDayNightState();

  const [fading, setFading] = useState(false);
  const [activePage, setActivePage] = useState<CampPage | null>(null);
  const [openBuilding, setOpenBuilding] = useState<OpenBuilding | null>(null);
  const pageTriggerRef = useRef<HTMLElement | null>(null);
  const pageBackRef = useRef<HTMLButtonElement>(null);

  const triggerFade = () => {
    setFading(true);
    window.setTimeout(() => setFading(false), 700);
  };

  const canClaim = !player.dailyRewardClaimed;
  const reward = getDailyReward(player.streak + 1);
  const realTimeNight = isRealTimeNight(liveDayNight.minute);
  const sceneState =
    dark && !realTimeNight
      ? FORCED_NIGHT_STATE
      : !dark && realTimeNight
        ? FORCED_MORNING_STATE
        : liveDayNight;
  const environmentSrc = CAMP_ENVIRONMENT_BY_SEGMENT[sceneState.current];

  const claimReward = () => {
    if (canClaim) {
      dispatch({ type: "CLAIM_DAILY_REWARD" });
    }
  };

  const open = (building: OpenBuilding) => setOpenBuilding(building);
  const openPage = (page: CampPage) => {
    pageTriggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpenBuilding(null);
    setActivePage(page);
  };
  const openCabin = () => openPage("cabin");
  const openNursery = () => openPage("nursery");
  const closeCabin = () => {
    setActivePage(null);
    window.requestAnimationFrame(() => pageTriggerRef.current?.focus());
  };

  useEffect(() => {
    if (activePage === null) return;

    pageBackRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setActivePage(null);
      window.requestAnimationFrame(() => pageTriggerRef.current?.focus());
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activePage]);

  const interactiveBuildings: CampBuildingConfig[] = [
    {
      id: "training",
      asset: CampBuildings.library,
      label: "Training Board",
      x: 48.8,
      y: 33,
      width: 210,
      onClick: () => open("training"),
    },
    {
      id: "cabin",
      asset: CampBuildings.cabin,
      label: "The Cabin",
      x: 26,
      y: 40,
      width: 200,
      onClick: openCabin,
    },
    {
      id: "tent",
      asset: CampBuildings.paintersTent,
      label: "Painter's Tent",
      x: 67,
      y: 38,
      width: 168,
      onClick: () => open("tent"),
    },
    {
      id: "nursery",
      asset: CampBuildings.petNursery,
      label: "Pet Nursery",
      x: 37,
      y: 62,
      width: 152,
      onClick: openNursery,
    },
    {
      id: "wagon",
      asset: CampBuildings.supplyWagon,
      label: canClaim ? "Supply Wagon · Ready!" : "Supply Wagon",
      x: 79,
      y: 52,
      width: 166,
      glow: canClaim,
      onClick: () => open("wagon"),
    },
    {
      id: "mailbox",
      asset: CampBuildings.mailbox,
      label: "Mailbox",
      x: 37,
      y: 47,
      width: 88,
      onClick: () => open("mailbox"),
    },
    {
      id: "blacksmith",
      asset: CampBuildings.blacksmith,
      label: "Blacksmith",
      x: 62,
      y: 61,
      width: 190,
      onClick: () => open("blacksmith"),
    },
  ];

  const sceneryBuildings: CampBuildingConfig[] = [
    {
      id: "campfire",
      asset: CampBuildings.campfire,
      label: "Campfire",
      x: 48,
      y: 53,
      width: 142,
    },
  ];

  return (
    <div className="camp-scene" data-theme-fading={fading}>
      <div
        className="camp-scene-world"
        aria-hidden={activePage !== null ? true : undefined}
        inert={activePage !== null}
      >
        <WorldRenderer environmentSrc={environmentSrc} state={sceneState} />

        <div className="camp-layer">
          {interactiveBuildings.map((building) => (
            <CampBuilding key={building.id} {...building} />
          ))}
        </div>

        <div className="camp-layer" aria-hidden="true">
          {sceneryBuildings.map((building) => (
            <CampBuilding key={building.id} {...building} />
          ))}
        </div>
      </div>

      {activePage === "cabin" && (
        <section className="camp-interior-page" aria-label="Cabin bag inventory">
          <div className="camp-interior-toolbar">
            <Button
              ref={pageBackRef}
              variant="secondary"
              className="camp-interior-back"
              onClick={closeCabin}
            >
              <ArrowLeft aria-hidden="true" />
              Back to Camp
            </Button>
            <div>
              <h1>Cabin Bag</h1>
              <p>Your eggs, pets, rewards, and camp collection live inside the cabin.</p>
            </div>
          </div>
          <InventoryPage />
        </section>
      )}
      {activePage === "nursery" && (
        <PetNurseryPage backButtonRef={pageBackRef} onBack={closeCabin} />
      )}
      {openBuilding === "tent" && (
        <PaintersTentModal onClose={() => setOpenBuilding(null)} onThemeChange={triggerFade} />
      )}
      {openBuilding === "training" && <TrainingBoardModal onClose={() => setOpenBuilding(null)} />}
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
