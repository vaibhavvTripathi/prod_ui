"use client";
import React from "react";
import BuilderSection from "@/components/builder-section";
import { AuthBoundary } from "@/components/auth-boundary";
import ResizableChatSection from "@/components/resizable-chat-section";
import { useParams } from "next/navigation";

const BuilderPage = () => {
  const params = useParams();
  const promptId = Number(params?.id);

  return (
    <AuthBoundary>
      <div className="flex h-screen">
        <ResizableChatSection promptId={promptId} />
        <div className="flex-1 flex flex-col">
          <BuilderSection />
        </div>
      </div>
    </AuthBoundary>
  );
};

export default BuilderPage;
