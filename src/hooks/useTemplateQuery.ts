import { useQuery } from "@tanstack/react-query";
import { fetchTemplate } from "@/api_client/AIClient";
import type { FileItem } from "@/types/file";
import { useAuthStore } from "@/store/authStore";

export function useTemplateQuery(promptId: number) {
  const token = useAuthStore((s) => s.token);
  return useQuery<FileItem[]>({
    queryKey: ["template"],
    queryFn: () => fetchTemplate(promptId, token as string),
    enabled: promptId !== undefined && promptId !== null && Boolean(token),
    staleTime: 60 * 1000, // 1 minute
  });
}
