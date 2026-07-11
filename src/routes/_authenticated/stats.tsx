import { createFileRoute } from "@tanstack/react-router";
import { StatsView } from "@/components/game/StatsView";

export const Route = createFileRoute("/_authenticated/stats")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section>
      <StatsView />
    </section>
  );
}
