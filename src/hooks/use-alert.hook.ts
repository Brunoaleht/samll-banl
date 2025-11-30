import { useState, useCallback } from "react";

export interface AlertOptions {
  message: string;
  apiMessage?: string;
  httpCode?: number;
  onOk?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export interface AlertState {
  isOpen: boolean;
  message: string;
  apiMessage?: string;
  httpCode?: number;
  onOk?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export function useAlert() {
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    message: "",
  });

  const createAlert = useCallback((options: AlertOptions) => {
    setAlert({
      isOpen: true,
      message: options.message,
      apiMessage: options.apiMessage,
      httpCode: options.httpCode,
      onOk: options.onOk,
      onCancel: options.onCancel,
      onClose: options.onClose,
    });
  }, []);

  const closeAlert = useCallback(() => {
    if (alert.onClose) {
      alert.onClose();
    }
    setAlert({
      isOpen: false,
      message: "",
    });
  }, [alert.onClose]);

  return {
    createAlert,
    alert,
    closeAlert,
  };
}
