import React, { FC } from "react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import * as S from "./styles";

export interface LoginProps {
  onSubmit: (username: string, password: string) => void;
  loading?: boolean;
  error?: string | null;
}

export const LoginPage: FC<LoginProps> = ({ onSubmit, loading, error }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <div className={S.getContainerClasses()}>
      <div className={S.getCardClasses()}>
        <h1 className={S.getTitleClasses()}>Sistema Bancário</h1>
        <p className={S.getSubtitleClasses()}>Faça login para continuar</p>
        <form className={S.getFormClasses()} onSubmit={handleSubmit}>
          <Input
            label="Usuário"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            required
            autoFocus
          />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin"
            required
          />
          {error && <div className={S.getErrorMessageClasses()}>{error}</div>}
          <Button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
};
