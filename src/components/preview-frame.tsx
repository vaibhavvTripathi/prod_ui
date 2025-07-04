import { WebContainer } from "@webcontainer/api";
import React, { useEffect, useState } from "react";

interface PreviewFrameProps {
  webContainer: WebContainer;
}

export function PreviewFrame({ webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function startServer() {
      try {
        setIsLoading(true);
        setError(null);

        // Set up the server-ready event listener BEFORE starting the server
        const handleServerReady = (port: number, serverUrl: string) => {
          if (mounted) {
            console.log('Server ready on port:', port);
            console.log('Server URL:', serverUrl);
            setUrl(serverUrl);
            setIsLoading(false);
          }
        };

        webContainer.on("server-ready", handleServerReady);

        // Install dependencies
        console.log('Installing dependencies...');
        const installProcess = await webContainer.spawn("npm", ["install"]);

        installProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              console.log(data);
            },
          })
        );

        // Wait for install to complete
        const installExitCode = await installProcess.exit;
        if (installExitCode !== 0) {
          throw new Error(`npm install failed with exit code ${installExitCode}`);
        }

        console.log('Starting dev server...');
        
        // Start the dev server (don't await this as it runs continuously)
        const devProcess = webContainer.spawn("npm", ["run", "dev"]);
        
        // Handle dev server output
        (await devProcess).output.pipeTo(
          new WritableStream({
            write(data) {
              console.log('Dev server:', data);
            },
          })
        );

      } catch (err) {
        console.error('Error starting server:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to start server');
          setIsLoading(false);
        }
      }
    }

    startServer();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, [webContainer]);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-400">
        <div className="text-center">
          <p className="mb-2">Error starting server</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <p className="mb-2">Starting development server...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
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