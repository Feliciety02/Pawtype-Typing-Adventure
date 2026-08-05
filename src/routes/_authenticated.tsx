import { Suspense } from "react";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/hooks/use-auth";
import { PixelLoginScreen } from "@/components/login/PixelLoginScreen";

export const Route = createFileRoute("/_authenticated")({
  component: AuthLayout,
});

function AuthLayout() {
  const { user, isDemo, isLoading } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;
  const isCampView = pathname === "/";
  const isAwardsView = pathname === "/achievements";
  const isPracticeView = pathname === "/practice";
  const isAdventureView = pathname === "/adventure";
  const isShopView = pathname === "/shop";
  const isLessonsView = pathname === "/lessons";
  const isWorkshopView = pathname === "/workshop";

  if (isLoading) {
    return (
      <main className="min-h-dvh grid place-items-center px-4">
        <AppLoadingFallback message="Loading save data" framed />
      </main>
    );
  }

  if (!user && !isDemo) {
    return <PixelLoginScreen />;
  }

  return (
    <main
      className={`app-shell ${isCampView ? "app-shell--camp" : ""} ${isAwardsView ? "app-shell--awards" : ""} ${isPracticeView ? "app-shell--practice" : ""} ${isAdventureView ? "app-shell--adventure" : ""} ${isShopView ? "app-shell--shop" : ""} ${isLessonsView ? "app-shell--lessons" : ""} ${isWorkshopView ? "app-shell--workshop" : ""}`}
    >
      <Header />

      <div
        key={pathname}
        className={`app-view-shell ${isCampView ? "app-view-shell--camp" : ""} ${isAwardsView ? "app-view-shell--awards" : ""} view-enter ${!isCampView && !isAwardsView ? "view-stagger" : ""}`}
      >
        <Suspense fallback={<AppLoadingFallback message="Loading adventure" />}>
          <Outlet />
        </Suspense>
      </div>
    </main>
  );
}

function AppLoadingFallback({ message, framed = false }: { message: string; framed?: boolean }) {
  return (
    <div
      className={`app-loading${framed ? " pixel-card app-loading--framed" : ""}`}
      role="status"
      aria-live="polite"
    >
      <span className="app-loading__mark" aria-hidden="true">
        🐾
      </span>
      <p>{message}</p>
      <span className="app-loading__dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}
