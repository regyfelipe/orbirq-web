import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, User, Settings, LogOut, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import logo from "../../assets/logo.svg";
import Sidebar from "./Sidebar";

export default function Header() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  }

  return (
   <header className="flex items-center justify-between py-2 px-[30px] border-b bg-white shadow-sm relative">

      {/* Botão de menu que abre o Sidebar */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Centro: logo + boas-vindas */}
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <img src={logo} alt="Logo" className="h-8 mb-1" />
        <span className="text-sm text-muted-foreground">
          Bem-vindo,{" "}
          <span className="font-medium">{usuario?.nome || "Usuário"}</span>
        </span>
      </div>

      {/* Avatar + Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={usuario?.avatarUrl} alt={usuario?.nome} />
            <AvatarFallback>
              {usuario?.nome?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{usuario?.nome}</p>
              <p className="text-xs text-muted-foreground">{usuario?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/perfil")}>
            <User className="mr-2 h-4 w-4" /> Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/configuracoes")}>
            <Settings className="mr-2 h-4 w-4" /> Configurações
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sidebar com overlay */}
      {sidebarOpen && (
        <>
          {/* Overlay que fecha ao clicar fora */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar */}
          <Sidebar
            role={usuario?.role || "aluno"}
            onClose={() => setSidebarOpen(false)}
          />
        </>
      )}
    </header>
  );
}
