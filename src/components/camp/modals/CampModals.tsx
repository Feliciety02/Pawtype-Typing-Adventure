import { useState, type ReactNode } from "react";
import { ModalShell } from "../../modals/ModalShell";
import { StatsView } from "../../game/StatsView";
import { ThemeSetsSection } from "../../shop/ThemeSetsSection";
import { PetRoom } from "../../shop/PetRoom";
import { useGame } from "../../../lib/game/store";
import { useWorld } from "../../shared/WorldTheme";
import type { WorldId } from "../../shared/WorldTheme";
import { xpForLevel, petEvolutionStage } from "../../../lib/game/types";
import { PixelIcon } from "../../../lib/icons/PixelIcon";
import { InventoryPage } from "../../inventory/InventoryPage";

/* Small shared wrapper */
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
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <span style={{ fontSize: 40, lineHeight: 1 }}>{icon}</span>
      <div>
        <div className="font-display" style={{ fontSize: "1.6rem", lineHeight: 1 }}>
          {title}
        </div>
        {subtitle && (
          <div
            className="font-pixel"
            style={{ fontSize: "0.6rem", color: "var(--muted-foreground)", marginTop: 4 }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

/* --- Cabin: profile + inventory + collection ---------------- */
export function CabinModal({ onClose }: { onClose: () => void }) {
  const { state } = useGame();
  const { player, inventory } = state;
  const needed = xpForLevel(player.level);
  return (
    <ModalShell ariaLabel="Cabin — Player Profile" onClose={onClose}>
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
    <ModalShell ariaLabel="Painter's Tent — Themes" onClose={onClose} className="max-w-4xl">
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

/* --- Training Board: visualized stats ----------------------- */
export function TrainingBoardModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell ariaLabel="Training Board — Statistics" onClose={onClose} className="max-w-4xl">
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

  const claim = () => {
    if (phase !== "idle") return;
    setPhase("shaking");
    window.setTimeout(() => {
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
      window.setTimeout(() => setBurst([]), 1200);
    }, 500);
  };

  return (
    <ModalShell ariaLabel="Supply Wagon — Daily Reward" onClose={onClose}>
      <CampModalHeader
        icon="🎁"
        title="Supply Wagon"
        subtitle={claimed ? "Come back tomorrow for more!" : "A daily gift awaits — open the chest"}
      />
      <div
        style={{ position: "relative", display: "grid", placeItems: "center", padding: "24px 0" }}
      >
        <button
          type="button"
          onClick={claim}
          className={`camp-chest ${phase === "idle" ? "is-ready" : ""} ${phase === "shaking" ? "is-shaking" : ""} ${phase === "open" ? "is-open" : ""}`}
          style={{
            background: "transparent",
            border: 0,
            cursor: phase === "idle" ? "pointer" : "default",
          }}
          aria-label="Open daily reward chest"
        >
          {phase === "open" ? "🧰" : "🎁"}
        </button>
        <div className="camp-chest-burst">
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
      <div className="pixel-card-sm p-3 text-center">
        <div className="font-pixel text-[0.6rem] uppercase text-muted-foreground">Reward</div>
        <div className="font-display text-xl mt-1">{rewardLabel}</div>
        <div className="font-pixel text-[0.65rem] mt-1" style={{ color: "var(--coin)" }}>
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
    <ModalShell ariaLabel={title} onClose={onClose}>
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
    <ModalShell ariaLabel="Bag — Inventory" onClose={onClose} className="max-w-4xl">
      <CampModalHeader icon="🎒" title="Bag" subtitle="Your eggs, pets, rewards, and collection" />
      <InventoryPage />
    </ModalShell>
  );
}

export { petEvolutionStage };
