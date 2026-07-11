import { createFileRoute } from "@tanstack/react-router";
import { TypingArena } from "@/components/game/TypingArena";

export const Route = createFileRoute("/_authenticated/practice")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section>
      <TypingArena />
    </section>
  );
}
