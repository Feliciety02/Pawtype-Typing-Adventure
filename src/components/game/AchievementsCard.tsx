import { memo, useEffect, useMemo, useState } from "react";
import { computeAchievements, type Achievement, type BadgeCategory } from "../../lib/game/achievements";
import { useGame } from "../../lib/game/store";

const BADGE_BASE = "/badges";
const AWARDS_BASE = "/awards";
const WING_TRANSITION_MS = 1120;

type MuseumWingId = "speed" | "accuracy" | "challenge" | "pet" | "learning" | "combo";

type MuseumWing = {
  id: MuseumWingId;
  category: BadgeCategory;
  label: string;
  shortLabel: string;
  description: string;
  banner: string;
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
    banner: "speed-wing-banner.png",
  },
  {
    id: "accuracy",
    category: "accuracy",
    label: "Accuracy Wing",
    shortLabel: "Accuracy",
    description: "Treasures reserved for precise, careful, mistake-resistant typing.",
    banner: "accuracy-wing-banner.png",
  },
  {
    id: "challenge",
    category: "challenge",
    label: "Challenge Wing",
    shortLabel: "Challenge",
    description: "Heroic honors collected from major milestones and difficult trials.",
    banner: "challenge-wing-banner.png",
  },
  {
    id: "pet",
    category: "pet",
    label: "Companion Wing",
    shortLabel: "Companion",
    description: "Keepsakes celebrating the fuzzy friends who travel beside you.",
    banner: "companion-wing-banner.png",
  },
  {
    id: "learning",
    category: "learning",
    label: "Learning Wing",
    shortLabel: "Learning",
    description: "Ancient knowledge pieces gained through lessons and steady study.",
    banner: "learning-wing-banner.png",
  },
  {
    id: "combo",
    category: "combo",
    label: "Combo Wing",
    shortLabel: "Combo",
    description: "Flame-forged artifacts awarded for long, unbroken typing streaks.",
    banner: "combo-wing-banner.png",
  },
];

const SHELF_COLUMNS = [17, 33.5, 50, 66.5, 83] as const;

const shelfPositions = {
  lower: SHELF_COLUMNS.map((x) => ({ x, y: 69 })),
  upper: SHELF_COLUMNS.map((x) => ({ x, y: 34 })),
} as const;

function getShelfPosition(index: number) {
  const row = index < 5 ? "lower" : "upper";
  return {
    row,
    ...shelfPositions[row][index % 5],
  };
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
        <span className="awards-banner-progress" aria-label={`Collection progress ${unlocked} of ${total}`}>
          {Array.from({ length: total }, (_, index) => (
            <i key={index} data-filled={index < unlocked ? "true" : "false"} />
          ))}
        </span>
      </div>
    </section>
  );
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
        <span className="awards-artifact-sparkles" aria-hidden="true" />
        <img
          src={`${BADGE_BASE}/${achievement.category}/${achievement.assetName}`}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        {!achievement.unlocked && <span className="awards-artifact-lock">LOCK</span>}
      </span>
      <span className="awards-artifact-pedestal" aria-hidden="true" />
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
        src={`${AWARDS_BASE}/shelf.png`}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
      />
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

function MuseumStageView({
  stage,
  state,
}: {
  stage: MuseumStage;
  state: "enter" | "exit";
}) {
  return (
    <div className="awards-museum-stage" data-transition={state}>
      <WingBanner wing={stage.wing} unlocked={stage.unlocked} total={stage.awards.length} />
      <MuseumShelf awards={stage.awards} />
    </div>
  );
}

function AwardTooltip({
  achievement,
  percent,
}: {
  achievement: Achievement;
  percent: number;
}) {
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
        {WINGS.map((wing) => (
          <button
            key={wing.id}
            type="button"
            className="awards-wing-emblem"
            data-active={wing.id === activeWing ? "true" : "false"}
            onClick={() => onChange(wing.id)}
          >
            {wing.shortLabel}
          </button>
        ))}
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
  const currentStage = useMemo(
    () => ({ wing, awards, unlocked }),
    [awards, unlocked, wing],
  );

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
        <MuseumStageView key={`enter-${wing.id}-${transitionKey}`} stage={currentStage} state="enter" />
      </div>
      <WingNavigation activeWing={activeWing} onChange={handleWingChange} />
    </div>
  );
}
