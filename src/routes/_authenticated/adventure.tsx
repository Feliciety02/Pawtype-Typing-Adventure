import { createFileRoute } from "@tanstack/react-router";
import { AdventureMap } from "@/components/adventure/AdventureMap";

export const Route = createFileRoute("/_authenticated/adventure")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section>
      <AdventureMap />
    </section>
  );
}
