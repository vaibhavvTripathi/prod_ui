"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthBoundary({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated ) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);
  return <>{children}</>;
}
