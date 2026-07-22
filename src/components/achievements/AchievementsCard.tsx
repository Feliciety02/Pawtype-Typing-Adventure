import { memo, useEffect, useMemo, useState } from "react";
import { BookOpen, Crosshair, Flame, PawPrint, Shield, Zap } from "lucide-react";
import {
  computeAchievements,
  type Achievement,
  type BadgeCategory,
} from "../../lib/game/achievements";
import { useGame } from "../../lib/game/store";

const BADGE_BASE = "/awards/badges";
const AWARDS_BASE = "/awards/scene";
const WING_TRANSITION_MS = 1120;

type MuseumWingId = "speed" | "accuracy" | "challenge" | "pet" | "learning" | "combo";

type MuseumWing = {
  id: MuseumWingId;
  category: BadgeCategory;
  label: string;
  shortLabel: string;
  description: string;
  banner: string;
  icon: typeof Zap;
};

type MuseumStage = {
  wing: MuseumWing;
  awards: Achievement[];
  unlocked: number;
};

const WINGS: MuseumWing[] = [
  {
    id: "speed",
    category: "speed",
    label: "Speed Wing",
    shortLabel: "Speed",
    description: "Relics earned by pushing your typing pace beyond ordinary limits.",
    banner: "speed-wing-banner.webp",
    icon: Zap,
  },
  {
    id: "accuracy",
    category: "accuracy",
    label: "Accuracy Wing",
    shortLabel: "Accuracy",
    description: "Treasures reserved for precise, careful, mistake-resistant typing.",
    banner: "accuracy-wing-banner.webp",
    icon: Crosshair,
  },
  {
    id: "challenge",
    category: "challenge",
    label: "Challenge Wing",
    shortLabel: "Challenge",
    description: "Heroic honors collected from major milestones and difficult trials.",
    banner: "challenge-wing-banner.webp",
    icon: Shield,
  },
  {
    id: "pet",
    category: "pet",
    label: "Companion Wing",
    shortLabel: "Companion",
    description: "Keepsakes celebrating the fuzzy friends who travel beside you.",
    banner: "companion-wing-banner.webp",
    icon: PawPrint,
  },
  {
    id: "learning",
    category: "learning",
    label: "Learning Wing",
    shortLabel: "Learning",
    description: "Ancient knowledge pieces gained through lessons and steady study.",
    banner: "learning-wing-banner.webp",
    icon: BookOpen,
  },
  {
    id: "combo",
    category: "combo",
    label: "Combo Wing",
    shortLabel: "Combo",
    description: "Flame-forged artifacts awarded for long, unbroken typing streaks.",
    banner: "combo-wing-banner.webp",
    icon: Flame,
  },
];

const SHELF_COLUMNS = [20, 34, 49.5, 65, 79] as const;

const shelfPositions = {
  lower: SHELF_COLUMNS.map((x) => ({ x, y: 67 })),
  upper: SHELF_COLUMNS.map((x) => ({ x, y: 29 })),
} as const;

const badgePositions = {
  lower: SHELF_COLUMNS.map((x) => ({ x, y: 70 })),
  upper: SHELF_COLUMNS.map((x) => ({ x, y: 32 })),
} as const;

function getShelfPosition(index: number) {
  const row = index < 5 ? "lower" : "upper";
  return {
    row,
    ...badgePositions[row][index % 5],
  };
}

function getPlatformPosition(index: number) {
  const row = index < 5 ? "lower" : "upper";
  return shelfPositions[row][index % 5];
}

const TIER_COLORS: Record<number, string> = {
  1: "#c9bba6",
  2: "#66e79a",
  3: "#76a8ff",
  4: "#b995ff",
  5: "#ffc952",
  6: "#ff9b55",
  7: "#6df2ff",
  8: "#fff077",
  9: "#ff8fd0",
  10: "#ffd86b",
};

function MuseumAtmosphere() {
  return <div className="awards-museum-atmosphere" aria-hidden="true" />;
}

function WingBanner({
  wing,
  unlocked,
  total,
}: {
  wing: MuseumWing;
  unlocked: number;
  total: number;
}) {
  return (
    <section className="awards-wing-banner" aria-label={`${wing.label} overview`}>
      <img
        src={`${AWARDS_BASE}/banner/${wing.banner}`}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <div className="awards-wing-banner-copy">
        <strong>
          {unlocked} / {total} collected
        </strong>
        <span
          className="awards-banner-progress"
          aria-label={`Collection progress ${unlocked} of ${total}`}
        >
          {Array.from({ length: total }, (_, index) => (
            <i key={index} data-filled={index < unlocked ? "true" : "false"} />
          ))}
        </span>
      </div>
    </section>
  );
}

const DOT_COUNT = 5;

const DOT_DIRECTIONS = [
  { x: -5, y: -7 },
  { x: 5, y: -4 },
  { x: -3, y: -8 },
  { x: 6, y: -3 },
  { x: -6, y: -6 },
  { x: 4, y: -7 },
  { x: -4, y: -5 },
  { x: 3, y: -9 },
];

function SparkleDots() {
  const dots = useMemo(() => {
    const result: React.ReactNode[] = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      const dir = DOT_DIRECTIONS[Math.floor(Math.random() * DOT_DIRECTIONS.length)];
      result.push(
        <span
          key={i}
          className="awards-sparkle-dot"
          style={
            {
              top: `${Math.random() * 90 + 5}%`,
              left: `${Math.random() * 90 + 5}%`,
              "--dot-x": `${dir.x}px`,
              "--dot-y": `${dir.y}px`,
              "--dot-duration": `${(Math.random() * 1.8 + 1.5).toFixed(2)}s`,
              "--dot-delay": `${(Math.random() * 3).toFixed(2)}s`,
            } as React.CSSProperties
          }
        />,
      );
    }
    return result;
  }, []);
  return <>{dots}</>;
}

const AwardSlot = memo(function AwardSlot({
  achievement,
  index,
}: {
  achievement: Achievement;
  index: number;
}) {
  const position = getShelfPosition(index);
  const isLegendary = index === 9;
  const percent =
    achievement.progress && achievement.progress.goal > 0
      ? Math.min(100, Math.round((achievement.progress.current / achievement.progress.goal) * 100))
      : achievement.unlocked
        ? 100
        : 0;

  return (
    <button
      type="button"
      className={`awards-artifact ${isLegendary ? "awards-artifact--legendary" : ""}`}
      data-unlocked={achievement.unlocked ? "true" : "false"}
      data-shelf-row={position.row}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        ["--artifact-color" as string]: TIER_COLORS[achievement.tier] ?? "#ffd86b",
      }}
      aria-label={`${achievement.title}, ${achievement.rarity}, ${
        achievement.unlocked ? "unlocked" : "locked"
      }`}
    >
      <span className="awards-artifact-spotlight" aria-hidden="true" />
      <span className="awards-artifact-frame">
        <span className="awards-artifact-sparkles" aria-hidden="true">
          <SparkleDots />
        </span>
        <img
          src={`${BADGE_BASE}/${achievement.category}/${achievement.assetName}`}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        {!achievement.unlocked && (
          <span className="awards-artifact-lock">
            <img src="/shared/icons/lock.webp" alt="Locked" className="awards-artifact-lock-img" />
          </span>
        )}
      </span>
      <AwardTooltip achievement={achievement} percent={percent} />
    </button>
  );
});

function LegendaryAward({ achievement }: { achievement: Achievement }) {
  return <AwardSlot achievement={achievement} index={9} />;
}

function MuseumShelf({ awards }: { awards: Achievement[] }) {
  return (
    <section className="awards-museum-shelf" aria-label="Museum shelf">
      <img
        className="awards-shelf-art"
        src={`${AWARDS_BASE}/shelf.webp`}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      {awards.map((_, index) => (
        <span
          key={index}
          className="awards-artifact-pedestal"
          aria-hidden="true"
          style={{
            left: `${getPlatformPosition(index).x}%`,
            top: `${getPlatformPosition(index).y}%`,
          }}
        />
      ))}
      {awards.map((achievement, index) =>
        index === 9 ? (
          <LegendaryAward key={achievement.id} achievement={achievement} />
        ) : (
          <AwardSlot key={achievement.id} achievement={achievement} index={index} />
        ),
      )}
    </section>
  );
}

function MuseumStageView({ stage, state }: { stage: MuseumStage; state: "enter" | "exit" }) {
  return (
    <div className="awards-museum-stage" data-transition={state}>
      <WingBanner wing={stage.wing} unlocked={stage.unlocked} total={stage.awards.length} />
      <MuseumShelf awards={stage.awards} />
    </div>
  );
}

function AwardTooltip({ achievement, percent }: { achievement: Achievement; percent: number }) {
  return (
    <span className="awards-tooltip">
      <strong>{achievement.title}</strong>
      <span>{achievement.rarity}</span>
      <span>{achievement.description}</span>
      {achievement.progress && !achievement.unlocked && (
        <span>
          Requirement: {achievement.progress.current} / {achievement.progress.goal} ({percent}%)
        </span>
      )}
      <em>{achievement.unlocked ? "Unlocked exhibit" : "Reserved exhibit"}</em>
    </span>
  );
}

function WingNavigation({
  activeWing,
  onChange,
}: {
  activeWing: MuseumWingId;
  onChange: (wing: MuseumWingId) => void;
}) {
  return (
    <nav className="awards-wing-nav" aria-label="Award wings">
      <div className="awards-wing-emblems">
        {WINGS.map((wing) => {
          const Icon = wing.icon;
          const isActive = wing.id === activeWing;
          return (
            <button
              key={wing.id}
              type="button"
              className="awards-wing-emblem"
              data-active={isActive ? "true" : "false"}
              aria-pressed={isActive}
              onClick={() => onChange(wing.id)}
            >
              <span className="awards-wing-emblem-icon" aria-hidden="true">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              <span className="awards-wing-emblem-label">{wing.shortLabel}</span>
              <span className="awards-wing-emblem-marker" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function AchievementsCard() {
  const { state } = useGame();
  const [activeWing, setActiveWing] = useState<MuseumWingId>("speed");
  const [previousStage, setPreviousStage] = useState<MuseumStage | null>(null);
  const [transitionKey, setTransitionKey] = useState(0);
  const achievements = computeAchievements(state);
  const wing = WINGS.find((item) => item.id === activeWing) ?? WINGS[0];

  const awards = useMemo(
    () =>
      achievements
        .filter((achievement) => achievement.category === wing.category)
        .sort((a, b) => a.tier - b.tier)
        .slice(0, 10),
    [achievements, wing.category],
  );

  const unlocked = awards.filter((achievement) => achievement.unlocked).length;
  const currentStage = useMemo(() => ({ wing, awards, unlocked }), [awards, unlocked, wing]);

  useEffect(() => {
    if (!previousStage) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setPreviousStage(null);
    }, WING_TRANSITION_MS);

    return () => window.clearTimeout(timeout);
  }, [previousStage, transitionKey]);

  function handleWingChange(nextWing: MuseumWingId) {
    if (nextWing === activeWing) {
      return;
    }

    setPreviousStage(currentStage);
    setActiveWing(nextWing);
    setTransitionKey((key) => key + 1);
  }

  return (
    <div className="awards-museum">
      <MuseumAtmosphere />
      <div className="awards-museum-stage-deck" aria-live="polite">
        {previousStage && (
          <MuseumStageView
            key={`exit-${previousStage.wing.id}-${transitionKey}`}
            stage={previousStage}
            state="exit"
          />
        )}
        <MuseumStageView
          key={`enter-${wing.id}-${transitionKey}`}
          stage={currentStage}
          state="enter"
        />
      </div>
      <WingNavigation activeWing={activeWing} onChange={handleWingChange} />
    </div>
  );
}
