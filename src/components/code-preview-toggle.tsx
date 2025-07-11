"use client";
import React, { useState, useEffect } from "react";
import { Code, Eye } from "lucide-react";
import { useCodePreviewSetup } from "@/hooks/useCodePreviewSetup";
import CodeEditor from "@/components/code-editor";
import { PreviewFrame } from "@/components/preview-frame";
import { cn } from "@/lib/utils";
import { useWebcontainerUrl } from "@/hooks/useWebcontainerUrl";

interface CodePreviewToggleProps {
  height?: string | number;
  width?: string | number;
  className?: string;
}

type ViewMode = "code" | "preview";

export function CodePreviewToggle({
  height,
  width,
  className,
}: CodePreviewToggleProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("code");
  const [hasMounted, setHasMounted] = useState(false);
  const {
    files,
    webContainer,
    isReady,
    isLoading: isLoadingCodePreview,
    error: codeError,
  } = useCodePreviewSetup(1);
  const { url, isLoading, error } = useWebcontainerUrl(webContainer);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "code" ? "preview" : "code"));
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-background border border-border rounded-lg overflow-hidden",
        className
      )}
      style={{
        height: height || "100%",
        width: width || "100%",
      }}
    >
      {/* Header with toggle button */}
      <div className="flex items-center justify-between px-4 py-2 bg-popover border-b border-border">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium text-foreground">
            {viewMode === "code" ? "Code Editor" : "Live Preview"}
          </h3>
        </div>

        <button
          onClick={toggleViewMode}
          className={cn(
            "flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
            "hover:bg-muted/60 active:scale-95",
            viewMode === "code"
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {viewMode === "code" ? (
            <>
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </>
          ) : (
            <>
              <Code className="w-4 h-4" />
              <span>Code</span>
            </>
          )}
        </button>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        {isLoadingCodePreview ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading template...</p>
            </div>
          </div>
        ) : codeError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-destructive mb-2">Error loading template</p>
              <p className="text-sm text-muted-foreground">
                {codeError?.message || "Unknown error"}
              </p>
            </div>
          </div>
        ) : viewMode === "code" ? (
          files ? (
            <CodeEditor
              files={files}
              height="100%"
              width="100%"
              className="border-0 rounded-none"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-muted-foreground">No files available</p>
              </div>
            </div>
          )
        ) : viewMode === "preview" ? (
          webContainer && isReady ? (
            <PreviewFrame
              height="100%"
              width="100%"
              url={url}
              isLoading={isLoading}
              error={error ?? ""}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-muted-foreground">Loading preview...</p>
              </div>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground">Select a mode to continue</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
