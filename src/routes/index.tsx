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
  const isCampView = view === "hub";
  const isAwardsView = view === "achievements";

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
    <main
      className={`app-shell ${isCampView ? "app-shell--camp" : ""} ${isAwardsView ? "app-shell--awards" : ""}`}
    >
      <Header view={view} onViewChange={setView} />

      <div
        key={view}
        className={`app-view-shell ${isCampView ? "app-view-shell--camp" : ""} ${isAwardsView ? "app-view-shell--awards" : ""} view-enter`}
      >
        <Suspense
          fallback={
            <div className="text-center font-pixel text-[0.65rem] text-muted-foreground">
              Loading...
            </div>
          }
        >
          {view === "hub" && <Hub onViewChange={setView} />}
          {view === "practice" && (
            <section>
              <TypingArena />
            </section>
          )}
          {view === "adventure" && (
            <section>
              <AdventureMap />
            </section>
          )}
          {view === "lessons" && (
            <section>
              <LessonsCard />
            </section>
          )}
          {view === "shop" && (
            <section>
              <Shop />
            </section>
          )}
          {view === "achievements" && (
            <section className="awards-section">
              <AchievementsCard />
            </section>
          )}
          {view === "stats" && (
            <section>
              <StatsView />
            </section>
          )}
          {view === "settings" && (
            <section>
              <SettingsPage />
            </section>
          )}
        </Suspense>
      </div>

    </main>
  );
}
