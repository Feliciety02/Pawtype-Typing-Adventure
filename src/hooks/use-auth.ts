import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";

import { signIn, signOut, signUp, getUser } from "@/lib/supabase/auth";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: () => getUser(),
  });

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      signIn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
      router.invalidate();
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      signUp({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      queryClient.setQueryData(["auth", "user"], null);
      router.invalidate();
    },
  });

  return {
    user: user as User | null,
    isLoading,
    login: loginMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
