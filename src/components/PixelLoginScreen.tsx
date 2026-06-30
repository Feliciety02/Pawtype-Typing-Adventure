import { useState } from "react";
import { LoaderCircle } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useGame } from "@/lib/game/store";
import { buildDemoGameState } from "@/lib/game/demo";

const FEATURE_CARDS = [
  { label: "Cloud Save", value: "ON", tone: "mint" },
  { label: "Pixel Worlds", value: "12", tone: "gold" },
  { label: "Pet Companions", value: "7", tone: "pink" },
];

export function PixelLoginScreen() {
  const { dispatch } = useGame();
  const {
    login,
    signUp,
    loginWithProvider,
    enterDemo,
    isLoggingIn,
    isSigningUp,
    isSocialLoading,
  } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isBusy = isLoggingIn || isSigningUp || isSocialLoading;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      if (mode === "login") {
        await login({ email, password });
      } else {
        await signUp({ email, password });
        setMode("login");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to enter Pawtype.");
    }
  };

  const handleProvider = async (provider: "google" | "facebook") => {
    setError(null);
    try {
      await loginWithProvider(provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : "OAuth sign-in failed.");
    }
  };

  const handleDemo = () => {
    dispatch({ type: "LOAD_FROM_CLOUD", state: buildDemoGameState() });
    enterDemo();
  };

  return (
    <section className="pixel-login-shell">
      <div className="pixel-login-backdrop" aria-hidden="true">
        <span className="pixel-login-cloud pixel-login-cloud-left" />
        <span className="pixel-login-cloud pixel-login-cloud-right" />
        <span className="pixel-login-sun" />
        <span className="pixel-login-hill pixel-login-hill-far" />
        <span className="pixel-login-hill pixel-login-hill-near" />
      </div>

      <div className="pixel-login-layout">
        <div className="pixel-login-hero">
          <span className="pixel-login-badge">Press Start To Type</span>
          <h1>Pawtype</h1>
          <p>
            A cozy pixel typing world with quests, pets, and cloud-synced progress.
          </p>
          <div className="pixel-login-feature-grid">
            {FEATURE_CARDS.map((card) => (
              <div key={card.label} className={`pixel-login-feature is-${card.tone}`}>
                <strong>{card.value}</strong>
                <span>{card.label}</span>
              </div>
            ))}
          </div>
          <div className="pixel-login-marquee">
            <span>Daily quests</span>
            <span>Adventure maps</span>
            <span>Boss practice</span>
            <span>Retro stats</span>
          </div>
        </div>

        <div className="pixel-login-panel">
          <div className="pixel-login-panel-head">
            <img src="/Logo.png" alt="Pawtype" className="pixel-login-logo" />
            <div>
              <p className="pixel-login-kicker">Main Gate</p>
              <h2>{mode === "login" ? "Load Save File" : "Create Save File"}</h2>
            </div>
          </div>

          <div className="pixel-auth-tabs">
            <button
              className={mode === "login" ? "is-active" : ""}
              onClick={() => setMode("login")}
              type="button"
            >
              Log In
            </button>
            <button
              className={mode === "signup" ? "is-active" : ""}
              onClick={() => setMode("signup")}
              type="button"
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="pixel-auth-form">
            <label>
              <span>Email</span>
              <input
                type="email"
                placeholder="player@pawtype.gg"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
              />
            </label>

            {error ? <p className="pixel-auth-error">{error}</p> : null}

            <button className="pixel-btn text-[0.62rem]" disabled={isBusy} type="submit">
              {isBusy ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="size-3 animate-spin" />
                  Opening Gate...
                </span>
              ) : mode === "login" ? "Enter Game" : "Create Account"}
            </button>
          </form>

          <div className="pixel-auth-divider">
            <span>or continue with</span>
          </div>

          <div className="pixel-auth-provider-grid">
            <button
              className="pixel-auth-provider"
              disabled={isBusy}
              onClick={() => handleProvider("google")}
              type="button"
            >
              <span className="pixel-auth-provider-mark is-google">G</span>
              Google
            </button>
            <button
              className="pixel-auth-provider"
              disabled={isBusy}
              onClick={() => handleProvider("facebook")}
              type="button"
            >
              <span className="pixel-auth-provider-mark is-facebook">f</span>
              Facebook
            </button>
          </div>

          <button
            className="pixel-btn pixel-btn-secondary text-[0.58rem]"
            disabled={isBusy}
            onClick={handleDemo}
            type="button"
          >
            Play Demo Account
          </button>

          <p className="pixel-login-footnote">
            Demo mode opens the game instantly with local progress only. Google and
            Facebook require those Supabase providers to be enabled.
          </p>
        </div>
      </div>
    </section>
  );
}
