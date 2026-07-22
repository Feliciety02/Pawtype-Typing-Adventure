import { useCallback, useEffect, useMemo, useState } from "react";
import { useWorld, WORLDS, type WorldId } from "../shared/WorldTheme";
import { useGame } from "../../lib/game/store";
import { precomputeGoals, getCachedGoals } from "../../lib/game/engine/difficulty";
import {
  type Difficulty,
  type Stage,
  type Status,
  STAGE_DEFS,
  NODE_IMAGES,
  rewardsFor,
  wordsFor,
} from "@/lib/adventure/adventureData";
import { StageNode } from "./StageNode";
import { StageRunner } from "./StageRunner";
import { Progress } from "@/components/ui/progress";

export function AdventureMap() {
  const { world } = useWorld();
  const { state, dispatch } = useGame();
  const [adaptiveGoals, setAdaptiveGoals] = useState<Record<Difficulty, number> | null>(null);

  useEffect(() => {
    precomputeGoals(state.sessions)
      .then(setAdaptiveGoals)
      .catch(() => console.warn("Failed to precompute adaptive goals"));
  }, [state.sessions]);

  const goals = adaptiveGoals ?? getCachedGoals();
  const stagesForWorld = useCallback(
    (worldId: WorldId): Stage[] =>
      (STAGE_DEFS[worldId] ?? STAGE_DEFS.cafe ?? []).map((stage, index) => ({
        id: index + 1,
        ...stage,
        goal: goals[stage.difficulty] + (index === 1 ? 5 : 0),
        words: wordsFor(worldId, index + 1),
      })),
    [goals],
  );

  const orderedWorlds = useMemo(
    () => [
      ...WORLDS.filter((item) => item.id === world),
      ...WORLDS.filter((item) => item.id !== world),
    ],
    [world],
  );
  const allStages = useMemo(
    () => orderedWorlds.flatMap((item) => stagesForWorld(item.id)),
    [orderedWorlds, stagesForWorld],
  );
  const totalCleared = orderedWorlds.reduce(
    (sum, item) => sum + (state.adventures[item.id]?.length ?? 0),
    0,
  );
  const [active, setActive] = useState<{ stage: Stage; world: WorldId; image?: string } | null>(
    null,
  );

  const statusOf = (worldId: WorldId, stage: Stage, index: number): Status => {
    const stages = stagesForWorld(worldId);
    const completed = state.adventures[worldId] ?? [];
    if (completed.includes(stage.id)) return "complete";
    if (index === 0) return "available";
    return completed.includes(stages[index - 1].id) ? "available" : "locked";
  };

  const nextWorld = orderedWorlds.find((item) =>
    stagesForWorld(item.id).some((stage, index) => statusOf(item.id, stage, index) === "available"),
  );
  const nextStage = nextWorld
    ? stagesForWorld(nextWorld.id).find(
        (stage, index) => statusOf(nextWorld.id, stage, index) === "available",
      )
    : undefined;

  return (
    <div className="adventure-shell pixel-card p-5 sm:p-6 relative overflow-hidden">
      <div className="adventure-header">
        <div className="adventure-title-block">
          <div className="adventure-kicker">World Quest</div>
          <h2 className="text-4xl leading-none">Adventure Map</h2>
          <p className="font-pixel text-[0.65rem] text-muted-foreground mt-2">
            Clear each cozy typing stage to unlock the next path.
          </p>
        </div>

        <div className="adventure-progress-card">
          <div className="flex items-center justify-between gap-3">
            <span className="font-pixel text-[0.55rem] uppercase text-muted-foreground">
              All Worlds
            </span>
            <strong className="font-display text-2xl leading-none">
              {totalCleared}/{allStages.length}
            </strong>
          </div>
          <Progress
            value={totalCleared}
            max={allStages.length}
            size="md"
            tone="success"
            aria-label={`All worlds cleared: ${totalCleared} of ${allStages.length} stages`}
          />
          <div className="adventure-next-line">
            <span>{nextStage ? "Next stage" : "All clear"}</span>
            <strong>
              {nextStage ? `${nextWorld?.name}: ${nextStage.name}` : "All worlds complete"}
            </strong>
          </div>
        </div>
      </div>

      <div className="adventure-world-list">
        {orderedWorlds.map((theme) => {
          const stages = stagesForWorld(theme.id);
          const completed = state.adventures[theme.id] ?? [];
          return (
            <section
              className="adventure-world-section"
              key={theme.id}
              style={{ "--stage-accent": theme.swatches[1] } as Record<string, string>}
            >
              <div className="adventure-world-header">
                <div>
                  <h3>{theme.name} Quest</h3>
                  <p>{theme.blurb}</p>
                </div>
                <div className="adventure-world-progress">
                  <strong>
                    {completed.length}/{stages.length}
                  </strong>
                  <span>cleared</span>
                  <Progress
                    value={completed.length}
                    max={stages.length}
                    size="md"
                    tone="success"
                    aria-label={`${theme.name} cleared: ${completed.length} of ${stages.length} stages`}
                  />
                </div>
              </div>

              <div className="adventure-map-board">
                <div className="adventure-map-glow" aria-hidden="true" />
                <div className="adventure-node-grid">
                  {stages.map((stage, index) => {
                    const status = statusOf(theme.id, stage, index);
                    const image = NODE_IMAGES[theme.id]?.[index];
                    return (
                      <StageNode
                        key={`${theme.id}-${stage.id}`}
                        stage={stage}
                        index={index}
                        status={status}
                        image={image}
                        onPlay={() =>
                          status !== "locked" && setActive({ stage, world: theme.id, image })
                        }
                      />
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {active && (
        <StageRunner
          stage={active.stage}
          world={active.world}
          image={active.image}
          alreadyCompleted={(state.adventures[active.world] ?? []).includes(active.stage.id)}
          onClose={() => setActive(null)}
          onWin={() => {
            const alreadyCompleted = (state.adventures[active.world] ?? []).includes(
              active.stage.id,
            );
            if (!alreadyCompleted) {
              const { xp, coins } = rewardsFor(active.stage);
              dispatch({ type: "ADD_XP", amount: xp });
              dispatch({ type: "EARN_COINS", amount: coins });
              dispatch({ type: "ADD_PET_XP", amount: coins });
            }
            dispatch({ type: "COMPLETE_STAGE", world: active.world, stageId: active.stage.id });
          }}
        />
      )}
    </div>
  );
}
