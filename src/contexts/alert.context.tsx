"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useAlert, AlertOptions } from "@/hooks/use-alert.hook";
import { AlertModal } from "@/components/alert-modal";

interface AlertContextType {
  createAlert: (options: AlertOptions) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const { createAlert, alert, closeAlert } = useAlert();

  return (
    <AlertContext.Provider value={{ createAlert }}>
      {children}
      <AlertModal alert={alert} onClose={closeAlert} />
    </AlertContext.Provider>
  );
}

export function useAlertContext() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlertContext must be used within an AlertProvider");
  }
  return context;
}

