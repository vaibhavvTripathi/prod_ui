import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";

interface UseWebcontainerUrlReturn {
  url: string;
  isLoading: boolean;
  error: string | null;
}

export function useWebcontainerUrl(
  webContainer: WebContainer | undefined | null
): UseWebcontainerUrlReturn {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function startServer() {
      try {
        if (!webContainer) return;
        setIsLoading(true);
        setError(null);

        // Set up the server-ready event listener BEFORE starting the server
        const handleServerReady = (port: number, serverUrl: string) => {
          if (mounted) {
            console.log("Server ready on port:", port);
            console.log("Server URL:", serverUrl);
            setUrl(serverUrl);
            setIsLoading(false);
          }
        };

        webContainer.on("server-ready", handleServerReady);

        // Install dependencies
        console.log("Installing dependencies...");
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
          throw new Error(
            `npm install failed with exit code ${installExitCode}`
          );
        }

        console.log("Starting dev server...");

        // Start the dev server (don't await this as it runs continuously)
        const devProcess = webContainer.spawn("npm", ["run", "dev"]);

        // Handle dev server output
        (await devProcess).output.pipeTo(
          new WritableStream({
            write(data) {
              console.log("Dev server:", data);
            },
          })
        );
      } catch (err) {
        console.error("Error starting server:", err);
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to start server"
          );
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

  return { url, isLoading, error };
}
