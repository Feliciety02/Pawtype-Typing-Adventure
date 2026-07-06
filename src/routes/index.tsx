import { lazy, Suspense, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header, type View } from "@/components/layout/Header";
import { useAuth } from "@/hooks/use-auth";

const Hub = lazy(() => import("@/components/hub/Hub").then((m) => ({ default: m.Hub })));
const TypingArena = lazy(() =>
  import("@/components/game/TypingArena").then((m) => ({ default: m.TypingArena })),
);
const AdventureMap = lazy(() =>
  import("@/components/adventure/AdventureMap").then((m) => ({ default: m.AdventureMap })),
);
const LessonsCard = lazy(() =>
  import("@/components/game/LessonsCard").then((m) => ({ default: m.LessonsCard })),
);
const Shop = lazy(() => import("@/components/shop/Shop").then((m) => ({ default: m.Shop })));
const AchievementsCard = lazy(() =>
  import("@/components/game/AchievementsCard").then((m) => ({ default: m.AchievementsCard })),
);
const StatsView = lazy(() =>
  import("@/components/game/StatsView").then((m) => ({ default: m.StatsView })),
);
const SettingsPage = lazy(() =>
  import("@/components/settings/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);
import { PixelLoginScreen } from "@/components/auth/PixelLoginScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pawtype — Cozy Pixel Typing Tutor" },
      {
        name: "description",
        content:
          "Master touch typing in a cozy pixel world. Practice with adventure mode, daily quests, a pixel mascot, and beautiful retro stats.",
      },
      { property: "og:title", content: "Pawtype — Cozy Pixel Typing Tutor" },
      {
        property: "og:description",
        content: "Master touch typing in a cozy pixel world. Adventure mode, mascot, retro stats.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [view, setView] = useState<View>("hub");
  const { user, isDemo, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="min-h-dvh grid place-items-center px-4">
        <div className="pixel-card max-w-sm p-6 text-center">
          <p className="font-pixel text-[0.65rem] text-muted-foreground">Loading save data...</p>
        </div>
      </main>
    );
  }

  if (!user && !isDemo) {
    return <PixelLoginScreen />;
  }

  return (
    <main className="min-h-dvh px-4 sm:px-6 lg:px-10 py-6 max-w-[1400px] mx-auto">
      <Header view={view} onViewChange={setView} />

      <div key={view} className="view-enter">
        <Suspense
          fallback={
            <div className="mt-8 text-center font-pixel text-[0.65rem] text-muted-foreground">
              Loading...
            </div>
          }
        >
          {view === "hub" && <Hub onViewChange={setView} />}
          {view === "practice" && (
            <section className="mt-8">
              <TypingArena />
            </section>
          )}
          {view === "adventure" && (
            <section className="mt-8">
              <AdventureMap />
            </section>
          )}
          {view === "lessons" && (
            <section className="mt-8">
              <LessonsCard />
            </section>
          )}
          {view === "shop" && (
            <section className="mt-8">
              <Shop />
            </section>
          )}
          {view === "achievements" && (
            <section className="mt-8">
              <AchievementsCard />
            </section>
          )}
          {view === "stats" && (
            <section className="mt-8">
              <StatsView />
            </section>
          )}
          {view === "settings" && (
            <section className="mt-8">
              <SettingsPage />
            </section>
          )}
        </Suspense>
      </div>

      <footer className="mt-16 mb-6 text-center font-pixel text-[0.65rem] text-muted-foreground">
        Made with <img src="/icons/cherry-blossom.png" alt="" className="pixel-icon" /> in a cozy
        pixel cabin · Pawtype v0.1
      </footer>
    </main>
  );
}
