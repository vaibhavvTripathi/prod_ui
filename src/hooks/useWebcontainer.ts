import { useEffect, useState } from "react";
import { WebContainer } from "@webcontainer/api";

export function useWebcontainer() {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    WebContainer.boot()
      .then((instance) => {
        if (isMounted) {
          setWebcontainer(instance);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
      // Optionally, add cleanup logic if WebContainer supports it
    };
  }, []);

  return { webcontainer, error, loading };
} 