import React from 'react';
import * as S from './styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className={S.getInputWrapperClasses(className)}>
      {label && <label className={S.getLabelClasses()}>{label}</label>}
      <input className={S.getInputClasses(!!error)} {...props} />
      {error && <span className={S.getErrorMessageClasses()}>{error}</span>}
    </div>
  );
}

