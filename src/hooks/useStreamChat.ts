// hooks/useStreamChat.ts
import { streamChat } from "@/api_client/AIClient";
import { parseCodexityCodeBlock } from "@/helper/parser";
import { useFileSystemWithTemplate } from "@/store/fileSystemStore";
import { useState, useCallback, useEffect } from "react";

export const useStreamChat = () => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const { applySteps } = useFileSystemWithTemplate();
  const sendMessage = useCallback(async (msg: string) => {
    setResponse("");
    setLoading(true);
    try {
      await streamChat(msg, (chunk) => setResponse((prev) => prev + chunk));
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
