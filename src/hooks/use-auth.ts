import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { getAuthErrorMessage } from "@/lib/auth/errors";
import { signIn, signOut, signUp } from "@/lib/supabase/auth";
import { isDemoModeEnabled, setDemoModeEnabled, subscribeToDemoMode } from "@/lib/auth/demo";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { signInWithOAuth, type OAuthProvider } from "@/lib/supabase/oauth";

export function useAuth() {
  const router = useRouter();
  const [isDemo, setIsDemo] = useState(isDemoModeEnabled);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => subscribeToDemoMode(() => setIsDemo(isDemoModeEnabled())), []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let mounted = true;

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
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      router.invalidate();
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      try {
        return await signUp({ data });
      } catch (error) {
        throw new Error(
          getAuthErrorMessage(error, "Unable to create your account right now."),
        );
      }
    },
    onSuccess: () => {
      setDemoModeEnabled(false);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => (isDemo ? Promise.resolve({ success: true }) : signOut()),
    onSuccess: () => {
      setDemoModeEnabled(false);
      setUser(null);
      router.invalidate();
    },
  });

  const loginWithProvider = async (provider: OAuthProvider) => {
    setIsSocialLoading(true);
    try {
      setDemoModeEnabled(false);
      await signInWithOAuth(provider);
    } catch (error) {
      throw new Error(
        getAuthErrorMessage(error, "Unable to open social sign-in right now."),
      );
    } finally {
      setIsSocialLoading(false);
    }
  };

  const enterDemo = () => {
    setDemoModeEnabled(true);
    setUser(null);
    setIsLoading(false);
    router.invalidate();
  };

  return {
    user,
    isLoading,
    isDemo,
    accountLabel: user?.email ?? (isDemo ? "Demo Adventurer" : null),
    login: loginMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    loginWithProvider,
    logout: logoutMutation.mutateAsync,
    enterDemo,
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isSocialLoading,
  };
}
