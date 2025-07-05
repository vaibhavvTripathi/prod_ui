"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Code, Eye } from "lucide-react";

const Index = () => {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  const placeholders = [
    "Build a React todo app with TypeScript...",
    "Create a landing page with animations...",
    "Build a weather app with API integration...",
    "Create a portfolio website...",
    "Build a chat application...",
    "Create a dashboard with charts...",
    "Build an e-commerce product page...",
    "Create a blog with markdown support...",
  ];

  const handleBuild = () => {
    if (prompt.trim()) {
      router.push(`/builder?prompt=${encodeURIComponent(prompt.trim())}`);
    } else {
      router.push("/builder");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBuild();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            Code Builder
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build, edit, and preview your code in real-time with our powerful
            online development environment.
          </p>
        </div>

        {/* Prompt Input Section */}
        <div className="mb-12 max-w-xl mx-auto animate-fade-in-up">
          <div className="relative group">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholders[0]}
              className="w-full px-6 py-4 text-lg border-2 border-border rounded-full bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-background transition-all duration-300 ease-out shadow-lg hover:shadow-xl hover:scale-[1.02] focus:scale-[1.02]"
            />

            <button
              onClick={handleBuild}
              disabled={!prompt.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 group enabled:hover:scale-105 enabled:active:scale-95"
            >
              <span className="mr-1">Build</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          <div className="mt-3 text-center">
            <p className="text-sm text-muted-foreground animate-pulse">
              Press Enter to build • {placeholders[0]}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-6 text-left">
            <div className="flex items-center mb-4">
              <Code className="w-6 h-6 text-primary mr-3" />
              <h3 className="text-lg font-semibold">Code Editor</h3>
            </div>
            <p className="text-muted-foreground">
              Advanced code editor with syntax highlighting, file tree
              navigation, and tab management.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-left">
            <div className="flex items-center mb-4">
              <Eye className="w-6 h-6 text-primary mr-3" />
              <h3 className="text-lg font-semibold">Live Preview</h3>
            </div>
            <p className="text-muted-foreground">
              Real-time preview of your application with hot reload and instant
              feedback.
            </p>
          </div>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            Powered by WebContainer technology for seamless development
            experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
