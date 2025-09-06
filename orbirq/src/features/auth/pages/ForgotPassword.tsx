import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function ForgotPassword() {
  return (
    <AuthLayout title="Recuperar senha">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="Digite seu e-mail" />
        </div>

        <Button className="w-full">Enviar link de recuperação</Button>

        <p className="text-center text-sm text-gray-600">
          Lembrou a senha?{" "}
          <Link to="/login" className="hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
