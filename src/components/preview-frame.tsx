import React from "react";

interface PreviewFrameProps {
  url: string;
  isLoading: boolean;
  error: string;
  height?: string | number;
  width?: string | number;
}

export function PreviewFrame({
  url,
  isLoading,
  error,
  height,
  width,
}: PreviewFrameProps) {

  if (error) {
    return (
      <div
        className="flex items-center justify-center text-red-400"
        style={{
          height: height || "100%",
          width: width || "100%",
        }}
      >
        <div className="text-center">
          <p className="mb-2">Error starting server</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center text-gray-400"
        style={{
          height: height || "100%",
          width: width || "100%",
        }}
      >
        <div className="text-center">
          <p className="mb-2">Starting development server...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: height || "100%",
        width: width || "100%",
      }}
    >
      <iframe
        width="100%"
        height="100%"
        src={url}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        title="Preview"
        className="border-0"
      />
    </div>
  );
}
