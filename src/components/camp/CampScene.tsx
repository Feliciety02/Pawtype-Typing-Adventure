import { useEffect, useState } from "react";
import { AmbientLayer } from "./ambient/AmbientLayer";
import {
  CabinModal,
  ComingSoonModal,
  PaintersTentModal,
  PetNurseryModal,
  SupplyWagonModal,
  TrainingBoardModal,
} from "./modals/CampModals";
import { WanderingPet } from "./WanderingPet";
import { getCampTier, nextTierLevel } from "../../lib/camp/progression";
import { CampBuildings } from "../../lib/camp/assets/buildings";
import { getTimeOfDay, TIME_LABEL, TIME_OVERLAY } from "../../lib/camp/timeOfDay";
import { useQuests } from "../../lib/game/quests";
import { useGame } from "../../lib/game/store";
import { getDailyReward, xpForLevel } from "../../lib/game/types";
import { PixelIcon } from "../../lib/icons/PixelIcon";
import { useWorld } from "../shared/WorldTheme";
import { CampBuilding } from "./CampBuilding";

type OpenBuilding =
  | "blacksmith"
  | "cabin"
  | "library"
  | "mailbox"
  | "nursery"
  | "tent"
  | "wagon";

const CAMP_BACKGROUND_BY_TIME = {
  morning: "/camp-scene/campscene-background-morning.png",
  afternoon: "/camp-scene/campscene-background-afternoon.png",
  evening: "/camp-scene/campscene-background-evening.png",
  night: "/camp-scene/campscene-background-evening.png",
} as const;

export function CampScene() {
  const { state, dispatch } = useGame();
  const { world } = useWorld();
  const { player, inventory } = state;
  const tier = getCampTier(player.level);
  const activePet =
    inventory.pets.find((pet) => pet.type === inventory.activePet) ?? inventory.pets[0] ?? null;
  const quests = useQuests();

  const [time, setTime] = useState(() => getTimeOfDay());
  const [fading, setFading] = useState(false);
  const [openBuilding, setOpenBuilding] = useState<OpenBuilding | null>(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => setTime(getTimeOfDay()), 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

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

  const needed = xpForLevel(player.level);
  const xpPct = needed > 0 ? Math.min(Math.round((player.xp / needed) * 100), 100) : 0;
  const nextTier = nextTierLevel(player.level);
  const open = (building: OpenBuilding) => setOpenBuilding(building);
  const sceneBackground = CAMP_BACKGROUND_BY_TIME[time];

  return (
    <div
      className="camp-scene"
      data-theme-fading={fading}
      style={{ ["--camp-scene-bg" as string]: `url("${sceneBackground}")` }}
    >
      <div className="camp-scene-background camp-layer" aria-hidden="true" />
      <AmbientLayer world={world} time={time} />

      <div className="camp-layer">
        <CampBuilding
          id="library"
          asset={CampBuildings.library}
          label="Library"
          x={50}
          y={24}
          width={172}
          onClick={() => open("library")}
        />
        <CampBuilding
          id="cabin"
          asset={CampBuildings.cabin}
          label="The Cabin"
          x={22}
          y={39}
          width={164}
          locked={!tier.hasCabin}
          onClick={() => open("cabin")}
        />
        <CampBuilding
          id="tent"
          asset={CampBuildings.paintersTent}
          label="Painter's Tent"
          x={72}
          y={34}
          width={170}
          onClick={() => open("tent")}
        />
        <CampBuilding
          id="nursery"
          asset={CampBuildings.petNursery}
          label="Pet Nursery"
          x={22}
          y={64}
          width={158}
          onClick={() => open("nursery")}
        />
        <CampBuilding
          id="wagon"
          asset={CampBuildings.supplyWagon}
          label={canClaim ? "Supply Wagon · Ready!" : "Supply Wagon"}
          x={87}
          y={47}
          width={170}
          glow={canClaim}
          onClick={() => open("wagon")}
        />
        <CampBuilding
          id="mailbox"
          asset={CampBuildings.mailbox}
          label="Mailbox"
          x={35}
          y={63}
          width={126}
          locked={!tier.hasMailbox}
          onClick={() => open("mailbox")}
        />
        <CampBuilding
          id="blacksmith"
          asset={CampBuildings.blacksmith}
          label="Blacksmith"
          x={66}
          y={61}
          width={162}
          onClick={() => open("blacksmith")}
        />
      </div>

      <div className="camp-layer">
        <CampBuilding
          id="campfire"
          asset={CampBuildings.campfire}
          label="Campfire"
          x={50}
          y={50}
          width={164}
        />
      </div>

      <div className="camp-layer">
        <WanderingPet pet={activePet} />
      </div>

      <div className="camp-hud-card">
        <div className="camp-hud-row">
          <span>Level {player.level}</span>
          <span style={{ color: "var(--coin)" }}>
            <PixelIcon emoji="🪙" /> {player.coins.toLocaleString()}
          </span>
        </div>
        <div className="camp-hud-xpbar">
          <div style={{ width: `${xpPct}%` }} />
        </div>
        <div className="camp-hud-row" style={{ marginTop: 6, opacity: 0.8 }}>
          <span>
            {quests[0].title}: {quests[0].value}
          </span>
          {nextTier && <span>Next: Lv {nextTier}</span>}
        </div>
      </div>

      <div className="camp-tier-chip" title={`Time: ${TIME_LABEL[time]}`}>
        {tier.label} · {TIME_LABEL[time]}
      </div>

      <div className="camp-time-overlay" style={{ background: TIME_OVERLAY[time] }} />

      {openBuilding === "cabin" && <CabinModal onClose={() => setOpenBuilding(null)} />}
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
