import React, { FC } from "react";
import * as S from "./styles";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
}

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  children,
  className,
  ...props
}) => {
  return (
    <button className={S.getButtonClasses(variant, className)} {...props}>
      {children}
    </button>
  );
};
