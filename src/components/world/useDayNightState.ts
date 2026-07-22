import { useEffect, useState } from "react";
import { getDayNightState, type DayNightState } from "./DayNightController";

export function useDayNightState(): DayNightState {
  const [state, setState] = useState(() => getDayNightState());

  useEffect(() => {
    let timeoutId = 0;

    const scheduleNextMinute = () => {
      const now = new Date();
      const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

      timeoutId = window.setTimeout(
        () => {
          setState(getDayNightState());
          scheduleNextMinute();
        },
        Math.max(250, msUntilNextMinute),
      );
    };

    scheduleNextMinute();
    return () => window.clearTimeout(timeoutId);
  }, []);

  return state;
}
