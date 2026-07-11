import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import {
  type GameState,
  type TypingSession,
  type PetState,
  type PetType,
  DEFAULT_GAME_STATE,
  DEFAULT_STARTER_PET,
  MAX_SESSIONS,
  xpForLevel,
  petXpForLevel,
  getDailyReward,
} from "./types";
import { persistence } from "./persistence";
import { useAuth } from "@/hooks/use-auth";
import { saveGameState, loadGameState } from "@/lib/supabase/game";
import {
  type LessonProgress,
  type QuestState,
  freshLessonProgress,
  starsForAccuracy,
  lessonReward,
  isQuestComplete,
  initialQuestStates,
  QUEST_DEFS,
} from "./domain";

export type GameAction =
  | { type: "EARN_COINS"; amount: number }
  | { type: "SPEND_COINS"; amount: number }
  | { type: "ADD_XP"; amount: number }
  | { type: "CLAIM_DAILY_REWARD" }
  | { type: "COMPLETE_STAGE"; world: string; stageId: number }
  | { type: "ADOPT_PET"; pet: PetState }
  | { type: "SET_ACTIVE_PET"; petType: PetType | null }
  | { type: "ADD_ITEM"; itemId: string }
  | { type: "REMOVE_ITEM"; itemId: string }
  | { type: "ADD_PET_XP"; amount: number }
  | { type: "LOG_TYPING_TEST"; correctChars: number; mistakes: number }
  | { type: "LOG_TYPING_SESSION"; session: TypingSession }
  | { type: "LOAD_FROM_CLOUD"; state: GameState }
  | { type: "LOG_LESSON_RESULT"; lessonId: string; wpm: number; accuracy: number; reward: { xp: number; coins: number; petExp: number } }
  | { type: "CLAIM_QUEST"; questId: string }
  | { type: "RECOMPUTE_QUESTS" }
  | { type: "RESET" };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "EARN_COINS":
      return recomputeQuests({
        ...state,
        player: { ...state.player, coins: state.player.coins + action.amount },
        totalCoinsEarned: state.totalCoinsEarned + action.amount,
      });

    case "SPEND_COINS": {
      const cost = Math.min(action.amount, state.player.coins);
      return {
        ...state,
        player: { ...state.player, coins: state.player.coins - cost },
      };
    }

    case "ADD_XP": {
      let { xp, level } = state.player;
      xp += action.amount;
      let needed = xpForLevel(level);
      while (xp >= needed) {
        xp -= needed;
        level++;
        needed = xpForLevel(level);
      }
      return recomputeQuests({
        ...state,
        player: { ...state.player, xp, level },
      });
    }

    case "CLAIM_DAILY_REWARD": {
      const today = new Date().toISOString().slice(0, 10);
      const lastDate = state.player.lastLoginDate;
      let newStreak = state.player.streak;

      if (lastDate !== today) {
        if (lastDate === null) {
          newStreak = 1;
        } else {
          const y = yesterday(today);
          newStreak = lastDate === y ? state.player.streak + 1 : 1;
        }
      }

      const reward = getDailyReward(newStreak);

      let next: GameState = {
        ...state,
        player: {
          ...state.player,
          coins: state.player.coins + reward.coins,
          streak: newStreak,
          lastLoginDate: today,
          dailyRewardClaimed: true,
        },
        totalCoinsEarned: state.totalCoinsEarned + reward.coins,
      };

      if (reward.item) {
        next.inventory = {
          ...next.inventory,
          items: [...next.inventory.items, reward.item],
        };
      }

      return recomputeQuests(next);
    }

    case "COMPLETE_STAGE": {
      const { world, stageId } = action;
      const completed = state.adventures[world] ?? [];
      if (completed.includes(stageId)) return state;
      return {
        ...state,
        adventures: {
          ...state.adventures,
          [world]: [...completed, stageId],
        },
      };
    }

    case "ADOPT_PET": {
      if (state.inventory.pets.some((p) => p.type === action.pet.type)) {
        return state;
      }
      return {
        ...state,
        inventory: {
          ...state.inventory,
          pets: [...state.inventory.pets, action.pet],
          activePet: action.pet.type,
        },
      };
    }

    case "SET_ACTIVE_PET":
      return {
        ...state,
        inventory: { ...state.inventory, activePet: action.petType },
      };

    case "ADD_ITEM": {
      if (state.inventory.items.includes(action.itemId)) return state;
      return {
        ...state,
        inventory: {
          ...state.inventory,
          items: [...state.inventory.items, action.itemId],
        },
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        inventory: {
          ...state.inventory,
          items: state.inventory.items.filter((i) => i !== action.itemId),
        },
      };

    case "ADD_PET_XP": {
      if (!state.inventory.activePet) return state;
      const pets = state.inventory.pets.map((p) => {
        if (p.type !== state.inventory.activePet) return p;
        let { xp, level } = p;
        xp += action.amount;
        let needed = petXpForLevel(level);
        while (xp >= needed) {
          xp -= needed;
          level++;
          needed = petXpForLevel(level);
        }
        return { ...p, xp, level };
      });
      return { ...state, inventory: { ...state.inventory, pets } };
    }

    case "LOG_TYPING_TEST":
      return {
        ...state,
        player: {
          ...state.player,
          totalTestsCompleted: state.player.totalTestsCompleted + 1,
          totalCorrectChars: state.player.totalCorrectChars + action.correctChars,
          totalMistakes: state.player.totalMistakes + action.mistakes,
        },
      };

    case "LOG_TYPING_SESSION": {
      const next = [action.session, ...state.sessions];
      return {
        ...state,
        sessions: next.slice(0, MAX_SESSIONS),
      };
    }

    case "LOG_LESSON_RESULT": {
      const { lessonId, wpm, accuracy, reward: actionReward } = action;
      const prev = state.lessonProgress[lessonId] ?? freshLessonProgress();
      const stars = starsForAccuracy(accuracy, 90);
      const newProgress: LessonProgress = {
        completed: true,
        bestWpm: Math.max(prev.bestWpm, wpm),
        bestAccuracy: Math.max(prev.bestAccuracy, accuracy),
        bestStars: Math.max(prev.bestStars, stars),
        attemptCount: prev.attemptCount + 1,
        lastAttemptedAt: Date.now(),
      };
      return recomputeQuests({
        ...state,
        lessonProgress: { ...state.lessonProgress, [lessonId]: newProgress },
        player: {
          ...state.player,
          coins: state.player.coins + actionReward.coins,
          totalTestsCompleted: state.player.totalTestsCompleted + 1,
          totalCorrectChars: state.player.totalCorrectChars,
          totalMistakes: state.player.totalMistakes,
        },
        totalCoinsEarned: state.totalCoinsEarned + actionReward.coins,
      });
    }

    case "CLAIM_QUEST": {
      const claimed = state.quests.map((q) =>
        q.questId === action.questId && q.status === "completed"
          ? { ...q, status: "claimed" as const, claimedAt: Date.now() }
          : q,
      );
      const def = QUEST_DEFS.find((d) => d.id === action.questId);
      const r = def?.reward;
      return {
        ...state,
        quests: claimed,
        player: {
          ...state.player,
          coins: state.player.coins + (r?.coins ?? 0),
        },
        totalCoinsEarned: state.totalCoinsEarned + (r?.coins ?? 0),
        inventory: r?.items
          ? {
              ...state.inventory,
              items: [...state.inventory.items, ...r.items.filter((i) => !state.inventory.items.includes(i))],
            }
          : state.inventory,
      };
    }

    case "RECOMPUTE_QUESTS":
      return recomputeQuests(state);

    case "LOAD_FROM_CLOUD":
      return {
        ...action.state,
        quests:
          action.state.quests.length > 0 ? action.state.quests : state.quests,
      };

    case "RESET":
      return DEFAULT_GAME_STATE;

    default:
      return state;
  }
}

function recomputeQuests(state: GameState): GameState {
  const completedLessonCount = Object.values(state.lessonProgress).filter((lp) => lp.completed).length;
  const bestWpm = Object.values(state.lessonProgress).reduce((max, lp) => Math.max(max, lp.bestWpm), 0);
  const bestAccuracy = Object.values(state.lessonProgress).reduce((max, lp) => Math.max(max, lp.bestAccuracy), 0);

  const updatedQuests: QuestState[] = state.quests.map((qs) => {
    if (qs.status === "claimed") return qs;
    const def = QUEST_DEFS.find((d) => d.id === qs.questId);
    if (!def) return qs;

    const updatedConditions = def.conditions.map((c) => {
      let current = c.current;
      switch (c.type) {
        case "complete_lessons": current = completedLessonCount; break;
        case "reach_level": current = state.player.level; break;
        case "earn_coins": current = state.totalCoinsEarned; break;
        case "maintain_streak": current = state.player.streak; break;
        case "reach_wpm": current = bestWpm; break;
        case "reach_accuracy": current = bestAccuracy; break;
      }
      return { ...c, current };
    });

    const allMet = updatedConditions.every((c) => c.current >= c.target);
    const newStatus: "active" | "completed" | "claimed" =
      allMet && qs.status === "active" ? "completed" : qs.status;
    const completedAt = allMet && qs.status === "active" ? Date.now() : qs.completedAt;

    return { ...qs, conditions: updatedConditions, status: newStatus, completedAt };
  });

  return { ...state, quests: updatedQuests };
}

function yesterday(isoToday: string): string {
  const d = new Date(isoToday);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function initializeGame(): GameState {
  const saved = persistence.load();
  if (!saved) return DEFAULT_GAME_STATE;
  const savedInventory = { ...DEFAULT_GAME_STATE.inventory, ...(saved.inventory ?? {}) };
  const hasPets = savedInventory.pets.length > 0;
  const inventory = hasPets
    ? {
        ...savedInventory,
        activePet:
          savedInventory.activePet ?? savedInventory.pets[0]?.type ?? DEFAULT_STARTER_PET.type,
      }
    : {
        ...savedInventory,
        pets: [DEFAULT_STARTER_PET],
        activePet: DEFAULT_STARTER_PET.type,
      };

  const merged: GameState = {
    ...DEFAULT_GAME_STATE,
    ...saved,
    player: { ...DEFAULT_GAME_STATE.player, ...(saved.player ?? {}) },
    inventory,
    adventures: { ...DEFAULT_GAME_STATE.adventures, ...(saved.adventures ?? {}) },
    quests: Array.isArray(saved?.quests) && saved.quests.length > 0 ? saved.quests : initialQuestStates(),
  };

  return recomputeQuests(merged);
}

type GameCtx = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

const GameCtx = createContext<GameCtx>({
  state: DEFAULT_GAME_STATE,
  dispatch: () => {},
});

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, rawDispatch] = useReducer(gameReducer, null, initializeGame);
  const { user, isLoading } = useAuth();
  const loadedCloudUserId = useRef<string | null>(null);
  const resetFlagRef = useRef(false);

  const dispatch = useCallback((action: GameAction) => {
    if (action.type === "RESET") resetFlagRef.current = true;
    rawDispatch(action);
  }, []);

  useEffect(() => {
    if (resetFlagRef.current) {
      resetFlagRef.current = false;
      persistence.clear();
    } else {
      persistence.save(state);
    }
  }, [state]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      loadedCloudUserId.current = null;
      return;
    }
    if (loadedCloudUserId.current === user.id) return;
    loadedCloudUserId.current = user.id;
    loadGameState().then((raw) => {
      const cloud = raw as Record<string, unknown> | undefined;
      if (!cloud) return;
      if (!cloud.player || !cloud.inventory) return;
      const cloudSessions = (cloud.sessions as TypingSession[] | undefined) ?? [];
      const cloudLessonProgress = cloud.lessonProgress as Record<string, LessonProgress> | undefined;
      const cloudQuests = cloud.quests as QuestState[] | undefined;
      const merged: GameState = {
        player: { ...state.player, ...(cloud.player as Partial<typeof state.player>) },
        inventory: { ...state.inventory, ...(cloud.inventory as Partial<typeof state.inventory>) },
        adventures: { ...state.adventures, ...(cloud.adventures as Record<string, number[]>) },
        sessions: cloudSessions.length > 0 ? cloudSessions : state.sessions,
        lessonProgress: cloudLessonProgress ? { ...state.lessonProgress, ...cloudLessonProgress } : state.lessonProgress,
        quests: cloudQuests && cloudQuests.length > 0 ? cloudQuests : state.quests,
        totalCoinsEarned: (cloud.totalCoinsEarned as number | undefined) ?? state.totalCoinsEarned,
      };
      dispatch({ type: "LOAD_FROM_CLOUD", state: merged });
    });
  }, [user, isLoading]);

  const syncTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!user) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      try {
        const data = {
          player: { ...state.player } as Record<string, unknown>,
          inventory: { ...state.inventory } as Record<string, unknown>,
          adventures: state.adventures as Record<string, unknown>,
          sessions: state.sessions as Record<string, unknown>[],
          lessonProgress: state.lessonProgress as Record<string, unknown>,
          quests: state.quests as unknown as Record<string, unknown>[],
          totalCoinsEarned: state.totalCoinsEarned,
        };
        await saveGameState({ data });
      } catch {
        console.warn("Cloud save failed");
      }
    }, 2000);
    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [state, user]);

  return <GameCtx.Provider value={{ state, dispatch }}>{children}</GameCtx.Provider>;
}

export function useGame() {
  return useContext(GameCtx);
}
