import { createFileRoute } from "@tanstack/react-router";
import KeyboardWorkshopPage from "@/features/keyboard-workshop/page";

export const Route = createFileRoute("/_authenticated/workshop")({
  component: KeyboardWorkshopPage,
});
