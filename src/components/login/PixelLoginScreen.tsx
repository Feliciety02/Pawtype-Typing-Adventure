import { useState, type CSSProperties } from "react";
import { LoaderCircle, Play } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { buildDemoGameState } from "@/lib/game/demo";
import { PixelIcon } from "@/lib/icons/PixelIcon";
import { useGame } from "@/lib/game/store";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, passwordHint } from "@/lib/auth/shared";
import loginBackground from "./loginpage_background.png";

const fallingLeaves = [
  [8, 13, 0, 10.8, 40, 390, 2, 0.82],
  [16, 9, 0.8, 12.4, -34, 430, 0, 1.05],
  [25, 17, 1.6, 11.6, 50, 370, 1, 0.9],
  [32, 8, 2.4, 13.1, -42, 450, 3, 1.15],
  [13, 25, 3.2, 10.2, 36, 405, 0, 0.96],
  [39, 7, 4, 12.8, -28, 420, 2, 0.93],
  [46, 11, 4.8, 11.1, 34, 395, 1, 0.8],
  [53, 6, 5.6, 13.6, -38, 440, 3, 1.06],
  [20, 6, 6.4, 10.6, 26, 380, 1, 0.88],
  [35, 20, 7.2, 12.1, -47, 425, 2, 1],
  [5, 18, 8, 11.4, 31, 400, 3, 0.84],
  [50, 15, 8.8, 13.3, -30, 445, 0, 0.98],
  [29, 5, 9.6, 10.9, 45, 390, 2, 0.9],
  [42, 18, 10.4, 12.6, -35, 430, 1, 1.08],
] as const;

function FallingLeaves({ layer }: { layer: "behind" | "front" }) {
  return (
    <div className={`pixel-login-falling-leaves is-${layer}`} aria-hidden="true">
      {fallingLeaves.map(([left, top, delay, duration, drift, distance, turn, size], index) => {
        if ((index % 2 === 0 ? "behind" : "front") !== layer) return null;

        return (
          <img
            key={index}
            className="pixel-login-leaf"
            src={`/shared/icons/login-leaves/leaf-${String((index % 6) + 1).padStart(2, "0")}.png`}
            alt=""
            style={{
              "--leaf-left": `${left}%`,
              "--leaf-top": `${top}%`,
              "--leaf-delay": `${delay}s`,
              "--leaf-duration": `${duration}s`,
              "--leaf-drift": `${drift}px`,
              "--leaf-distance": `${distance}px`,
              "--leaf-turn": `${turn}`,
              "--leaf-size": `${size}`,
            } as CSSProperties}
          />
        );
      })}
    </div>
  );
}

export function PixelLoginScreen() {
  const { dispatch } = useGame();
  const { login, signUp, loginWithProvider, enterDemo, isLoggingIn, isSigningUp, isSocialLoading } =
    useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const isBusy = isLoggingIn || isSigningUp || isSocialLoading;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      if (mode === "login") {
        await login({ email, password });
      } else {
        await signUp({ email, password });
        setMode("login");
        setConfirmPassword("");
      }
    } catch (err) {
      setError(getAuthErrorMessage(err, "Unable to enter Pawtype."));
    }
  };

  const handleProvider = async (provider: "google" | "facebook") => {
    setError(null);
    try {
      await loginWithProvider(provider);
    } catch (err) {
      setError(getAuthErrorMessage(err, "OAuth sign-in failed."));
    }
  };

  const handleDemo = () => {
    dispatch({ type: "LOAD_FROM_CLOUD", state: buildDemoGameState() });
    enterDemo();
  };

  return (
    <section
      className={`pixel-login-shell ${isAuthOpen ? "is-auth-open" : ""}`}
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <FallingLeaves layer="behind" />
      <div className="pixel-login-title-screen">
        <img src="/shared/brand/combined-logo.webp" alt="PawType" className="pixel-login-combined-logo" />
        <button className="pixel-login-play-btn" type="button" onClick={() => setIsAuthOpen(true)}>
          <Play aria-hidden="true" fill="currentColor" size={17} />
          Play
        </button>
      </div>
      <FallingLeaves layer="front" />
      <div className="pixel-login-backdrop" aria-hidden="true">
        <span className="pixel-login-cloud pixel-login-cloud-left" />
        <span className="pixel-login-cloud pixel-login-cloud-right" />
        <span className="pixel-login-sun" />
        <span className="pixel-login-mountains pixel-login-mountains-far" />
        <span className="pixel-login-mountains pixel-login-mountains-near" />
        <span className="pixel-login-hill pixel-login-hill-far" />
        <span className="pixel-login-hill pixel-login-hill-near" />
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={`twinkle-${i}`}
            className="pixel-login-twinkle"
            style={{
              left: `${(i * 83) % 100}%`,
              top: `${(i * 37) % 60}%`,
              animationDelay: `${(i * 0.35) % 2.5}s`,
            }}
          />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <span
            key={`leaf-${i}`}
            className="pixel-login-leaf"
            style={{
              left: `${8 + ((i * 17) % 84)}%`,
              animationDelay: `${i * 0.85}s`,
              animationDuration: `${8 + (i % 3) * 1.4}s`,
            }}
          />
        ))}
      </div>

      <div className="pixel-login-layout" onClick={() => !isBusy && setIsAuthOpen(false)}>
        {/* Left — Hero */}
        <div className="pixel-login-hero">
          <span className="pixel-login-badge">Press Start to Type</span>
          <div className="pixel-login-title-row">
            <img src="/shared/brand/emblem-logo.webp" alt="" className="pixel-login-logo-mark" />
            <h1 className="pixel-login-wordmark">PawType</h1>
          </div>
          <p className="pixel-login-subtitle">Every Keystroke Begins an Adventure.</p>
          <p className="pixel-login-description">
            Explore magical worlds, raise adorable companions, conquer typing challenges, and become
            a true keyboard adventurer.
          </p>
        </div>

        {/* Right — Auth Panel */}
        <div
          className="pixel-login-panel"
          role="dialog"
          aria-modal="true"
          aria-label="PawType account access"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="pixel-login-panel-head">
            <p className="pixel-login-kicker">Main Gate</p>
            <h2>{mode === "login" ? "Load Save File" : "Create Save File"}</h2>
            <p className="pixel-login-panel-desc">
              Continue your adventure with your saved progress.
            </p>
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
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                inputMode="email"
                maxLength={254}
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                placeholder={mode === "login" ? "Your password" : "Create a strong password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                required
                minLength={mode === "login" ? 1 : PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
              />
              {mode === "signup" ? <small>{passwordHint}</small> : null}
            </label>
            {mode === "signup" ? (
              <label>
                <span>Confirm Password</span>
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                  minLength={PASSWORD_MIN_LENGTH}
                  maxLength={PASSWORD_MAX_LENGTH}
                />
              </label>
            ) : null}

            {error ? (
              <p className="pixel-auth-error" role="alert">
                {error}
              </p>
            ) : null}

            <button className="pixel-login-enter-btn" disabled={isBusy} type="submit">
              {isBusy ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle className="size-3 animate-spin" />
                  Opening Gate...
                </span>
              ) : mode === "login" ? (
                "Enter Game"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="pixel-auth-divider">
            <span>or continue with</span>
          </div>

          <div className="pixel-auth-provider-grid">
            <button
              className="pixel-login-social-btn"
              disabled={isBusy}
              onClick={() => handleProvider("google")}
              type="button"
            >
              <span className="pixel-social-mark is-google">G</span>
              Google
            </button>
            <button
              className="pixel-login-social-btn"
              disabled={isBusy}
              onClick={() => handleProvider("facebook")}
              type="button"
            >
              <span className="pixel-social-mark is-facebook">f</span>
              Facebook
            </button>
          </div>

          <button
            className="pixel-login-demo-btn"
            disabled={isBusy}
            onClick={handleDemo}
            type="button"
          >
            <PixelIcon emoji="⭐" className="pixel-login-demo-icon" />
            Play Demo
          </button>

          <p className="pixel-login-footer-note">
            Your pets and progress will be waiting when you return.
          </p>
        </div>
      </div>
    </section>
  );
}
