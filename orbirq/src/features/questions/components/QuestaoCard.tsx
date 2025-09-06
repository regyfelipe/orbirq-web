import { useState, useEffect } from "react";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Badge } from "../../../shared/components/ui/badge";
import { Button } from "../../../shared/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../../../shared/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "../../../shared/components/ui/tabs";
import { Dialog, DialogContent } from "../../../shared/components/ui/dialog";
import { ZoomIn } from "lucide-react";

import { BookOpen, MessageSquare, Link, BarChart2, PlayCircle } from "lucide-react";
import { useAuth } from "../../auth/services/AuthContext";
import type { Questao } from "../services/questoes";
import TextoExpandivel from "../../../shared/components/ui/textoExpandivel";
import { responderQuestao, verificarRespostaAnterior } from "../services/respostas";
import ExplicacaoTab from "./ExplicacaoTab";
import FeedbackTab from "./FeedbackTab";
import ReferenciasTab from "./ReferenciasTab";
import AnalyticsTab from "./AnalyticsTab";
import VideosTab from "./VideosTab";
import { TabsContent } from "../../../shared/components/ui/tabs";

export default function QuestaoCard({
  questao,
  onQuestionAnswered,
  forceReset
}: {
  questao: Questao;
  onQuestionAnswered?: (questionId: string) => void;
  forceReset?: number;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [respondida, setRespondida] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [respostaAnterior, setRespostaAnterior] = useState<{
    id: string;
    questaoId: string;
    opcaoEscolhida: string;
    correta: boolean;
    tentativa: number;
    dataResposta: string;
  } | null>(null);

  const { usuario } = useAuth();
  const alunoId = usuario?.id ?? "";
  const isLoggedIn = !!usuario?.id && usuario.id !== "";

  // Reset forçado quando forceReset muda (prioridade alta)
  useEffect(() => {
    if (forceReset && forceReset > 0) {
      setRespondida(false);
      setRespostaAnterior(null);
      setSelected(null);
    }
  }, [forceReset]);

  // Verificar se o usuário já respondeu esta questão (só se não foi resetado)
  useEffect(() => {
    const verificarResposta = async () => {
      // Só verifica se o usuário estiver logado e o ID for válido
      if (!alunoId || alunoId === "" || !questao.id) {
        return;
      }

      // Não verifica resposta se foi resetado recentemente
      if (forceReset && forceReset > 0) {
        return;
      }

      try {
        const resposta = await verificarRespostaAnterior(alunoId, questao.id);
        if (resposta) {
          setRespostaAnterior(resposta);
          setSelected(resposta.opcaoEscolhida);
          setRespondida(true);
        } else {
          // Se não há resposta anterior, limpar o estado
          setRespostaAnterior(null);
          setSelected(null);
          setRespondida(false);
        }
      } catch (error) {
        // Se for erro 404 (resposta não encontrada), é normal após reset
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
          setRespostaAnterior(null);
          setSelected(null);
          setRespondida(false);
        } else {
          console.warn('Erro ao verificar resposta anterior:', error);
        }
      }
    };

    verificarResposta();
  }, [alunoId, questao.id, forceReset]);

  const acertou = selected === (questao.resposta_correta || "");

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <CardContent className="space-y-6">
        {/* Metadados */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs">
            <Badge variant="outline" className="font-medium">
              <span className="text-gray-500 mr-1">Disciplina:</span>{" "}
              {questao.disciplina || "Não informado"}
            </Badge>

            <Badge className="bg-red-100 text-red-700 border border-red-200">
              <span className="text-gray-500 mr-1">Matéria:</span>{" "}
              {questao.materia || "Não informado"}
            </Badge>

            <Badge variant="secondary">
              <span className="text-gray-500 mr-1">Assunto:</span>{" "}
              {questao.assunto || "Não informado"}
            </Badge>

            <Badge className="bg-gray-100 text-gray-700 border">
              <span className="text-gray-500 mr-1">Banca:</span>{" "}
              {questao.banca || "Não informado"}
            </Badge>

            <Badge className="bg-gray-100 text-gray-700 border">
              <span className="text-gray-500 mr-1">Ano:</span> {questao.ano || "Não informado"}
            </Badge>

            <Badge className="bg-gray-100 text-gray-700 border">
              <span className="text-gray-500 mr-1">Instituição:</span>{" "}
              {questao.instituicao || "Não informado"}
            </Badge>

            {questao.inedita && (
              <Badge className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-sm">
                Inédita
              </Badge>
            )}
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[11px] sm:text-xs text-gray-500">
            <div>
              <dt className="inline font-medium text-gray-600">Autor: </dt>
              <dd className="inline">{questao.autoria?.principal || "Não informado"}</dd>
            </div>
            <div>
              <dt className="inline font-medium text-gray-600">Criada em: </dt>
              <dd className="inline">
                {questao.data_criacao ? new Date(questao.data_criacao).toLocaleDateString() : "Não informado"}
              </dd>
            </div>
          </dl>
        </div>

        {questao.imagem_url && (
          <div className="relative">
            <img
              src={questao.imagem_url}
              alt="Imagem da questão"
              className="max-h-48 w-full object-contain rounded-lg shadow cursor-zoom-in"
              onClick={() => setOpenImage(true)}
            />
            <button
              onClick={() => setOpenImage(true)}
              className="absolute bottom-2 right-2 bg-black/60 p-1.5 rounded-full text-white hover:bg-black/80 transition"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        )}

        {/* Modal com zoom */}
        <Dialog open={openImage} onOpenChange={setOpenImage}>
          <DialogContent className="max-w-5xl p-0 bg-transparent border-none shadow-none">
            <div className="flex items-center justify-center">
              <img
                src={questao.imagem_url ?? undefined}
                alt="Imagem expandida"
                className="max-h-[80vh] w-auto object-contain rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Enunciado */}
        <TextoExpandivel texto={questao.texto || ""} limite={250} />

        <h2 className="text-base sm:text-lg font-semibold">{questao.pergunta || ""}</h2>

        {/* Alternativas */}
        <div className="space-y-3">
          {questao.opcoes?.map((op: { id: string; texto: string }, idx: number) => {
            const letra = String.fromCharCode(65 + idx);
            const isSelected = selected === op.id;
            const isCorrect = op.id === (questao.resposta_correta || "");
            const isUserChoice = respostaAnterior?.opcaoEscolhida === op.id;

            return (
              <label
                key={op.id}
                className={`flex items-start gap-3 p-3 border rounded-xl transition-all
                  ${respondida && respostaAnterior ? (
                    // Quando já respondida
                    isCorrect
                      ? "border-green-600 bg-green-50"
                      : isUserChoice && !isCorrect
                      ? "border-red-600 bg-red-50"
                      : "border-gray-200 bg-gray-50 opacity-60"
                  ) : (
                    // Quando não respondida
                    isSelected ? "border-teal-600 bg-teal-50" : "border-gray-200 hover:bg-gray-50 cursor-pointer"
                  )}`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-semibold
                    ${respondida && respostaAnterior ? (
                      // Quando já respondida
                      isCorrect
                        ? "bg-green-600 text-white border-green-600"
                        : isUserChoice && !isCorrect
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-neutral-100 border-neutral-200 text-gray-700"
                    ) : (
                      // Quando não respondida
                      isSelected
                        ? "bg-teal-600 text-white border-teal-600"
                        : "bg-neutral-100 border-neutral-200 text-gray-700"
                    )}`}
                >
                  {letra}
                  {respondida && respostaAnterior && isUserChoice && (
                    <span className="ml-1 text-xs">
                      {isCorrect ? "✓" : "✗"}
                    </span>
                  )}
                </span>

                <input
                  type="radio"
                  name={`opcao-${questao.id}`}
                  value={op.id}
                  checked={isSelected}
                  onChange={() => !respondida && setSelected(op.id)}
                  disabled={respondida && !!respostaAnterior}
                  className="hidden"
                />
                <span className={`flex-1 text-sm leading-relaxed ${
                  respondida && respostaAnterior ? "text-gray-700" : "text-gray-800"
                }`}>
                  {op.texto}
                </span>
              </label>
            );
          })}
        </div>

        {respondida && respostaAnterior ? (
          <div className="space-y-3">
            {/* Histórico da resposta anterior */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                {respostaAnterior.correta ? (
                  <span className="text-green-600 text-sm">✅</span>
                ) : (
                  <span className="text-red-600 text-sm">❌</span>
                )}
                <span className="text-sm font-medium text-gray-700">
                  Última resposta: {respostaAnterior.correta ? "Correta" : "Incorreta"}
                </span>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {new Date(respostaAnterior.dataResposta).toLocaleDateString('pt-BR')}
              </p>
            </div>

            {/* Indicador para tentar novamente */}
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                💡 Use o botão "🔄 Reset Questões" na barra superior para tentar novamente
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Histórico da resposta anterior (sempre mostrar se existir) */}
            {respostaAnterior && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-blue-600 text-sm">📚</span>
                  <span className="text-sm font-medium text-blue-700">
                    Última tentativa: {respostaAnterior.correta ? "Correta" : "Incorreta"}
                  </span>
                </div>
                <p className="text-xs text-blue-600 text-center">
                  {new Date(respostaAnterior.dataResposta).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}

            {/* Botão de resposta ou aviso de login */}
            {!isLoggedIn ? (
              <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium">
                  🔐 Faça login para responder questões e ganhar conquistas!
                </p>
              </div>
            ) : (
              <Button
                onClick={async () => {
                  if (!selected) return;

                  try {
                    // monta os dados
                    const resposta = {
                      alunoId,
                      questaoId: questao.id,
                      opcaoEscolhida: selected,
                      correta: selected === (questao.resposta_correta || ""),
                      tempoRespostaSegundos: 10, // 👈 depois podemos medir de verdade
                    };

                    // salva no backend
                    await responderQuestao(resposta);

                    setRespondida(true);

                    // Atualizar resposta anterior após salvar
                    setRespostaAnterior({
                      id: `temp-${Date.now()}`, // ID temporário
                      questaoId: questao.id,
                      opcaoEscolhida: selected,
                      correta: selected === (questao.resposta_correta || ""),
                      tentativa: 1,
                      dataResposta: new Date().toISOString()
                    });

                    // Notificar componente pai que a questão foi respondida
                    onQuestionAnswered?.(questao.id);

                  } catch (err) {
                    console.error("Erro ao salvar resposta:", err);
                  }
                }}
                disabled={!selected || respondida}
                className="w-full sm:w-auto"
              >
                Responder
              </Button>
            )}
          </div>
        )}

        {/* Feedback de resposta */}
        {respondida && (
          <Alert variant={acertou ? "default" : "destructive"}>
            <AlertTitle>{acertou ? "🎉 Acertou!" : "❌ Errou"}</AlertTitle>
            <AlertDescription>
              A resposta correta é <strong>{questao.resposta_correta || "Não informado"}</strong>
            </AlertDescription>
          </Alert>
        )}

        {/* Abas extras */}
        {respondida && (
          <Tabs defaultValue="explicacao" className="w-full mt-6">
            <TabsList
              className="
                flex w-full gap-2 sm:gap-3
                rounded-xl sm:rounded-2xl
                bg-black p-1.5 sm:p-2
                shadow-inner backdrop-blur-md
                overflow-x-auto no-scrollbar
              "
            >
              <TabsTrigger
                key="explicacao"
                value="explicacao"
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium
                  text-white hover:text-gray-900 hover:bg-gray-200/60
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500
                  data-[state=active]:text-white shadow-sm transition-all
                  whitespace-nowrap text-xs sm:text-sm
                "
              >
                <BookOpen size={16} />
                <span className="hidden sm:inline">Explicação</span>
              </TabsTrigger>

              <TabsTrigger
                key="feedback"
                value="feedback"
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium
                  text-white hover:text-gray-900 hover:bg-gray-200/60
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500
                  data-[state=active]:text-white shadow-sm transition-all
                  whitespace-nowrap text-xs sm:text-sm
                "
              >
                <MessageSquare size={16} />
                <span className="hidden sm:inline">Feedback</span>
              </TabsTrigger>

              <TabsTrigger
                key="referencias"
                value="referencias"
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium
                  text-white hover:text-gray-900 hover:bg-gray-200/60
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500
                  data-[state=active]:text-white shadow-sm transition-all
                  whitespace-nowrap text-xs sm:text-sm
                "
              >
                <Link size={16} />
                <span className="hidden sm:inline">Referências</span>
              </TabsTrigger>

              <TabsTrigger
                key="analytics"
                value="analytics"
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium
                  text-white hover:text-gray-900 hover:bg-gray-200/60
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-yellow-500
                  data-[state=active]:text-white shadow-sm transition-all
                  whitespace-nowrap text-xs sm:text-sm
                "
              >
                <BarChart2 size={16} />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>

              <TabsTrigger
                key="videos"
                value="videos"
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium
                  text-white hover:text-gray-900 hover:bg-gray-200/60
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500
                  data-[state=active]:text-white shadow-sm transition-all
                  whitespace-nowrap text-xs sm:text-sm
                "
              >
                <PlayCircle size={16} />
                <span className="hidden sm:inline">Vídeos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="explicacao">
              <ExplicacaoTab explicacao={questao.explicacao} />
            </TabsContent>

            <TabsContent value="feedback">
              <FeedbackTab questaoId={questao.id} alunoId={alunoId} />
            </TabsContent>

            <TabsContent value="referencias">
              <ReferenciasTab referencias={questao.referencias} />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsTab estatisticas={questao.estatisticas} />
            </TabsContent>

            <TabsContent value="videos">
              <VideosTab links={questao.links_videos} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
