import { createFileRoute } from "@tanstack/react-router";
import { Shop } from "@/components/shop/Shop";

export const Route = createFileRoute("/_authenticated/shop")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section>
      <Shop />
    </section>
  );
}
