import { useEffect, useState } from "react";
import { useGame } from "../../lib/game/store";
import { useWorld } from "../shared/WorldTheme";
import { getCampTier, nextTierLevel } from "../../lib/camp/progression";
import { getTimeOfDay, TIME_OVERLAY, TIME_LABEL } from "../../lib/camp/timeOfDay";
import { WanderingPet } from "./WanderingPet";
import { AmbientLayer } from "./ambient/AmbientLayer";
import { xpForLevel, getDailyReward } from "../../lib/game/types";
import { useQuests } from "../../lib/game/quests";
import { PixelIcon } from "../../lib/icons/PixelIcon";
import { CabinModal, PaintersTentModal, PetNurseryModal, TrainingBoardModal, SupplyWagonModal, ComingSoonModal } from "./modals/CampModals";

type Building = { id: string; icon: string; label: string; style: React.CSSProperties };

export function CampScene() {
  const { state, dispatch } = useGame();
  const { world } = useWorld();
  const { player, inventory } = state;
  const tier = getCampTier(player.level);
  const activePet = inventory.pets.find((p) => p.type === inventory.activePet) ?? inventory.pets[0] ?? null;
  const quests = useQuests();

  const [time, setTime] = useState(() => getTimeOfDay());
  const [fading, setFading] = useState(false);
  const [openBuilding, setOpenBuilding] = useState<null | "cabin" | "tent" | "nursery" | "board" | "wagon" | "mailbox" | "windmill">(null);

  useEffect(() => {
    const t = window.setInterval(() => setTime(getTimeOfDay()), 60_000);
    return () => window.clearInterval(t);
  }, []);

  const triggerFade = () => { setFading(true); window.setTimeout(() => setFading(false), 700); };

  const canClaim = !player.dailyRewardClaimed;
  const reward = getDailyReward(player.streak + 1);
  const claimReward = () => { if (canClaim) dispatch({ type: "CLAIM_DAILY_REWARD" }); };

  const needed = xpForLevel(player.level);
  const xpPct = needed > 0 ? Math.min(Math.round((player.xp / needed) * 100), 100) : 0;
  const nextTier = nextTierLevel(player.level);

  const buildings: Building[] = [
    { id: "tent",    icon: "⛺", label: "Painter's Tent",      style: { left: "8%",  top: "42%" } },
    { id: "nursery", icon: "🥚", label: "Pet Nursery",          style: { left: "22%", top: "50%" } },
    { id: "wagon",   icon: canClaim ? "🎁" : "📦", label: canClaim ? "Supply Wagon · Ready!" : "Supply Wagon", style: { right: "22%", top: "48%" } },
    { id: "board",   icon: "📖", label: "Training Board",       style: { right: "8%",  top: "42%" } },
  ];
  if (tier.hasCabin)   buildings.push({ id: "cabin",    icon: "🏡", label: "The Cabin",     style: { left: "38%", top: "36%" } });
  if (tier.hasMailbox) buildings.push({ id: "mailbox",  icon: "📮", label: "Mailbox",       style: { left: "62%", top: "58%" } });
  if (tier.hasWindmill)buildings.push({ id: "windmill", icon: "🌬️", label: "Windmill",      style: { right: "38%", top: "24%" } });

  return (
    <div className="camp-scene" data-theme-fading={fading}>
      {/* Sky decor: clouds/stars via AmbientLayer */}
      <AmbientLayer world={world} time={time} />

      {/* Ground band */}
      <div className="camp-ground camp-layer" aria-hidden="true">
        {tier.hasStonePaths && <div className="camp-path" />}
      </div>

      {/* Decor sprites (trees, flowers, lanterns...) */}
      <div className="camp-layer" aria-hidden="true">
        <span className="camp-decor" style={{ left: "3%", bottom: "34%" }}>🌲</span>
        <span className="camp-decor" style={{ right: "3%", bottom: "36%" }}>🌳</span>
        {tier.hasGarden && <span className="camp-decor" style={{ left: "48%", bottom: "10%" }}>🌷</span>}
        {tier.hasFlowerBeds && <>
          <span className="camp-decor" style={{ left: "30%", bottom: "8%" }}>🌼</span>
          <span className="camp-decor" style={{ right: "30%", bottom: "8%" }}>🌺</span>
        </>}
        {tier.hasPond && <span className="camp-decor is-fixed" style={{ left: "58%", bottom: "16%" }}>💧</span>}
        {tier.hasBridge && <span className="camp-decor is-fixed" style={{ left: "50%", bottom: "22%", transform: "translateX(-50%)" }}>🌉</span>}
        {tier.hasLanterns && <>
          <span className="camp-decor is-fixed" style={{ left: "18%", bottom: "26%" }}>🏮</span>
          <span className="camp-decor is-fixed" style={{ right: "18%", bottom: "26%" }}>🏮</span>
        </>}
        {tier.hasFence && <span className="camp-decor is-fixed" style={{ left: "10%", bottom: "6%", fontSize: 24, opacity: 0.75 }}>▬▬▬▬▬</span>}
        {tier.hasStatues && <span className="camp-decor is-fixed" style={{ right: "48%", bottom: "34%" }}>🗿</span>}
        {tier.hasCrystals && <span className="camp-decor" style={{ right: "44%", bottom: "12%" }}>💎</span>}
        {tier.hasWatchtower && <span className="camp-decor is-fixed" style={{ left: "72%", bottom: "40%" }}>🗼</span>}
        {tier.hasSanctuary && <span className="camp-decor" style={{ left: "50%", top: "10%", transform: "translateX(-50%)", fontSize: 44 }}>✨</span>}
        {tier.hasVisitors && time !== "night" && <span className="camp-decor" style={{ left: "70%", bottom: "8%" }}>🐿️</span>}
      </div>

      {/* Buildings (interactive) */}
      <div className="camp-layer">
        {buildings.map((b) => (
          <button
            key={b.id}
            className="camp-building"
            style={b.style}
            onClick={() => setOpenBuilding(b.id as typeof openBuilding)}
            aria-label={b.label}
          >
            <span className="camp-building-sprite">{b.icon}</span>
            <span className="camp-building-tag">{b.label}</span>
          </button>
        ))}
      </div>

      {/* Campfire — central hub with HUD */}
      <div className="camp-layer">
        <div className="camp-campfire" aria-label="Campfire">
          <span className="camp-campfire-glow" />
          <span className="camp-campfire-flame">🔥</span>
        </div>
      </div>

      {/* Wandering pet */}
      <div className="camp-layer">
        <WanderingPet pet={activePet} />
      </div>

      {/* HUD cards */}
      <div className="camp-hud-card">
        <div className="camp-hud-row">
          <span>Level {player.level}</span>
          <span style={{ color: "var(--coin)" }}><PixelIcon emoji="🪙" /> {player.coins.toLocaleString()}</span>
        </div>
        <div className="camp-hud-xpbar"><div style={{ width: `${xpPct}%` }} /></div>
        <div className="camp-hud-row" style={{ marginTop: 6, opacity: 0.8 }}>
          <span>{quests[0].title}: {quests[0].value}</span>
          {nextTier && <span>Next: Lv {nextTier}</span>}
        </div>
      </div>

      <div className="camp-tier-chip" title={`Time: ${TIME_LABEL[time]}`}>
        {tier.label} · {TIME_LABEL[time]}
      </div>

      {/* Time-of-day overlay */}
      <div className="camp-time-overlay" style={{ background: TIME_OVERLAY[time] }} />

      {/* Modals */}
      {openBuilding === "cabin"   && <CabinModal onClose={() => setOpenBuilding(null)} />}
      {openBuilding === "tent"    && <PaintersTentModal onClose={() => setOpenBuilding(null)} onThemeChange={triggerFade} />}
      {openBuilding === "nursery" && <PetNurseryModal onClose={() => setOpenBuilding(null)} />}
      {openBuilding === "board"   && <TrainingBoardModal onClose={() => setOpenBuilding(null)} />}
      {openBuilding === "wagon"   && (
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
      {openBuilding === "windmill" && (
        <ComingSoonModal icon="🌬️" title="Windmill" onClose={() => setOpenBuilding(null)}>
          Grind grains into pet treats — coming soon!
        </ComingSoonModal>
      )}
    </div>
  );
}
