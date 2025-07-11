import { useQuery } from "@tanstack/react-query";
import { getMessagesForPrompt } from "@/api_client/AIClient";
import { useAuthStore } from "@/store/authStore";

export function useMessagesForPrompt(promptId: number) {
  const token = useAuthStore((state) => state.token);

  const {
    data: messages,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["messages", promptId, token],
    queryFn: () => {
      return getMessagesForPrompt(promptId, token as string);
    },
    enabled: !!token && !!promptId,
    staleTime: 1000 * 30, // 30 seconds
  });

  return { messages, isLoading, error, refetch };
} 