import { lazy, Suspense } from "react";
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
      <Header />

      <div
        className={`app-view-shell ${isCampView ? "app-view-shell--camp" : ""} ${isAwardsView ? "app-view-shell--awards" : ""} view-enter`}
      >
        <Suspense
          fallback={
            <div className="text-center font-pixel text-[0.65rem] text-muted-foreground">
              Loading...
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </main>
  );
}
