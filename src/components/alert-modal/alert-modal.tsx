import React, { FC } from "react";
import { Button } from "@/components/button";
import * as S from "./styles";
import { AlertState } from "@/hooks/use-alert.hook";

export interface AlertModalProps {
  alert: AlertState;
  onClose: () => void;
}

export const AlertModal: FC<AlertModalProps> = ({ alert, onClose }) => {
  if (!alert.isOpen) {
    return null;
  }

  const handleOk = () => {
    if (alert.onOk) {
      alert.onOk();
    }
    onClose();
  };

  const handleCancel = () => {
    if (alert.onCancel) {
      alert.onCancel();
    }
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={S.getOverlayClasses()} onClick={handleBackdropClick}>
      <div className={S.getModalClasses()}>
        <div className={S.getHeaderClasses()}>
          <h2 className={S.getTitleClasses()}>{alert.message}</h2>
        </div>
        <div className={S.getContentClasses()}>
          {alert.apiMessage && (
            <p className={S.getMessageClasses()}>{alert.apiMessage}</p>
          )}
          {alert.httpCode && (
            <p className={S.getCodeClasses()}>
              Código HTTP: <span className={S.getCodeValueClasses()}>{alert.httpCode}</span>
            </p>
          )}
        </div>
        <div className={S.getFooterClasses()}>
          {alert.onCancel && (
            <Button variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
          )}
          {alert.onOk && (
            <Button variant="primary" onClick={handleOk}>
              Ok
            </Button>
          )}
          {!alert.onOk && !alert.onCancel && (
            <Button variant="primary" onClick={onClose}>
              Ok
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

