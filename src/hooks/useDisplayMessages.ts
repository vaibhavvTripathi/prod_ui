import { useEffect, useState } from "react";
import { useMessagesForPrompt } from "./useMessagesForPrompt";
import { useStreamChat } from "./useStreamChat";
import { DisplayMessage } from "@/types/message";
import { parseCodexityCodeBlock } from "@/helper/parser";

const useDisplayMessages = (promptId: number) => {
  const { messages: oldMessages } = useMessagesForPrompt(promptId);
  const { response: streamedMessage, sendMessage } = useStreamChat();
  const [allMessages, setAllMessages] = useState<DisplayMessage[]>([]);

  useEffect(() => {
    if (!oldMessages) {
      setAllMessages([]);
      return;
    }
    const displayMessages: DisplayMessage[] = oldMessages.map((om) => {
      if (om.role === "user") {
        return { role: "user", userMessage: om.message };
      } else {
        return {
          role: "model",
          modelMessage: parseCodexityCodeBlock(om.message),
        };
      }
    });
    setAllMessages(displayMessages);
  }, [oldMessages]);

  useEffect(() => {
    if (streamedMessage) {
      setAllMessages((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].role === "model") {
          return [
            ...prev.slice(0, -1),
            {
              role: "model",
              modelMessage: parseCodexityCodeBlock(streamedMessage),
            },
          ];
        } else {
          return [
            ...prev,
            {
              role: "model",
              modelMessage: parseCodexityCodeBlock(streamedMessage),
            },
          ];
        }
      });
    }
  }, [streamedMessage]);

  return { allMessages, sendMessage };
};

export default useDisplayMessages;
