"use client";

import { useRouter } from "next/navigation";
import { LoginPage, LoginProps } from "./login";
import { useAuthContext } from "@/contexts/auth.context";
import { createElement, useEffect } from "react";

export function LoginContainer() {
  const router = useRouter();
  const { login, loading, error, isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (username: string, password: string) => {
    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const props: LoginProps = {
    loading,
    error,
    onSubmit: handleSubmit,
  };

  return createElement(LoginPage, props);
}
