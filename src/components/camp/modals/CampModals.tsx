import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ModalShell } from "../../modals/ModalShell";
import { StatsView } from "../../stats/StatsView";
import { ThemeSetsSection } from "../../shop/ThemeSetsSection";
import { PetRoom } from "../../shop/PetRoom";
import { useGame } from "../../../lib/game/store";
import { useWorld } from "../../shared/WorldTheme";
import type { WorldId } from "../../shared/WorldTheme";
import { xpForLevel } from "../../../lib/game/types";
import { PixelIcon } from "../../../lib/icons/PixelIcon";
import { InventoryPage } from "../../inventory/InventoryPage";

const CAMP_MODAL_SHELL = "pixel-modal-shell-camp";
const CAMP_MODAL_SHELL_WIDE = "pixel-modal-shell-camp is-wide";
const CAMP_MODAL_CONTENT = "camp-modal-content";

function CampModalHeader({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="camp-modal-header">
      <span className="camp-modal-header-icon" aria-hidden="true">
        {icon}
      </span>
      <div className="camp-modal-heading">
        <h2 className="camp-modal-title">{title}</h2>
        {subtitle ? <p className="camp-modal-subtitle">{subtitle}</p> : null}
      </div>
    </header>
  );
}

/* --- Cabin: profile + inventory + collection ---------------- */
export function CabinModal({ onClose }: { onClose: () => void }) {
  const { state } = useGame();
  const { player, inventory } = state;
  const needed = xpForLevel(player.level);
  return (
    <ModalShell
      ariaLabel="Cabin — Player Profile"
      onClose={onClose}
      className={CAMP_MODAL_SHELL}
      size="md"
      contentClassName={CAMP_MODAL_CONTENT}
    >
      <CampModalHeader icon="🏡" title="The Cabin" subtitle="Profile · Inventory · Collection" />

      <div className="pixel-card-sm p-3 mb-3">
        <div className="font-pixel text-[0.6rem] uppercase text-muted-foreground mb-2">
          Adventurer
        </div>
        <div className="grid grid-cols-3 gap-3 font-pixel text-[0.65rem]">
          <div>
            <div className="text-muted-foreground">Level</div>
            <div className="font-display text-xl">{player.level}</div>
          </div>
          <div>
            <div className="text-muted-foreground">XP</div>
            <div className="font-display text-xl">
              {player.xp}/{needed}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Streak</div>
            <div className="font-display text-xl">🔥 {player.streak}</div>
          </div>
        </div>
      </div>

      <div className="pixel-card-sm p-3">
        <div className="font-pixel text-[0.6rem] uppercase text-muted-foreground mb-2">
          Inventory ({inventory.items.length})
        </div>
        {inventory.items.length === 0 ? (
          <p className="font-pixel text-[0.6rem] text-muted-foreground">
            Empty. Complete adventures and daily rewards to collect items.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {inventory.items.map((id, i) => (
              <div key={`${id}-${i}`} className="pixel-card-sm px-2 py-1 font-pixel text-[0.55rem]">
                {id}
              </div>
            ))}
          </div>
        )}
      </div>
    </ModalShell>
  );
}

/* --- Painter's Tent: themes as postcards --------------------- */
export function PaintersTentModal({
  onClose,
  onThemeChange,
}: {
  onClose: () => void;
  onThemeChange: (w: WorldId) => void;
}) {
  const { world, setWorld } = useWorld();
  const pick = (w: WorldId) => {
    setWorld(w);
    onThemeChange(w);
  };
  return (
    <ModalShell
      ariaLabel="Painter's Tent — Themes"
      onClose={onClose}
      className={CAMP_MODAL_SHELL_WIDE}
      size="xl"
      contentClassName={CAMP_MODAL_CONTENT}
    >
      <CampModalHeader
        icon="🎨"
        title="Painter's Tent"
        subtitle="Choose a world to transform your camp"
      />
      <ThemeSetsSection activeWorld={world} onSelectWorld={pick} />
    </ModalShell>
  );
}

/* --- Pet Nursery -------------------------------------------- */
export function PetNurseryModal({ onClose }: { onClose: () => void }) {
  return <PetRoom onClose={onClose} />;
}

const BLACKSMITH_UPGRADES = [
  {
    id: "forge-combo-charm",
    name: "Combo Charm",
    cost: 250,
    icon: "🔥",
    detail: "A forged keepsake for long typing streaks.",
  },
  {
    id: "forge-pet-bowl",
    name: "Treat Bowl",
    cost: 180,
    icon: "🐾",
    detail: "A sturdy bowl for your campsite companion.",
  },
  {
    id: "forge-keyboard-trim",
    name: "Keyboard Trim",
    cost: 400,
    icon: "⚒️",
    detail: "A polished frame for your typing station.",
  },
] as const;

export function BlacksmithModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useGame();
  return (
    <ModalShell
      ariaLabel="Blacksmith Forge"
      onClose={onClose}
      className={CAMP_MODAL_SHELL}
      size="md"
      contentClassName={CAMP_MODAL_CONTENT}
    >
      <CampModalHeader
        icon="⚒️"
        title="Blacksmith Forge"
        subtitle={`${state.player.coins} coins available`}
      />
      <div className="grid gap-2">
        {BLACKSMITH_UPGRADES.map((upgrade) => {
          const owned = state.inventory.items.includes(upgrade.id);
          const affordable = state.player.coins >= upgrade.cost;
          return (
            <div key={upgrade.id} className="pixel-card-sm flex items-center gap-3 p-3">
              <span className="text-2xl" aria-hidden="true">
                {upgrade.icon}
              </span>
              <div className="min-w-0 flex-1">
                <strong className="font-display">{upgrade.name}</strong>
                <p className="m-0 font-pixel text-[0.52rem] text-muted-foreground">
                  {upgrade.detail}
                </p>
              </div>
              <button
                type="button"
                className="pixel-button"
                disabled={owned || !affordable}
                onClick={() => {
                  dispatch({ type: "SPEND_COINS", amount: upgrade.cost });
                  dispatch({ type: "ADD_ITEM", itemId: upgrade.id });
                }}
              >
                {owned ? "Forged" : `${upgrade.cost} coins`}
              </button>
            </div>
          );
        })}
      </div>
    </ModalShell>
  );
}

/* --- Training Board: visualized stats ----------------------- */
export function TrainingBoardModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell
      ariaLabel="Training Board — Statistics"
      onClose={onClose}
      className={CAMP_MODAL_SHELL_WIDE}
      size="xl"
      contentClassName={CAMP_MODAL_CONTENT}
    >
      <CampModalHeader
        icon="📖"
        title="Training Board"
        subtitle="Your typing journey — visualized"
      />
      <StatsView />
    </ModalShell>
  );
}

/* --- Supply Wagon: daily reward chest ----------------------- */
export function SupplyWagonModal({
  onClose,
  onClaim,
  claimed,
  rewardLabel,
  rewardCoins,
}: {
  onClose: () => void;
  onClaim: () => void;
  claimed: boolean;
  rewardLabel: string;
  rewardCoins: number;
}) {
  const [phase, setPhase] = useState<"idle" | "shaking" | "open">(claimed ? "open" : "idle");
  const [burst, setBurst] = useState<{ id: number; cx: string; cy: string; emoji: string }[]>([]);
  const claimTimerRef = useRef<number | null>(null);
  const burstTimerRef = useRef<number | null>(null);
  const rewardStatusId = useId();

  useEffect(() => {
    return () => {
      if (claimTimerRef.current !== null) window.clearTimeout(claimTimerRef.current);
      if (burstTimerRef.current !== null) window.clearTimeout(burstTimerRef.current);
    };
  }, []);

  const claim = () => {
    if (phase !== "idle") return;
    setPhase("shaking");
    claimTimerRef.current = window.setTimeout(() => {
      setPhase("open");
      const parts = Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        emoji: ["🪙", "⭐", "✨", "🎁"][i % 4],
        cx: `${(Math.random() * 240 - 120).toFixed(0)}px`,
        cy: `${(-40 - Math.random() * 140).toFixed(0)}px`,
      }));
      setBurst(parts);
      onClaim();
      window.dispatchEvent(new Event("pawtype-pet-celebrate"));
      burstTimerRef.current = window.setTimeout(() => setBurst([]), 1200);
    }, 500);
  };

  const chestLabel =
    phase === "idle"
      ? "Open daily reward chest"
      : phase === "shaking"
        ? "Opening daily reward chest"
        : "Daily reward already claimed";

  return (
    <ModalShell
      ariaLabel="Supply Wagon — Daily Reward"
      onClose={onClose}
      className={CAMP_MODAL_SHELL}
      size="md"
      contentClassName={CAMP_MODAL_CONTENT}
    >
      <CampModalHeader
        icon="🎁"
        title="Supply Wagon"
        subtitle={claimed ? "Come back tomorrow for more!" : "A daily gift awaits — open the chest"}
      />
      <div className="camp-chest-stage">
        <button
          type="button"
          onClick={claim}
          className={`camp-chest ${phase === "idle" ? "is-ready" : ""} ${phase === "shaking" ? "is-shaking" : ""} ${phase === "open" ? "is-open" : ""}`}
          disabled={phase !== "idle"}
          aria-label={chestLabel}
          aria-describedby={rewardStatusId}
        >
          <span aria-hidden="true">{phase === "open" ? "🧰" : "🎁"}</span>
        </button>
        <div className="camp-chest-burst" aria-hidden="true">
          {burst.map((b) => (
            <span
              key={b.id}
              style={{ ["--cx" as string]: b.cx, ["--cy" as string]: b.cy } as React.CSSProperties}
            >
              {b.emoji}
            </span>
          ))}
        </div>
      </div>
      <div
        id={rewardStatusId}
        className="camp-reward-status pixel-card-sm"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="camp-reward-kicker">
          {phase === "open"
            ? "Claimed reward"
            : phase === "shaking"
              ? "Opening…"
              : "Today's reward"}
        </div>
        <div className="camp-reward-label">{rewardLabel}</div>
        <div className="camp-reward-coins">
          <PixelIcon emoji="🪙" /> +{rewardCoins}
        </div>
      </div>
    </ModalShell>
  );
}

/* --- Generic modal shell for future features --------------- */
export function ComingSoonModal({
  icon,
  title,
  onClose,
  children,
}: {
  icon: string;
  title: string;
  onClose: () => void;
  children?: ReactNode;
}) {
  return (
    <ModalShell
      ariaLabel={title}
      onClose={onClose}
      className={CAMP_MODAL_SHELL}
      size="md"
      contentClassName={CAMP_MODAL_CONTENT}
    >
      <CampModalHeader icon={icon} title={title} subtitle="More features coming to camp soon!" />
      <div className="pixel-card-sm p-4 font-pixel text-[0.65rem] text-muted-foreground">
        {children ?? "This building is being built. Level up to unlock new camp features!"}
      </div>
    </ModalShell>
  );
}

/* --- Bag / Inventory ---------------------------------------- */
export function InventoryModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell
      ariaLabel="Bag — Inventory"
      onClose={onClose}
      className={CAMP_MODAL_SHELL_WIDE}
      size="xl"
      contentClassName={CAMP_MODAL_CONTENT}
    >
      <CampModalHeader icon="🎒" title="Bag" subtitle="Your eggs, pets, rewards, and collection" />
      <InventoryPage />
    </ModalShell>
  );
}
