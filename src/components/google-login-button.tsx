"use client";
import { useGoogleLoginAuth } from "@/hooks/useGoogleLoginAuth";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";

const GLBUTTON = () => {
  const { loginWithGoogle, isLoading, error } = useGoogleLoginAuth();
  const [theme, setTheme] = React.useState<'filled_black' | 'outline'>(
    typeof window !== "undefined" && document.documentElement.classList.contains("dark")
      ? "filled_black"
      : "outline"
  );

  React.useEffect(() => {
    const updateTheme = () => {
      setTheme(
        document.documentElement.classList.contains("dark")
          ? "filled_black"
          : "outline"
      );
    };
    updateTheme();
    window.addEventListener("classChange", updateTheme);
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      window.removeEventListener("classChange", updateTheme);
      observer.disconnect();
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId="464885182219-0do7hhjnuebd287fsf2qj8gk0s2b5bcg.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={(res) => loginWithGoogle(res)}
        onError={() => console.log("Login Failed")}
        theme={theme}
      />
      {isLoading && <p>Logging in...</p>}
      {error && <p className="text-red-500">Login failed</p>}
    </GoogleOAuthProvider>
  );
};

export default GLBUTTON;
