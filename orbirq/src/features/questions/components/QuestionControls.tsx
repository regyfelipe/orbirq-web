import { useState } from "react";
import { Button } from "../../../shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../shared/components/ui/dialog";
import { Badge } from "../../../shared/components/ui/badge";
import { RotateCcw, AlertTriangle, CheckCircle } from "lucide-react";
import { useAuth } from "../../auth/services/AuthContext";

interface QuestionControlsProps {
  onResetAll: () => void;
  hasAnsweredQuestions: boolean;
  answeredCount: number;
  totalCount: number;
}

export default function QuestionControls({
  onResetAll,
  hasAnsweredQuestions,
  answeredCount,
  totalCount
}: QuestionControlsProps) {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { usuario } = useAuth();

  // Debug logs removidos para produção

  const handleResetAll = async () => {
    if (!usuario?.id) return;

    setIsResetting(true);
    try {
      await onResetAll();
      setShowResetDialog(false);
    } catch (error) {
      console.error('Erro ao resetar questões:', error);
    } finally {
      setIsResetting(false);
    }
  };

  // Mostrar controles se houver questões na página e usuário logado
  if (totalCount === 0 || !usuario?.id) {
    return null;
  }

  return (
    <>
      {/* Barra de Controle Fixa no Topo */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Status das Questões */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-medium">
                  <CheckCircle size={14} className="mr-1 text-green-600" />
                  {answeredCount}/{totalCount} Respondidas
                </Badge>
              </div>

              {hasAnsweredQuestions && (
                <div className="text-sm text-gray-600">
                  💡 Você pode praticar novamente resetando as questões
                </div>
              )}
            </div>

            {/* Botão de Reset */}
            <Button
              onClick={() => setShowResetDialog(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors"
            >
              <RotateCcw size={16} />
              Reset Questões
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={20} />
              Resetar Questões Respondidas
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2">
                <div>
                  Esta ação irá limpar todas as respostas das questões nesta página,
                  permitindo que você pratique novamente.
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                  <div className="text-sm text-amber-800 font-medium">
                    ⚠️ Atenção: Esta ação não pode ser desfeita
                  </div>
                  <div className="text-sm text-amber-700 mt-1">
                    Suas respostas anteriores serão mantidas no histórico do dashboard
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowResetDialog(false)}
              disabled={isResetting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleResetAll}
              disabled={isResetting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isResetting ? (
                <>
                  <RotateCcw size={16} className="mr-2 animate-spin" />
                  Resetando...
                </>
              ) : (
                <>
                  <RotateCcw size={16} className="mr-2" />
                  Confirmar Reset
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}