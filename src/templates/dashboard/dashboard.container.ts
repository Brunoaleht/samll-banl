"use client";

import { useRouter } from "next/navigation";
import { Dashboard, DashboardProps } from "./dashboard";
import { useAuthContext } from "@/contexts/auth.context";
import { useAccountContext } from "@/contexts/account.context";
import { useAlertContext } from "@/contexts/alert.context";
import { createElement, FC, useEffect } from "react";
import { ApiError } from "@/lib/api/type";

export const DashboardContainer: FC = () => {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuthContext();
  const { balance, accountId, setAccountId, loadBalance, reset, loading } =
    useAccountContext();
  const { createAlert } = useAlertContext();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleReset = async () => {
    if (
      confirm(
        "Tem certeza que deseja resetar o sistema? Todas as contas serão apagadas."
      )
    ) {
      try {
        await reset();
        createAlert({
          message: "Sistema resetado com sucesso!",
        });
      } catch (err: unknown) {
        console.error("Reset error:", err);
        const apiError = err as ApiError;
        const httpCode = apiError.status || apiError.httpCode || 500;
        const apiMessage = apiError.error || "Erro desconhecido";
        createAlert({
          message: "Erro ao resetar o sistema",
          apiMessage,
          httpCode,
        });
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const props: DashboardProps = {
    balance,
    accountId,
    onAccountIdChange: setAccountId,
    loading,
    onLoadBalance: loadBalance,
    onLogout: handleLogout,
    onReset: handleReset,
  };

  return createElement(Dashboard, props);
};
