// hooks/useStreamChat.ts
import { streamChat } from "@/api_client/AIClient";
import { useState, useCallback } from "react";

export const useStreamChat = () => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  // console.log("rendering");
  const sendMessage = useCallback(async (msg: string) => {
    setResponse("");
    setLoading(true);
    try {
      // await streamChat(msg, (chunk) => setResponse((prev) => prev + chunk));
    } catch (err) {
      console.error("stream error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { response, loading, sendMessage };
};
