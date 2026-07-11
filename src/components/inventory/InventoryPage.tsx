import { useMemo } from "react";
import { useGame } from "../../lib/game/store";
import { PixelIcon } from "../../lib/icons/PixelIcon";
import { PixelPet } from "../coach/PixelPet";
import { PET_NAMES, type PetType } from "../../lib/game/types";
import {
  EGG_POOL,
  LESSONS_PER_EGG,
  loadClaimedEggs,
  loadPendingEggs,
  milestoneForIndex,
  petLabel,
  progressTowardNextEgg,
} from "../../lib/game/eggs";
import { loadCompletedLessons } from "../../lib/game/curriculum";
import { loadChestLessons, loadClaimedChests } from "../../lib/game/chests";
import { THEMES, DOODADS, PETS } from "../../lib/shop/shopData";

export function InventoryPage() {
  const { state } = useGame();
  const { inventory } = state;

  const completedLessonsCount = useMemo(() => loadCompletedLessons().size, []);
  const claimed = useMemo(() => loadClaimedEggs(), []);
  const pending = useMemo(() => loadPendingEggs(), []);
  const chestLessons = useMemo(() => loadChestLessons(), []);
  const claimedChests = useMemo(() => loadClaimedChests(), []);

  const progress = progressTowardNextEgg(completedLessonsCount);
  const earnedEggs = Math.floor(completedLessonsCount / LESSONS_PER_EGG);

  // Unhatched = pending or (earned but not claimed).
  const unhatched: number[] = [];
  for (let i = 1; i <= earnedEggs; i++) if (!claimed.has(i)) unhatched.push(i);
  pending.forEach((idx) => {
    if (!unhatched.includes(idx) && !claimed.has(idx)) unhatched.push(idx);
  });
  unhatched.sort((a, b) => a - b);

  // Upcoming preview: next 3 eggs after the last claimed / pending
  const nextEggIndex = progress.nextIndex;
  const previewIndexes = [nextEggIndex, nextEggIndex + 1, nextEggIndex + 2].filter(
    (i) => !claimed.has(i) && !unhatched.includes(i),
  );

  // Ownable rewards from shop lookup so labels are pretty.
  const shopLookup = useMemo(() => {
    const map = new Map<string, { name: string; emoji: string }>();
    [...THEMES, ...DOODADS].forEach((it) =>
      map.set(it.id, { name: it.name, emoji: it.emoji ?? "🎁" }),
    );
    PETS.forEach((it) => map.set(it.id, { name: it.name, emoji: it.emoji ?? "🐾" }));
    return map;
  }, []);
  const rewardItems = inventory.items.map((id) => {
    const found = shopLookup.get(id);
    return { id, label: found?.name ?? id, emoji: found?.emoji ?? "🎁" };
  });

  return (
    <div className="inventory-root">
      <div className="pixel-card p-5">
        <h2 className="text-2xl leading-none">🎒 Inventory</h2>
        <p className="font-pixel text-[0.6rem] text-muted-foreground mt-1">
          Your eggs, pets, rewards, and milestone progress.
        </p>
      </div>

      {/* Milestone progress */}
      <div className="pixel-card p-5">
        <div className="inventory-section-title">🥚 Egg Milestone</div>
        <div className="font-pixel text-[0.6rem] mb-1">
          Egg #{progress.nextIndex} · {progress.progress}/{progress.total} lessons ·{" "}
          {claimed.size} hatched
        </div>
        <div className="inventory-progress">
          <div style={{ width: `${(progress.progress / progress.total) * 100}%` }} />
        </div>
        <p className="font-pixel text-[0.55rem] text-muted-foreground">
          Every {LESSONS_PER_EGG} completed lessons awards a new pet egg.
        </p>
      </div>

      {/* Unhatched Eggs */}
      <div className="pixel-card p-5">
        <div className="inventory-section-title">🥚 Unhatched Eggs ({unhatched.length})</div>
        {unhatched.length === 0 ? (
          <div className="inventory-empty">
            No eggs waiting — finish more lessons to earn one!
          </div>
        ) : (
          <div className="inventory-grid">
            {unhatched.map((idx) => {
              const m = milestoneForIndex(idx);
              return (
                <div key={idx} className="inventory-card">
                  <span className="inventory-icon">🥚</span>
                  <div className="inventory-title">Egg #{idx}</div>
                  <div className="inventory-sub">
                    Contains {petLabel(m.petType)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {previewIndexes.length > 0 && (
          <>
            <div className="inventory-section-title" style={{ marginTop: 12 }}>
              🔒 Upcoming
            </div>
            <div className="inventory-grid">
              {previewIndexes.map((idx) => {
                const m = milestoneForIndex(idx);
                return (
                  <div key={idx} className="inventory-card" style={{ opacity: 0.7 }}>
                    <span className="inventory-icon">❔</span>
                    <div className="inventory-title">Egg #{idx}</div>
                    <div className="inventory-sub">
                      Unlocks at {m.threshold} lessons
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Hatched Pets */}
      <div className="pixel-card p-5">
        <div className="inventory-section-title">
          🐾 Hatched Pets ({inventory.pets.length}/{EGG_POOL.length + 1})
        </div>
        {inventory.pets.length === 0 ? (
          <div className="inventory-empty">No pets yet.</div>
        ) : (
          <div className="inventory-grid">
            {inventory.pets.map((p) => (
              <div key={p.type} className="inventory-card">
                <PixelPet pet={p} size={64} showDetails={false} />
                <div className="inventory-title" style={{ marginTop: 6 }}>
                  {p.name || PET_NAMES[p.type as PetType]}
                </div>
                <div className="inventory-sub">
                  Lv.{p.level} · {p.xp} XP
                  {inventory.activePet === p.type ? " · Active" : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Claimed rewards / owned items */}
      <div className="pixel-card p-5">
        <div className="inventory-section-title">
          🎁 Claimed Rewards ({rewardItems.length})
        </div>
        {rewardItems.length === 0 ? (
          <div className="inventory-empty">No rewards claimed yet.</div>
        ) : (
          <div className="inventory-grid">
            {rewardItems.map((r) => (
              <div key={r.id} className="inventory-card">
                <span className="inventory-icon">
                  <PixelIcon emoji={r.emoji} />
                </span>
                <div className="inventory-title">{r.label}</div>
                <div className="inventory-sub">Owned</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chest tally */}
      <div className="pixel-card p-5">
        <div className="inventory-section-title">
          📦 Treasure Chests ({claimedChests.size}/{chestLessons.size})
        </div>
        <p className="font-pixel text-[0.55rem] text-muted-foreground">
          {chestLessons.size === 0
            ? "No chest lessons picked yet — pick some in the Lessons page."
            : `${claimedChests.size} of ${chestLessons.size} configured chests opened.`}
        </p>
      </div>
    </div>
  );
}
