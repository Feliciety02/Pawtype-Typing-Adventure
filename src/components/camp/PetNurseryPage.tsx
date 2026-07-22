import type { CSSProperties, RefObject } from "react";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, PawPrint } from "lucide-react";

import { loadCompletedLessons } from "@/lib/game/curriculum";
import {
  LESSONS_PER_EGG,
  loadClaimedEggs,
  loadPendingEggs,
  milestoneForIndex,
  progressTowardNextEgg,
} from "@/lib/game/eggs";
import { useGame } from "@/lib/game/store";
import { type PetType, petXpForLevel } from "@/lib/game/types";
import { PixelIcon } from "@/lib/icons/PixelIcon";
import { Button } from "@/components/ui/button";
import { PixelPet } from "@/components/coach/PixelPet";
import { Progress } from "@/components/ui/progress";
import { EggHatchModal } from "@/components/shop/EggHatchModal";
import { useThemeMode } from "@/hooks/use-theme-mode";

type PetNurseryPageProps = {
  backButtonRef: RefObject<HTMLButtonElement | null>;
  onBack: () => void;
};

const NURSERY_SLOT_COUNT = 5;
const NURSERY_SLOT_Y_OFFSETS = ["4%", "2%", "0%", "1%", "1%"] as const;
// Fine-tune each nest-and-egg pair to adjust its surrounding gaps.
const NURSERY_PAIR_X_OFFSETS = ["0%", "0%", "0%", "0%", "14%"] as const;
// Fine-tune each egg and its centered interaction target without moving its matching nest.
const NURSERY_EGG_OFFSETS = [
  { x: "-3%", y: "-37%" }, // Egg 1
  { x: "-3%", y: "-37%" }, // Egg 2
  { x: "-3%", y: "-39%" }, // Egg 3
  { x: "-3%", y: "-37%" }, // Egg 4
  { x: "-1%", y: "-51%" }, // Egg 5
] as const;

const NIGHT_ORB_DIRECTIONS = [
  { x: -7, y: -11 },
  { x: 6, y: -8 },
  { x: -4, y: -14 },
  { x: 8, y: -6 },
  { x: -9, y: -7 },
  { x: 5, y: -12 },
] as const;

function NightGlowOrbs({ className, count }: { className: string; count: number }) {
  const orbs = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const direction = NIGHT_ORB_DIRECTIONS[Math.floor(Math.random() * NIGHT_ORB_DIRECTIONS.length)];
        const size = Math.floor(Math.random() * 4) + 2;

        return (
          <span
            key={index}
            className="camp-nursery-night-orb"
            style={
              {
                top: `${Math.random() * 86 + 7}%`,
                left: `${Math.random() * 90 + 5}%`,
                "--night-orb-size": `${size}px`,
                "--night-orb-x": `${direction.x}px`,
                "--night-orb-y": `${direction.y}px`,
                "--night-orb-duration": `${(Math.random() * 2.4 + 2.4).toFixed(2)}s`,
                "--night-orb-delay": `${(Math.random() * 3.5).toFixed(2)}s`,
              } as CSSProperties
            }
          />
        );
      }),
    [count],
  );

  return <span className={`camp-nursery-night-orbs ${className}`} aria-hidden="true">{orbs}</span>;
}

function tierForSlot(slot: number) {
  return Math.min(slot, NURSERY_SLOT_COUNT);
}

function nestAssetForTier(tier: number) {
  return tier === 5 ? "nest_tier2.webp" : "nest_tier1.webp";
}

export function PetNurseryPage({ backButtonRef, onBack }: PetNurseryPageProps) {
  const { state, dispatch } = useGame();
  const { dark } = useThemeMode();
  const { inventory } = state;
  const [showCompanions, setShowCompanions] = useState(false);
  const [activeEgg, setActiveEgg] = useState<ReturnType<typeof milestoneForIndex> | null>(null);
  const [eggRefreshKey, setEggRefreshKey] = useState(0);
  const [nightBackgroundReady, setNightBackgroundReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const nightBackground = new Image();
    const markReady = () => {
      if (!cancelled) setNightBackgroundReady(true);
    };

    nightBackground.decoding = "async";
    nightBackground.src = "/pages/camp/pet-nursery/pet-nursery_evening.webp";
    if (nightBackground.complete) markReady();
    else nightBackground.addEventListener("load", markReady, { once: true });

    return () => {
      cancelled = true;
      nightBackground.removeEventListener("load", markReady);
    };
  }, []);

  const treatCount = inventory.items.filter((item) => item === "pet-food-day-5").length;
  const activePet =
    inventory.pets.find((pet) => pet.type === inventory.activePet) ?? inventory.pets[0] ?? null;

  const completedLessonsCount = useMemo(() => loadCompletedLessons().size, []);
  const claimed = useMemo(() => loadClaimedEggs(), [eggRefreshKey]);
  const pending = useMemo(() => loadPendingEggs(), [eggRefreshKey]);

  const progress = progressTowardNextEgg(completedLessonsCount);
  const earnedEggs = Math.floor(completedLessonsCount / LESSONS_PER_EGG);

  const availableEggs = useMemo(() => {
    const eggs: number[] = [];
    for (let i = 1; i <= earnedEggs; i += 1) {
      if (!claimed.has(i)) eggs.push(i);
    }
    pending.forEach((index) => {
      if (!claimed.has(index) && !eggs.includes(index)) eggs.push(index);
    });
    eggs.sort((a, b) => a - b);
    return eggs;
  }, [claimed, earnedEggs, pending]);

  const slots = Array.from({ length: NURSERY_SLOT_COUNT }, (_, slotIndex) => {
    const slotNumber = slotIndex + 1;
    const eggIndex = availableEggs[slotIndex];
    const tier = tierForSlot(slotNumber);
    const milestone = eggIndex
      ? milestoneForIndex(eggIndex)
      : milestoneForIndex(progress.nextIndex + slotIndex);

    return {
      id: `nursery-slot-${slotNumber}`,
      tier,
      eggIndex,
      milestone,
      locked: !eggIndex,
      featured: slotNumber === 3,
      slotYOffset: NURSERY_SLOT_Y_OFFSETS[slotIndex] ?? "0%",
      pairXOffset: NURSERY_PAIR_X_OFFSETS[slotIndex] ?? "0%",
      eggOffset: NURSERY_EGG_OFFSETS[slotIndex] ?? { x: "0%", y: "0%" },
    };
  });

  const feed = () => {
    if (treatCount === 0 || !inventory.activePet) return;
    dispatch({ type: "REMOVE_ITEM", itemId: "pet-food-day-5" });
    dispatch({ type: "ADD_PET_XP", amount: 25 });
  };

  const openEgg = (eggIndex?: number) => {
    if (!eggIndex) return;
    setActiveEgg(milestoneForIndex(eggIndex));
  };

  return (
    <section
      className={`camp-interior-page camp-nursery-page ${dark && nightBackgroundReady ? "is-night-background" : ""}`}
      aria-label="Pet Nursery"
    >
      <div className="camp-interior-toolbar camp-nursery-toolbar">
        <Button
          ref={backButtonRef}
          variant="secondary"
          className="camp-interior-back"
          onClick={onBack}
        >
          <ArrowLeft aria-hidden="true" />
          <span>Back to Camp</span>
        </Button>
        <div className="camp-nursery-toolbar-copy">
          <h1>Pet Nursery</h1>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="camp-nursery-companion-toggle"
          aria-expanded={showCompanions}
          onClick={() => setShowCompanions((visible) => !visible)}
        >
          <PawPrint aria-hidden="true" />
          <span>Companions</span>
          <strong>{inventory.pets.length}</strong>
        </Button>
      </div>

      <div className={`camp-nursery-shell ${showCompanions ? "is-companion-open" : ""}`}>
        <div className="camp-nursery-stage-frame">
          <div className="camp-nursery-stage-head">
            <div className="camp-nursery-stage-copy">
              <span className="camp-nursery-kicker">Egg Hall</span>
              <h2>Nest Stage</h2>
            </div>
            <div className="camp-nursery-stage-stats" aria-label="Nursery overview">
              <div className="camp-nursery-stage-stat">
                <strong>{availableEggs.length}</strong>
                <span>Eggs waiting</span>
              </div>
              <div className="camp-nursery-stage-stat">
                <strong>{inventory.pets.length}</strong>
                <span>Pets housed</span>
              </div>
              <div className="camp-nursery-stage-stat">
                <strong>{treatCount}</strong>
                <span>Treats stored</span>
              </div>
            </div>
          </div>

          <div className="camp-nursery-nest-group" aria-hidden="true">
            <NightGlowOrbs className="camp-nursery-night-orbs--nests" count={13} />
            {slots.map((slot) => (
              <div
                key={slot.id}
                className={`camp-nursery-nest-slot ${slot.featured ? "is-featured" : ""} ${slot.tier === 5 ? "is-tier-five" : ""}`}
                style={
                  {
                    "--nursery-pair-x": slot.pairXOffset,
                    "--nursery-slot-y": `-${slot.slotYOffset}`,
                  } as CSSProperties
                }
              >
                <div className="camp-nursery-nest-anchor">
                  <img
                    className="camp-nursery-nest"
                    src={`/pages/camp/pet-nursery/nests/${nestAssetForTier(slot.tier)}`}
                    alt=""
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="camp-nursery-egg-group" role="list" aria-label="Pet nursery eggs">
            {slots.map((slot) => (
              <article
                key={slot.id}
                className={`camp-nursery-egg-slot ${slot.locked ? "is-locked" : "is-ready"} ${slot.featured ? "is-featured" : ""} ${slot.tier === 5 ? "is-tier-five" : ""}`}
                role="listitem"
                style={
                  {
                    "--nursery-egg-x": slot.eggOffset.x,
                    "--nursery-egg-y": slot.eggOffset.y,
                    "--nursery-pair-x": slot.pairXOffset,
                    "--nursery-slot-y": `-${slot.slotYOffset}`,
                  } as CSSProperties
                }
              >
                <div className="camp-nursery-egg-anchor">
                  <NightGlowOrbs className="camp-nursery-night-orbs--egg" count={5} />
                  <button
                    type="button"
                    className="camp-nursery-egg-button"
                    onClick={() => openEgg(slot.eggIndex)}
                    disabled={!slot.eggIndex}
                    aria-label={
                      slot.eggIndex
                        ? `Open Egg ${slot.eggIndex}`
                        : `Egg ${slot.milestone.index} unlocks at ${slot.milestone.threshold} lessons`
                    }
                  />
                  <span className="camp-nursery-egg-art" aria-hidden="true">
                    <img
                      className="camp-nursery-egg"
                      src={`/pages/camp/pet-nursery/eggs/egg_tier${slot.tier}.webp`}
                      alt=""
                    />
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="camp-nursery-ramp" aria-hidden="true">
            <img src="/pages/camp/pet-nursery/ramp.webp" alt="" />
            <NightGlowOrbs className="camp-nursery-night-orbs--ramp" count={6} />
          </div>

          <div className="camp-nursery-progress">
            <div className="camp-nursery-progress-head">
              <div>
                <span className="camp-nursery-kicker">Milestone Progress</span>
                <strong>Egg #{progress.nextIndex}</strong>
              </div>
              <span>
                {progress.progress}/{progress.total} lessons
              </span>
            </div>
            <Progress
              value={progress.progress}
              max={progress.total}
              size="md"
              tone="coin"
              aria-label={`Next egg milestone: ${progress.progress} of ${progress.total} lessons`}
            />
          </div>
        </div>

        <div className="camp-nursery-active-panel pixel-card">
          <div className="camp-nursery-panel-head">
            <div>
              <span className="camp-nursery-kicker">Caretaker Bond</span>
              <h2>Active Companion</h2>
            </div>
            <span className="camp-nursery-chip">
              <PixelIcon emoji="🐾" /> {activePet ? "Ready" : "Empty"}
            </span>
          </div>

          {activePet ? (
            <div className="camp-nursery-active-card">
              <div className="camp-nursery-active-pet">
                <PixelPet pet={activePet} size={108} showDetails={false} />
              </div>
              <div className="camp-nursery-active-copy">
                <strong>{activePet.name}</strong>
                <span>
                  Lv. {activePet.level} · {activePet.xp}/{petXpForLevel(activePet.level)} XP
                </span>
                <Progress
                  value={activePet.xp}
                  max={petXpForLevel(activePet.level)}
                  size="sm"
                  tone="success"
                  aria-label={`${activePet.name} XP progress`}
                />
                <p>
                  Feed treats to level up faster and keep this companion ready for the campsite.
                </p>
              </div>
            </div>
          ) : (
            <p className="camp-nursery-empty">
              No active companion selected yet. Hatch a pet and assign it here.
            </p>
          )}

          <div className="camp-nursery-actions">
            <Button
              className="camp-nursery-feed-btn"
              type="button"
              onClick={feed}
              disabled={treatCount === 0 || !inventory.activePet}
            >
              Feed Treat ({treatCount}) +25 XP
            </Button>
          </div>
        </div>

        <div className="camp-nursery-pet-panel pixel-card">
          <div className="camp-nursery-panel-head">
            <div>
              <span className="camp-nursery-kicker">Companions</span>
              <h2>Choose Active Pet</h2>
            </div>
            <span className="camp-nursery-chip">
              <PixelIcon emoji="🥚" /> {availableEggs.length} waiting
            </span>
          </div>

          {inventory.pets.length === 0 ? (
            <p className="camp-nursery-empty">
              No pets yet. Visit the Curiosity Cart and hatch reward eggs to fill this room.
            </p>
          ) : (
            <div className="camp-nursery-pet-grid">
              {inventory.pets.map((pet) => {
                const isActive = inventory.activePet === pet.type;
                const nextPetLevel = petXpForLevel(pet.level);
                return (
                  <button
                    key={pet.type}
                    type="button"
                    onClick={() =>
                      dispatch({ type: "SET_ACTIVE_PET", petType: pet.type as PetType })
                    }
                    className={`camp-nursery-pet-card ${isActive ? "is-active" : ""}`}
                    aria-pressed={isActive}
                    aria-label={`${pet.name}, ${isActive ? "active companion" : "make active companion"}`}
                  >
                    <PixelPet pet={pet} size={72} showDetails={false} />
                    <div className="camp-nursery-pet-copy">
                      <strong>{pet.name}</strong>
                      <span>
                        Lv. {pet.level} · {pet.xp}/{nextPetLevel} XP
                      </span>
                    </div>
                    {isActive ? <span className="camp-nursery-active-badge">Active</span> : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {activeEgg ? (
        <EggHatchModal
          milestone={activeEgg}
          onClose={() => {
            setActiveEgg(null);
            setEggRefreshKey((value) => value + 1);
          }}
        />
      ) : null}
    </section>
  );
}
