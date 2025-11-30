"use client";

import { useRouter } from "next/navigation";
import { LoginPage, LoginProps } from "./login";
import { useAuthContext } from "@/contexts/auth.context";
import { useAlertContext } from "@/contexts/alert.context";
import {
  createElement,
  FC,
  useEffect,
  useState,
  FormEvent,
  ChangeEvent,
} from "react";
import { ApiError } from "@/lib/api/type";

export const LoginContainer: FC = () => {
  const router = useRouter();
  const { login, loading, isAuthenticated } = useAuthContext();
  const { createAlert } = useAlertContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Login error:", err);
      const apiError = err as ApiError;
      const httpCode = apiError.status || apiError.httpCode || 500;
      const apiMessage =
        apiError.error || apiError.message || "Erro desconhecido";
      createAlert({
        message: "Erro ao fazer login",
        apiMessage,
        httpCode,
      });
    }
  };

  const props: LoginProps = {
    username,
    password,
    onUsernameChange: handleUsernameChange,
    onPasswordChange: handlePasswordChange,
    loading,
    onSubmit: handleSubmit,
  };

  return createElement(LoginPage, props);
};
