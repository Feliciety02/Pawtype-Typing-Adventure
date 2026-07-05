export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const h = date.getHours();
  if (h >= 5 && h < 11) return "morning";
  if (h >= 11 && h < 17) return "afternoon";
  if (h >= 17 && h < 20) return "evening";
  return "night";
}

// Semi-transparent gradient overlay per time-of-day. Applied on top of scene.
export const TIME_OVERLAY: Record<TimeOfDay, string> = {
  morning: "linear-gradient(180deg, rgba(255,220,160,0.18) 0%, rgba(255,240,200,0.05) 60%, transparent 100%)",
  afternoon: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)",
  evening: "linear-gradient(180deg, rgba(255,140,80,0.22) 0%, rgba(200,90,120,0.10) 60%, transparent 100%)",
  night: "linear-gradient(180deg, rgba(20,20,60,0.55) 0%, rgba(20,20,80,0.35) 60%, rgba(10,10,40,0.25) 100%)",
};

export const TIME_LABEL: Record<TimeOfDay, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};
