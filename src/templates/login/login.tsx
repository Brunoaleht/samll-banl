import React, { ChangeEvent, FC, FormEvent } from "react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import * as S from "./styles";

export interface LoginProps {
  username: string;
  password: string;
  onUsernameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  loading?: boolean;
}

export const LoginPage: FC<LoginProps> = ({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  loading,
}) => {
  return (
    <div className={S.getContainerClasses()}>
      <div className={S.getCardClasses()}>
        <h1 className={S.getTitleClasses()}>Sistema Bancário</h1>
        <p className={S.getSubtitleClasses()}>Faça login para continuar</p>

        <form className={S.getFormClasses()} onSubmit={onSubmit}>
          <Input
            label="Usuário"
            type="text"
            value={username}
            onChange={onUsernameChange}
            placeholder="username"
            required
            autoFocus
          />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={onPasswordChange}
            placeholder="password"
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
};
