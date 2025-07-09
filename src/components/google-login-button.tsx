"use client";
import { useGoogleLoginAuth } from "@/hooks/useGoogleLoginAuth";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";

const GLBUTTON = () => {
  const { loginWithGoogle, isLoading, error } = useGoogleLoginAuth();
  return (
    <GoogleOAuthProvider clientId="464885182219-0do7hhjnuebd287fsf2qj8gk0s2b5bcg.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={(res) => loginWithGoogle(res)}
        onError={() => console.log("Login Failed")}
      />
      {isLoading && <p>Logging in...</p>}
      {error && <p className="text-red-500">Login failed</p>}
    </GoogleOAuthProvider>
  );
};

export default GLBUTTON;
