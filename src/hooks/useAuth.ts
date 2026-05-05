import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

export function useAuth() {
  const utils = trpc.useUtils();

  const {
    data: admin,
    isLoading,
    error,
    refetch,
  } = trpc.adminAuth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logoutMutation = trpc.adminAuth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      window.location.href = "/admin/login";
    },
  });

  const logout = useCallback(() => logoutMutation.mutate(), [logoutMutation]);

  return useMemo(
    () => ({
      admin: admin ?? null,
      isAuthenticated: !!admin,
      isLoading: isLoading || logoutMutation.isPending,
      error,
      logout,
      refresh: refetch,
    }),
    [admin, isLoading, logoutMutation.isPending, error, logout, refetch],
  );
}
