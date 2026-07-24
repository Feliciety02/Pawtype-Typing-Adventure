import { createFileRoute } from "@tanstack/react-router";
import { TypingArena } from "@/components/game/TypingArena";

export const Route = createFileRoute("/_authenticated/practice")({
  component: RouteComponent,
});

function RouteComponent() {
  const drill =
    typeof window === "undefined" ? null : window.sessionStorage.getItem("pawtype-weak-key-drill");
  const parsed = drill ? (JSON.parse(drill) as { title: string; words: string[] }) : null;
  return (
    <section>
      <TypingArena customWords={parsed?.words} customTitle={parsed?.title} />
    </section>
  );
}
