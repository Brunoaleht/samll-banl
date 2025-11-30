import { useState } from "react";

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

  const createAlert = (options: AlertOptions) => {
    setAlert({
      isOpen: true,
      message: options.message,
      apiMessage: options.apiMessage,
      httpCode: options.httpCode,
      onOk: options.onOk,
      onCancel: options.onCancel,
      onClose: options.onClose,
    });
  };

  const closeAlert = () => {
    if (alert.onClose) {
      alert.onClose();
    }
    setAlert({
      isOpen: false,
      message: "",
    });
  };

  return {
    createAlert,
    alert,
    closeAlert,
  };
}
