// Daily lesson goal + streak counter (localStorage only).
// Tracks how many lessons the user has completed today toward a configurable goal.

const KEY = "pawtype-daily-goal";
const DEFAULT_GOAL = 3;

export type DailyStore = {
  date: string; // YYYY-MM-DD
  count: number;
  goal: number;
  streak: number; // consecutive days meeting the goal
  lastMetDate: string | null;
  rewardClaimed: boolean;
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterday(d: string) {
  const dt = new Date(d);
  dt.setDate(dt.getDate() - 1);
  return dt.toISOString().slice(0, 10);
}

function read(): DailyStore {
  if (typeof window === "undefined") {
    return {
      date: today(),
      count: 0,
      goal: DEFAULT_GOAL,
      streak: 0,
      lastMetDate: null,
      rewardClaimed: false,
    };
  }
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DailyStore>;
      return {
        date: parsed.date ?? today(),
        count: parsed.count ?? 0,
        goal: parsed.goal ?? DEFAULT_GOAL,
        streak: parsed.streak ?? 0,
        lastMetDate: parsed.lastMetDate ?? null,
        rewardClaimed: parsed.rewardClaimed ?? false,
      };
    }
  } catch {
    /* ignore */
  }
  return {
    date: today(),
    count: 0,
    goal: DEFAULT_GOAL,
    streak: 0,
    lastMetDate: null,
    rewardClaimed: false,
  };
}

function write(store: DailyStore) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
    window.dispatchEvent(new Event("pawtype-daily-goal-changed"));
  } catch {
    /* ignore */
  }
}

// Roll the counter forward to today; adjust the streak if a day was missed.
function rollToToday(store: DailyStore): DailyStore {
  const t = today();
  if (store.date === t) return store;
  // If we missed a day (lastMetDate is not yesterday and not today), reset streak
  if (store.lastMetDate && store.lastMetDate !== yesterday(t) && store.lastMetDate !== t) {
    return { ...store, date: t, count: 0, streak: 0, rewardClaimed: false };
  }
  return { ...store, date: t, count: 0, rewardClaimed: false };
}

export function getDailyGoal() {
  return rollToToday(read());
}

export function setDailyGoalTarget(goal: number) {
  const store = rollToToday(read());
  write({ ...store, goal: Math.max(1, Math.min(20, Math.round(goal))) });
}

// Call whenever a *new* lesson is completed (not repeats). Returns updated store.
export function tickDailyGoal(): DailyStore {
  const rolled = rollToToday(read());
  const nextCount = rolled.count + 1;
  const t = today();
  const justMetGoal = rolled.count < rolled.goal && nextCount >= rolled.goal;
  const nextStreak = justMetGoal
    ? rolled.lastMetDate === yesterday(t)
      ? rolled.streak + 1
      : Math.max(1, rolled.streak || 1)
    : rolled.streak;
  const next: DailyStore = {
    ...rolled,
    count: nextCount,
    streak: nextStreak,
    lastMetDate: justMetGoal ? t : rolled.lastMetDate,
  };
  write(next);
  return next;
}

export function claimDailyGoalReward(): DailyStore | null {
  const store = rollToToday(read());
  if (store.count < store.goal || store.rewardClaimed) return null;
  const next = { ...store, rewardClaimed: true };
  write(next);
  return next;
}

export function subscribeDailyGoal(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("pawtype-daily-goal-changed", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("pawtype-daily-goal-changed", cb);
    window.removeEventListener("storage", cb);
  };
}
