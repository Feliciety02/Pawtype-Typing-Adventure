import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header, type View } from "@/components/Header";
import { Hub } from "@/components/Hub";
import { TypingArena } from "@/components/TypingArena";
import { AdventureMap } from "@/components/AdventureMap";
import { LessonsCard } from "@/components/LessonsCard";
import { Shop } from "@/components/Shop";
import { AchievementsCard } from "@/components/AchievementsCard";
import { StatsView } from "@/components/StatsView";
import { SettingsPage } from "@/components/SettingsPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pawtype — Cozy Pixel Typing Tutor" },
      { name: "description", content: "Master touch typing in a cozy pixel world. Practice with adventure mode, daily quests, a pixel mascot, and beautiful retro stats." },
      { property: "og:title", content: "Pawtype — Cozy Pixel Typing Tutor" },
      { property: "og:description", content: "Master touch typing in a cozy pixel world. Adventure mode, mascot, retro stats." },
    ],
  }),
  component: Index,
});

function Index() {
  const [view, setView] = useState<View>("hub");

  return (
    <main className="min-h-dvh px-4 sm:px-6 lg:px-10 py-6 max-w-[1400px] mx-auto">
      <Header view={view} onViewChange={setView} />

      <div key={view} className="view-enter">
        {view === "hub" && <Hub onViewChange={setView} />}
        {view === "practice" && (
          <section className="mt-8"><TypingArena /></section>
        )}
        {view === "adventure" && (
          <section className="mt-8"><AdventureMap /></section>
        )}
        {view === "lessons" && (
          <section className="mt-8"><LessonsCard /></section>
        )}
        {view === "shop" && (
          <section className="mt-8"><Shop /></section>
        )}
        {view === "achievements" && (
          <section className="mt-8"><AchievementsCard /></section>
        )}
        {view === "stats" && (
          <section className="mt-8"><StatsView /></section>
        )}
        {view === "settings" && (
          <section className="mt-8"><SettingsPage /></section>
        )}
      </div>

      <footer className="mt-16 mb-6 text-center font-pixel text-[0.65rem] text-muted-foreground">
        Made with 🌸 in a cozy pixel cabin · Pawtype v0.1
      </footer>
    </main>
  );
}
