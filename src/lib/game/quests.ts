import { useGame } from "./store";
import { QUEST_DEFS, type QuestState } from "./domain";

export type { QuestDef, QuestState, QuestStatus, QuestCondition } from "./domain";
export { QUEST_DEFS, isQuestComplete, initialQuestStates } from "./domain";

export function useQuests() {
  const { state } = useGame();

  return state.quests.map((qs) => {
    const def = QUEST_DEFS.find((d) => d.id === qs.questId);
    if (!def) return null;

    const allMet = qs.conditions.every((c) => c.current >= c.target);
    const progressPct = qs.conditions.length > 0
      ? Math.round(
          (qs.conditions.reduce((s, c) => s + Math.min(c.current / c.target, 1), 0) /
            qs.conditions.length) *
            100,
        )
      : 0;

    return {
      id: qs.questId,
      icon: def.emoji,
      title: def.title,
      description: def.description,
      value: qs.conditions.map((c) => `${c.current}/${c.target}`).join(", "),
      bar: progressPct,
      color: allMet ? "var(--leaf)" : "var(--color-primary)",
      status: qs.status,
      reward: def.reward,
      conditions: qs.conditions,
    };
  }).filter(Boolean) as Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
    value: string;
    bar: number;
    color: string;
    status: string;
    reward: { coins: number; xp: number; petExp: number };
    conditions: Array<{ label: string; current: number; target: number }>;
  }>;
}

export function useActiveQuests() {
  const { state, dispatch } = useGame();
  const active = state.quests.filter((q) => q.status === "active" || q.status === "completed");
  return { quests: active, claimQuest: (id: string) => dispatch({ type: "CLAIM_QUEST", questId: id }) };
}
