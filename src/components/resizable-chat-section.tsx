"use client";
import React, { useRef, useState } from "react";
import useDisplayMessages from "@/hooks/useDisplayMessages";
import { Step } from "@/types/steps";

const CHAT_WIDTH = 450;

const renderStep = (step: Step, idx: number) => {
  switch (step.type) {
    case "CreateOrUpdateFile":
      return (
        <div key={idx}>
          <b>Create/Update:</b> {step.filePath}
          <pre className="bg-muted p-2 rounded mt-1 whitespace-pre-wrap">
            {step.content}
          </pre>
        </div>
      );
    case "RenameFile":
      return (
        <div key={idx}>
          <b>Rename:</b> {step.filePath} → {step.newPath}
        </div>
      );
    case "DeleteFile":
      return (
        <div key={idx}>
          <b>Delete:</b> {step.filePath}
        </div>
      );
    case "AddDependency":
      return (
        <div key={idx}>
          <b>Add Dependency:</b> {step.dependency}@{step.version}
        </div>
      );
    default:
      return null;
  }
};

const ResizableChatSection = ({ promptId }: { promptId: number }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { allMessages, sendMessage } = useDisplayMessages(1);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      sendMessage(input, promptId);
      setInput("");
    }
  };

  return (
    <div
      className="h-full bg-background border-r border-border flex flex-col"
      style={{ width: CHAT_WIDTH }}
    >
      <div className="p-4 border-b border-border font-bold text-lg">Chat</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {allMessages && allMessages.length === 0 ? (
          <div className="text-muted-foreground text-center mt-8">
            No messages yet.
          </div>
        ) : (
          allMessages &&
          allMessages.map((msg, idx) =>
            msg.role === "user" ? (
              <div key={idx} className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[70%] break-words shadow">
                  {msg.userMessage}
                </div>
              </div>
            ) : (
              <div key={idx} className="flex justify-start">
                <div className="bg-muted text-foreground rounded-lg px-4 py-2 max-w-[70%] break-words shadow">
                  {msg.modelMessage && msg.modelMessage.length > 0 ? (
                    msg.modelMessage.map((step, sidx) => renderStep(step, sidx))
                  ) : (
                    <span>No steps</span>
                  )}
                </div>
              </div>
            )
          )
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-border">
        <input
          type="text"
          className="w-full rounded border border-border bg-muted px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
      </div>
    </div>
  );
};

export default ResizableChatSection;
