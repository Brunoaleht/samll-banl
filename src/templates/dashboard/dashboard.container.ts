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
  const {
    balance,
    accountId,
    setAccountId,
    loadBalance,
    loadAccountData,
    createAccount,
    reset,
    logout: logoutAccount,
    loading,
  } = useAccountContext();
  const { createAlert } = useAlertContext();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLoadBalance = async () => {
    try {
      await loadBalance();
    } catch (err: unknown) {
      console.error("Load balance error:", err);
      const apiError = err as ApiError;
      const httpCode = apiError.status;
      const apiMessage = apiError.error || "Erro desconhecido";
      createAlert({
        message: "Erro ao carregar saldo",
        apiMessage,
        httpCode,
      });
    }
  };

  const handleLoadAccountData = async (id: number) => {
    try {
      await loadAccountData(id);
      createAlert({
        message: `Conta ${id} carregada com sucesso!`,
      });
    } catch (err: unknown) {
      console.error("Load account data error:", err);
      const apiError = err as ApiError;
      const httpCode = apiError.status;
      const apiMessage = apiError.error || "Erro desconhecido";
      createAlert({
        message: "Erro ao carregar conta",
        apiMessage,
        httpCode,
      });
    }
  };

  const handleCreateAccount = async (id: number, initialBalance?: number) => {
    try {
      await createAccount(id, initialBalance);
      createAlert({
        message: `Conta ${id} criada com sucesso!`,
      });
    } catch (err: unknown) {
      console.error("Create account error:", err);
      const apiError = err as ApiError;
      const httpCode = apiError.status;
      const apiMessage = apiError.error || "Erro desconhecido";
      createAlert({
        message: "Erro ao criar conta",
        apiMessage,
        httpCode,
      });
    }
  };

  const handleExitAccount = () => {
    logoutAccount();
    createAlert({
      message: "Saio da conta com Success!",
    });
  };

  const handleLogout = () => {
    logout();
    logoutAccount();
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
    onLoadAccountData: handleLoadAccountData,
    onCreateAccount: handleCreateAccount,
    onLoadBalance: handleLoadBalance,
    onExitAccount: handleExitAccount,
    onLogout: handleLogout,
    onReset: handleReset,
    loading,
  };

  return createElement(Dashboard, props);
};
