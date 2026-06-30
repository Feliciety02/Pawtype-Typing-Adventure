import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  passwordHint,
} from "@/lib/auth/shared";

export function AuthForm() {
  const {
    login,
    signUp,
    loginWithProvider,
    enterDemo,
    isLoggingIn,
    isSigningUp,
    isSocialLoading,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const isBusy = isLoggingIn || isSigningUp || isSocialLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      }
    } catch (err) {
      setError(getAuthErrorMessage(err, "Something went wrong"));
    }
  };

  const handleProvider = async (provider: "google" | "facebook") => {
    setError(null);
    try {
      await loginWithProvider(provider);
    } catch (err) {
      setError(getAuthErrorMessage(err, "Something went wrong"));
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Sign In" : "Create Account"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Enter your email to sign in to your account"
            : "Create a new account to save your progress"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="email"
              maxLength={254}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder={mode === "login" ? "Your password" : "Create a strong password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
              minLength={mode === "login" ? 1 : PASSWORD_MIN_LENGTH}
              maxLength={PASSWORD_MAX_LENGTH}
            />
            {mode === "signup" ? (
              <p className="text-xs text-muted-foreground">{passwordHint}</p>
            ) : null}
          </div>
          {mode === "signup" ? (
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                required
                minLength={PASSWORD_MIN_LENGTH}
                maxLength={PASSWORD_MAX_LENGTH}
              />
            </div>
          ) : null}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={isBusy}>
            {isBusy
              ? "Please wait..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isBusy}
              onClick={() => handleProvider("google")}
            >
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isBusy}
              onClick={() => handleProvider("facebook")}
            >
              Facebook
            </Button>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={isBusy}
            onClick={enterDemo}
          >
            Demo Account
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="underline hover:text-primary"
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="underline hover:text-primary"
                  onClick={() => setMode("login")}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
