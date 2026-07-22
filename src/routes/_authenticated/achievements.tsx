import { createFileRoute } from "@tanstack/react-router";
import { AchievementsCard } from "@/components/achievements/AchievementsCard";

export const Route = createFileRoute("/_authenticated/achievements")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="awards-section">
      <AchievementsCard />
    </section>
  );
}
