import { useMutation } from "@tanstack/react-query";
import { upsertPrompt } from "@/api_client/AIClient";
import { useAuthStore } from "@/store/authStore";

export function useUpsertPrompt() {
  const token = useAuthStore((state) => state.token);

  const mutation = useMutation({
    mutationFn: (prompt: string) => {
      if (!token) throw new Error("No auth token");
      return upsertPrompt(prompt, token);
    },
  });

  return {
    upsertPrompt: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
} 