import { createFileRoute } from "@tanstack/react-router";
import { LessonsCard } from "@/components/lessons/LessonsCard";

export const Route = createFileRoute("/_authenticated/lessons")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section>
      <LessonsCard />
    </section>
  );
}
