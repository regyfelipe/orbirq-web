import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useNavigate } from "react-router-dom";
import { registerUser } from "@/features/users/services/usuarios";
import AuthLayout from "../components/AuthLayout";
import { AvatarUploader } from "../components/AvatarUploader";

type Role = "aluno" | "professor" | "administrador";

interface RegisterFormData {
  role?: Role;
  avatar?: string;
  nome?: string;
  username?: string;
  email?: string;
  senha?: string;
  confirmarSenha?: string;
  telefone?: string;
  genero?: "masculino" | "feminino" | "outro";
  dataNascimento?: string;
  pais?: string;
  estado?: string;
  cidade?: string;
  curso?: string;
  nivel?: string;
  instituicao?: string;
  turma?: string;
  bio?: string;
}

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleChange = <K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        role: formData.role!,
  nomeCompleto: formData.nome!,
  username: formData.username!,
  email: formData.email!,
  senha: formData.senha!, // aqui manda só a senha normal
  fotoPerfilUrl: formData.avatar || null,
  telefone: formData.telefone || null,
  genero: formData.genero || null,
  dataNascimento: formData.dataNascimento || null,
  pais: formData.pais!,
  estado: formData.estado!,
  cidade: formData.cidade!,
  curso: formData.curso || null,
  nivel: formData.nivel || null,
  instituicao: formData.instituicao || null,
  turma: formData.turma || null,
  bio: formData.bio || null,
      };

      const user = await registerUser(payload);
      console.log("Usuário cadastrado:", user);

      alert("✅ Cadastro realizado com sucesso!");
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Erro inesperado");
      }
    }
  };

  return (
    <AuthLayout title="Cadastro">
      <form className="space-y-6">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de usuário *</Label>
              <Select onValueChange={(v) => handleChange("role", v as Role)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aluno">Aluno</SelectItem>
                  <SelectItem value="professor">Professor</SelectItem>
                  <SelectItem value="administrador">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Avatar</Label>
              <AvatarUploader
                value={formData.avatar}
                onChange={(url) => handleChange("avatar", url)}
              />
            </div>

            <div className="space-y-2">
              <Label>Nome completo *</Label>
              <Input
                required
                placeholder="Seu nome completo"
                onChange={(e) => handleChange("nome", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Username *</Label>
              <Input
                required
                placeholder="Ex: joaop"
                onChange={(e) => handleChange("username", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                required
                placeholder="exemplo@email.com"
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Senha *</Label>
              <Input
                type="password"
                required
                placeholder="Crie uma senha"
                onChange={(e) => handleChange("senha", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Confirmar senha *</Label>
              <Input
                type="password"
                required
                placeholder="Repita a senha"
                onChange={(e) => handleChange("confirmarSenha", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                placeholder="+55 81 99999-0000"
                onChange={(e) => handleChange("telefone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Gênero</Label>
              <Select
                onValueChange={(v) =>
                  handleChange("genero", v as RegisterFormData["genero"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data de nascimento</Label>
              <Input
                type="date"
                onChange={(e) => handleChange("dataNascimento", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>País *</Label>
                <Input
                  required
                  onChange={(e) => handleChange("pais", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Estado *</Label>
                <Input
                  required
                  onChange={(e) => handleChange("estado", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Cidade *</Label>
                <Input
                  required
                  onChange={(e) => handleChange("cidade", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Curso</Label>
              <Input onChange={(e) => handleChange("curso", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Nível</Label>
              <Input onChange={(e) => handleChange("nivel", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Instituição</Label>
              <Input
                onChange={(e) => handleChange("instituicao", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Turma</Label>
              <Input onChange={(e) => handleChange("turma", e.target.value)} />
            </div>
          </div>
        )}

        {/* BOTÕES */}
        <div className="flex justify-between">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              Voltar
            </Button>
          )}

          {step < 4 ? (
            <Button type="button" onClick={nextStep}>
              Próximo
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={loading}>
              {loading ? "Cadastrando..." : "Finalizar Cadastro"}
            </Button>
          )}
        </div>
      </form>
    </AuthLayout>
  );
}
