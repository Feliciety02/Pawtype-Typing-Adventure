import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";
import {
  type GameState,
  type PetState,
  type PetType,
  DEFAULT_GAME_STATE,
  xpForLevel,
  petXpForLevel,
  getDailyReward,
} from "./types";
import { persistence } from "./persistence";

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
  | { type: "RESET" };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "EARN_COINS":
      return {
        ...state,
        player: { ...state.player, coins: state.player.coins + action.amount },
      };

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
      return {
        ...state,
        player: { ...state.player, xp, level },
      };
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

      const next: GameState = {
        ...state,
        player: {
          ...state.player,
          coins: state.player.coins + reward.coins,
          streak: newStreak,
          lastLoginDate: today,
          dailyRewardClaimed: true,
        },
      };

      if (reward.item) {
        next.inventory = {
          ...next.inventory,
          items: [...next.inventory.items, reward.item],
        };
      }

      return next;
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

    case "RESET":
      persistence.clear();
      return DEFAULT_GAME_STATE;

    default:
      return state;
  }
}

function yesterday(isoToday: string): string {
  const d = new Date(isoToday);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function initializeGame(): GameState {
  const saved = persistence.load();
  if (!saved) return DEFAULT_GAME_STATE;
  return {
    ...DEFAULT_GAME_STATE,
    ...saved,
    player: { ...DEFAULT_GAME_STATE.player, ...(saved.player ?? {}) },
    inventory: { ...DEFAULT_GAME_STATE.inventory, ...(saved.inventory ?? {}) },
    adventures: { ...DEFAULT_GAME_STATE.adventures, ...(saved.adventures ?? {}) },
  };
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
  const [state, dispatch] = useReducer(gameReducer, null, initializeGame);

  useEffect(() => {
    persistence.save(state);
  }, [state]);

  return <GameCtx.Provider value={{ state, dispatch }}>{children}</GameCtx.Provider>;
}

export function useGame() {
  return useContext(GameCtx);
}
