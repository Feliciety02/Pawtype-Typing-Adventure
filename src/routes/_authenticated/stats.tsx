import { createFileRoute } from "@tanstack/react-router";
import { StatsView } from "@/components/stats/StatsView";

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
