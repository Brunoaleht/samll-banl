"use client";

import { useRouter } from "next/navigation";
import { Dashboard, DashboardProps } from "./dashboard";
import { useAuthContext } from "@/contexts/auth.context";
import { useAccountContext } from "@/contexts/account.context";
import { createElement, FC, useEffect } from "react";

export const DashboardContainer: FC = () => {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuthContext();
  const { balance, accountId, setAccountId, loadBalance, reset, loading } =
    useAccountContext();

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
        alert("Sistema resetado com sucesso!");
      } catch (err) {
        console.error("Reset error:", err);
        alert("Erro ao resetar o sistema");
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
