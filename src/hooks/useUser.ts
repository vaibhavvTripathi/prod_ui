import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api_client/AIClient";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/types/user";

export function useUser() {
  const token = useAuthStore((state) => state.token);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery<User | undefined, Error>({
    queryKey: ["user", token],
    queryFn: async () => {
      if (!token) return undefined;
      return await getUser(token);
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { user, isLoading, error, refetch };
} 