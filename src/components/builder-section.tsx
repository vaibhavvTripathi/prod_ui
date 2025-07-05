"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CodePreviewToggle } from "@/components/code-preview-toggle";

const BuilderSection = () => {
  const searchParams = useSearchParams();
  const prompt = searchParams.get("prompt");

  useEffect(() => {
    if (prompt) {
      console.log("Building with prompt:", prompt);
      // Here you can integrate with your AI service to generate code based on the prompt
      // For now, we'll just log it
    }
  }, [prompt]);

  return (
    <div className="p-4">
      <CodePreviewToggle
        height="80vh"
        width="100%"
      />
    </div>
  );
};

export default BuilderSection;
