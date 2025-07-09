import { useQuery } from "@tanstack/react-query";
import { fetchTemplate } from "@/api_client/AIClient";
import type { FileItem } from "@/types/file";

export function useTemplateQuery() {
  return useQuery<FileItem[]>({
    queryKey: ["template"],
    queryFn: fetchTemplate,
    staleTime: 60 * 1000, // 1 minute
  });
} 

