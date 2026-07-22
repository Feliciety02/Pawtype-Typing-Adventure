import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";

import { getAuthErrorMessage } from "@/lib/auth/errors";
import { signIn, signOut, signUp } from "@/lib/supabase/auth";
import { isDemoModeEnabled, setDemoModeEnabled, subscribeToDemoMode } from "@/lib/auth/demo";
import { getSupabaseBrowserClient, isSupabaseBrowserConfigured } from "@/lib/supabase/client";
import { signInWithOAuth, type OAuthProvider } from "@/lib/supabase/oauth";

// Everything the auth context provides to the rest of the app
type AuthCtx = {
  user: User | null;
  isLoading: boolean;
  isDemo: boolean;
  accountLabel: string | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  signUp: (data: { email: string; password: string }) => Promise<void>;
  loginWithProvider: (provider: OAuthProvider) => Promise<void>;
  logout: () => Promise<void>;
  enterDemo: () => void;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isLoggingOut: boolean;
  isSocialLoading: boolean;
};

const AuthCtx = createContext<AuthCtx | null>(null);

// Provides authentication state and actions (login, signup, logout, demo mode)
// to the entire app tree. Wraps Supabase auth with TanStack Query mutations.
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(isDemoModeEnabled);
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  // Sync demo mode state from localStorage
  useEffect(() => subscribeToDemoMode(() => setIsDemo(isDemoModeEnabled())), []);

  // On mount, check if Supabase is configured and resolve the initial auth session
  useEffect(() => {
    if (!isSupabaseBrowserConfigured()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    let mounted = true;

    // Fetch the current user with a 1.5s timeout (in case of network delay)
    const resolveInitialUser = async () => {
      try {
        const result = await Promise.race([
          supabase.auth.getUser().then(({ data, error }) => {
            if (error) return null;
            return data.user ?? null;
          }),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
        ]);

        if (!mounted) return;
        setUser(result);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    resolveInitialUser();

    // Listen for auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Login mutation — calls Supabase signIn, then refreshes the user
  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      try {
        return await signIn({ data });
      } catch (error) {
        throw new Error(getAuthErrorMessage(error, "Unable to sign in right now."));
      }
    },
    onSuccess: async () => {
      setDemoModeEnabled(false);
      if (!isSupabaseBrowserConfigured()) {
        setUser(null);
        router.invalidate();
        return;
      }

      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      router.invalidate();
    },
  });

  // Signup mutation — creates a new account via Supabase
  const signUpMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      try {
        return await signUp({ data });
      } catch (error) {
        throw new Error(getAuthErrorMessage(error, "Unable to create your account right now."));
      }
    },
    onSuccess: () => {
      setDemoModeEnabled(false);
    },
  });

  // Logout mutation — clears user and demo mode, then invalidates the router
  const logoutMutation = useMutation({
    mutationFn: () => (isDemo ? Promise.resolve({ success: true }) : signOut()),
    onSuccess: () => {
      setDemoModeEnabled(false);
      setUser(null);
      router.invalidate();
    },
  });

  // Sign in with Google, GitHub, etc.
  const loginWithProvider = async (provider: OAuthProvider) => {
    setIsSocialLoading(true);
    try {
      setDemoModeEnabled(false);
      await signInWithOAuth(provider);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error, "Unable to open social sign-in right now."));
    } finally {
      setIsSocialLoading(false);
    }
  };

  // Enter offline demo mode (no account needed, state saved to localStorage only)
  const enterDemo = () => {
    setDemoModeEnabled(true);
    setUser(null);
    setIsLoading(false);
    router.invalidate();
  };

  return (
    <AuthCtx.Provider
      value={{
        user,
        isLoading,
        isDemo,
        accountLabel: user?.email ?? (isDemo ? "Demo Adventurer" : null),
        login: (data) => loginMutation.mutateAsync(data).then(() => {}),
        signUp: (data) => signUpMutation.mutateAsync(data).then(() => {}),
        loginWithProvider,
        logout: () => logoutMutation.mutateAsync().then(() => {}),
        enterDemo,
        isLoggingIn: loginMutation.isPending,
        isSigningUp: signUpMutation.isPending,
        isLoggingOut: logoutMutation.isPending,
        isSocialLoading,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
