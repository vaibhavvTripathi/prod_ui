import { useEffect, useState } from "react";
import { WebContainer } from "@webcontainer/api";
import { FileItem } from "@/types/file";
import { useWebcontainer } from "@/hooks/useWebcontainer";
import { convertFileItemArrayToFileSystemTree } from "@/helper/createmountstructure";
import { useFileSystemWithTemplate } from "@/store/fileSystemStore";

interface UseCodePreviewSetupReturn {
  files: FileItem[] | undefined;
  webContainer: WebContainer | null;
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useCodePreviewSetup(
  promptId: number
): UseCodePreviewSetupReturn {
  const { fileTree: files, isLoading, error } = useFileSystemWithTemplate(promptId);
  const { webcontainer } = useWebcontainer();
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (!files || !webcontainer) return;

    try {
      const mountingStructure = convertFileItemArrayToFileSystemTree(files);
      if (!mountingStructure) {
        console.error("Failed to convert files to mounting structure");
        return;
      }

      webcontainer.mount(mountingStructure);
      setIsReady(true);
    } catch (err) {
      console.error("Error mounting files to WebContainer:", err);
    }
  }, [files, webcontainer]);

  return {
    files,
    webContainer: webcontainer,
    isReady,
    isLoading,
    error,
  };
}
