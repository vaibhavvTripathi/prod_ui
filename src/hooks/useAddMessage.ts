import { useMutation } from "@tanstack/react-query";
import { addMessage } from "@/api_client/AIClient";
import { useAuthStore } from "@/store/authStore";

export function useAddMessage() {
  const token = useAuthStore((state) => state.token);

  const mutation = useMutation({
    mutationFn: ({ promptId, message, role }: { promptId: number; message: string; role: 'user' | 'model' }) => {
      if (!token) throw new Error("No auth token");
      return addMessage(promptId, message, role, token);
    },
  });

  return {
    addMessage: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
} 