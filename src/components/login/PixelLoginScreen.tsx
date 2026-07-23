import { useState, type CSSProperties } from "react";
import { LoaderCircle, Play } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { buildDemoGameState } from "@/lib/game/demo";
import { useGame } from "@/lib/game/store";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, passwordHint } from "@/lib/auth/shared";
import loginBackground from "./loginpage_background.webp";

const fallingLeaves = [
  [8, 13, 0, 10.8, 40, 390, 2, 0.56],
  [16, 9, 0.8, 12.4, -34, 430, 0, 1.05],
  [25, 17, 1.6, 11.6, 50, 370, 1, 0.68],
  [32, 8, 2.4, 13.1, -42, 450, 3, 1.15],
  [13, 25, 3.2, 10.2, 36, 405, 0, 0.74],
  [39, 7, 4, 12.8, -28, 420, 2, 0.93],
  [46, 11, 4.8, 11.1, 34, 395, 1, 0.52],
  [53, 6, 5.6, 13.6, -38, 440, 3, 1.06],
  [20, 6, 6.4, 10.6, 26, 380, 1, 0.64],
  [35, 20, 7.2, 12.1, -47, 425, 2, 1],
  [5, 18, 8, 11.4, 31, 400, 3, 0.58],
  [50, 15, 8.8, 13.3, -30, 445, 0, 0.98],
  [29, 5, 9.6, 10.9, 45, 390, 2, 0.7],
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
            src={`/shared/icons/login-leaves/leaf-${String((index % 6) + 1).padStart(2, "0")}.webp`}
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

  const artwork = mode === "login" ? "/shared/auth/login" : "/shared/auth/signin";
  const submitArtwork = mode === "login" ? "/shared/auth/login-submit.webp" : "/shared/auth/signin-create-account.webp";

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
          className={`save-auth-modal is-${mode}-mode`}
          role="dialog"
          aria-modal="true"
          aria-label="PawType account access"
          onClick={(event) => event.stopPropagation()}
        >
          <img
            className="save-auth-header"
            src={`${artwork}-header.webp`}
            alt=""
            aria-hidden="true"
          />
          <button
            className="save-auth-close"
            type="button"
            aria-label="Return to title screen"
            disabled={isBusy}
            onClick={() => setIsAuthOpen(false)}
          >
            <img src="/shared/auth/auth-close.webp" alt="" aria-hidden="true" />
          </button>
          <div className="save-auth-tabs">
            <button
              className={mode === "login" ? "is-active" : ""}
              onClick={() => setMode("login")}
              type="button"
              aria-label="Log In"
            >
              <img src={`${artwork}-login-tab.webp`} alt="" aria-hidden="true" />
            </button>
            <button
              className={mode === "signup" ? "is-active" : ""}
              onClick={() => setMode("signup")}
              type="button"
              aria-label="Sign Up"
            >
              <img src={`${artwork}-signup-tab.webp`} alt="" aria-hidden="true" />
            </button>
          </div>

          <form id="pixel-login-auth-form" onSubmit={handleSubmit} className="save-auth-form">
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
              <p className="save-auth-error" role="alert">
                {error}
              </p>
            ) : null}
          </form>

          <button
            className="save-auth-submit"
            disabled={isBusy}
            form="pixel-login-auth-form"
            type="submit"
            aria-label={mode === "login" ? "Enter Game" : "Create Account"}
          >
            <img src={submitArtwork} alt="" aria-hidden="true" />
            {isBusy ? (
              <span className="save-auth-submit-status">
                <LoaderCircle className="size-3 animate-spin" />
              </span>
            ) : null}
          </button>

          <img
            className="save-auth-divider"
            src="/shared/auth/or_continue_with-assets.webp"
            alt=""
            aria-hidden="true"
          />

          <div className="save-auth-providers">
            <button
              className="save-auth-provider"
              disabled={isBusy}
              onClick={() => handleProvider("google")}
              type="button"
              aria-label="Continue with Google"
            >
              <img src="/shared/auth/auth-google.webp" alt="" aria-hidden="true" />
            </button>
            <button
              className="save-auth-provider"
              disabled={isBusy}
              onClick={() => handleProvider("facebook")}
              type="button"
              aria-label="Continue with Facebook"
            >
              <img src="/shared/auth/auth-facebook.webp" alt="" aria-hidden="true" />
            </button>
          </div>

          <button
            className="save-auth-demo"
            disabled={isBusy}
            onClick={handleDemo}
            type="button"
            aria-label="Play Demo"
          >
            <img src="/shared/auth/demo-btn.webp" alt="" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
