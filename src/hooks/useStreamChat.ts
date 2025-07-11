// hooks/useStreamChat.ts
import { streamAIChat } from "@/api_client/AIClient";
import { parseCodexityCodeBlock } from "@/helper/parser";
import { useAuthStore } from "@/store/authStore";
import { useFileSystemWithTemplate } from "@/store/fileSystemStore";
import { useState, useCallback, useEffect } from "react";

export const useStreamChat = () => {
  const token = useAuthStore((state) => state.token);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const { applySteps } = useFileSystemWithTemplate(1);
  const sendMessage = useCallback(async (msg: string, promptId: number) => {
    if (!token) {
      return;
    }
    setResponse("");
    setLoading(true);
    try {
      await streamAIChat(msg, promptId, token, (chunk) =>
        setResponse((prev) => prev + chunk)
      );
    } catch (err) {
      console.error("stream error:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const steps = parseCodexityCodeBlock(response);
    applySteps(steps);
  }, [applySteps, response]);

  return { response, loading, sendMessage };
};
