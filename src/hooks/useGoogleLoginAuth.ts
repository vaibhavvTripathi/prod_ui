import { useMutation } from "@tanstack/react-query";
import { verifyGoogleLogin } from "@/api_client/AIClient";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { CredentialResponse } from "@react-oauth/google";

export function useGoogleLoginAuth() {
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (credential: CredentialResponse) => verifyGoogleLogin(credential),
    onSuccess: (data) => {
      setToken(data.token);
      router.push("/"); // or your protected route
    },
    onError: (error) => {
      // Optionally handle error globally
      console.log(error);
    },
  });

  return {
    loginWithGoogle: (credential: CredentialResponse) => mutation.mutateAsync(credential),
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
