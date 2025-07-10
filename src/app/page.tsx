"use client";
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { AuthBoundary } from "@/components/auth-boundary";
import Navbar from "@/components/navbar";
import { useUser } from "@/hooks/useUser";
import AnimatedTextarea from "@/components/animated-text-area";
import { useUpsertPrompt } from "@/hooks/useUpsertPrompt";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const { user } = useUser();
  const { upsertPrompt, isLoading } = useUpsertPrompt();

  const handleBuild = () => {
    if (prompt.trim()) {
      upsertPrompt(prompt);
    }
  };

  return (
    <>
      <AuthBoundary>
        <div className="flex flex-col h-screen bg-gradient-to-br from-background to-muted">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-4xl mx-auto text-center w-full">
              <div className="mb-8">
                {user && (
                  <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
                    Hi, {user.first}!
                  </h1>
                )}
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Build, edit, and preview your code in real-time with our
                  powerful online development environment.
                </p>
              </div>

              {/* Prompt Input Section */}
              <div className="mb-12 max-w-xl mx-auto animate-fade-in-up">
                <div className="relative group">
                  <AnimatedTextarea
                    value={prompt}
                    setValue={(val) => setPrompt(val)}
                  />

                  <button
                    onClick={handleBuild}
                    disabled={!prompt.trim() || isLoading}
                    className="absolute right-2 bottom-0.5 -translate-y-1/2 inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 group enabled:hover:scale-105 enabled:active:scale-95"
                  >
                    <span className="mr-1">
                      {isLoading ? "Building..." : "Build"}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthBoundary>
    </>
  );
};

export default Index;
