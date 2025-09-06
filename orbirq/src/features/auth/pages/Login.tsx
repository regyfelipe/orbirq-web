import { useState } from "react";
import { Input } from "../../../shared/components/ui/input";
import { Button } from "../../../shared/components/ui/button";
import { Label } from "../../../shared/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";
import AuthLayout from "../components/AuthLayout";


export default function Login() {
  const [emailOrUser, setEmailOrUser] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    setLoading(true);
    try {
      const { token, usuario } = await loginUser(emailOrUser, password);
      
      // salvar no localStorage (ou context/state manager depois)
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      // redireciona para dashboard (ou outra rota privada)
      navigate("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Login">
      <div className="space-y-6 px-2 sm:px-6 max-w-md mx-auto w-full">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail ou Username</Label>
          <Input
            id="email"
            type="text"
            placeholder="Digite seu e-mail ou usuário"
            value={emailOrUser}
            onChange={(e) => setEmailOrUser(e.target.value)}
            className="text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-base"
          />
        </div>

        <Button
          className="w-full text-base py-2"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        <div className="flex flex-col sm:flex-row justify-between gap-3 text-sm text-gray-600 text-center sm:text-left">
          <Link to="/forgot-password" className="hover:underline">
            Esqueceu a senha?
          </Link>
          <Link to="/register" className="hover:underline">
            Criar conta
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
