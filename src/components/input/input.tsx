import React, { FC } from "react";
import * as S from "./styles";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: FC<InputProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className={S.getInputWrapperClasses(className)}>
      {label && <label className={S.getLabelClasses()}>{label}</label>}
      <input className={S.getInputClasses(!!error)} {...props} />
      {error && <span className={S.getErrorMessageClasses()}>{error}</span>}
    </div>
  );
};
