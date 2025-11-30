"use client";

import { useRouter } from "next/navigation";
import { LoginPage, LoginProps } from "./login";
import { useAuthContext } from "@/contexts/auth.context";
import { useAlertContext } from "@/contexts/alert.context";
import { createElement, FC, useEffect } from "react";

export const LoginContainer: FC = () => {
  const router = useRouter();
  const { login, loading, isAuthenticated } = useAuthContext();
  const { createAlert } = useAlertContext();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (username: string, password: string) => {
    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      const httpCode = err.status || err.httpCode || 500;
      const apiMessage = err.error || "Erro desconhecido";

      createAlert({
        message: "Erro ao fazer login",
        apiMessage,
        httpCode,
      });
    }
  };

  const props: LoginProps = {
    loading,
    onSubmit: handleSubmit,
  };

  return createElement(LoginPage, props);
};
