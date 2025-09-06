import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import BancaField from "../components/BancaField";
import GenericSearchField from "../components/GenericSearchField";
import MediaUploader from "../components/MediaUploader";
import { useAuth } from "../../auth/services/AuthContext";
import {
  FileText,
  Plus,
  X,
  Save,
  Eye,
  EyeOff,
  Video,
  BookOpen,
  Target,
} from "lucide-react";

interface Alternativa {
  id: string;
  texto: string;
}

interface QuestaoData {
  titulo: string;
  texto: string;
  pergunta: string;
  disciplina: string;
  materia: string;
  assunto: string;
  banca: string;
  ano: number;
  instituicao: string;
  inedita: boolean;
  tipo: string;
  opcoes: Alternativa[];
  resposta_correta: string;
  objetivos_aprendizagem: string[];
  explicacao: string;
  referencias: string[];
  links_videos: string[];
  nivel_dificuldade: string;
  tags: string[];
  palavras_chave: string[];
  imagem_url?: string;
  descricao_imagem?: string;
  visibilidade: string;
  plano_disponibilidade: string[];
}

export default function CriarQuestaoPage() {
  const { usuario } = useAuth();

  // Estado principal da questão
  const [questao, setQuestao] = useState<QuestaoData>({
    titulo: "",
    texto: "",
    pergunta: "",
    disciplina: "",
    materia: "",
    assunto: "",
    banca: "",
    ano: new Date().getFullYear(),
    instituicao: "",
    inedita: true,
    tipo: "multipla_escolha",
    opcoes: [
      { id: "A", texto: "" },
      { id: "B", texto: "" },
      { id: "C", texto: "" },
      { id: "D", texto: "" },
    ],
    resposta_correta: "",
    objetivos_aprendizagem: [],
    explicacao: "",
    referencias: [],
    links_videos: [],
    nivel_dificuldade: "medio",
    tags: [],
    palavras_chave: [],
    visibilidade: "privada",
    plano_disponibilidade: ["free"],
  });

  // Estados auxiliares
  const [novaObjetivo, setNovaObjetivo] = useState("");
  const [novaReferencia, setNovaReferencia] = useState("");
  const [novoVideo, setNovoVideo] = useState("");
  const [novaPalavraChave, setNovaPalavraChave] = useState("");
  const [novaTag, setNovaTag] = useState("");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // Funções auxiliares
  const updateQuestao = useCallback((field: keyof QuestaoData, value: QuestaoData[keyof QuestaoData]) => {
    setQuestao((prev) => ({ ...prev, [field]: value }));
  }, []);

  const adicionarObjetivo = () => {
    if (novaObjetivo.trim()) {
      updateQuestao("objetivos_aprendizagem", [
        ...questao.objetivos_aprendizagem,
        novaObjetivo.trim(),
      ]);
      setNovaObjetivo("");
    }
  };

  const removerObjetivo = (index: number) => {
    updateQuestao(
      "objetivos_aprendizagem",
      questao.objetivos_aprendizagem.filter((_, i) => i !== index)
    );
  };

  const adicionarReferencia = () => {
    if (novaReferencia.trim()) {
      updateQuestao("referencias", [
        ...questao.referencias,
        novaReferencia.trim(),
      ]);
      setNovaReferencia("");
    }
  };

  const removerReferencia = (index: number) => {
    updateQuestao(
      "referencias",
      questao.referencias.filter((_, i) => i !== index)
    );
  };

  const adicionarVideo = () => {
    if (novoVideo.trim()) {
      updateQuestao("links_videos", [
        ...questao.links_videos,
        novoVideo.trim(),
      ]);
      setNovoVideo("");
    }
  };

  const removerVideo = (index: number) => {
    updateQuestao(
      "links_videos",
      questao.links_videos.filter((_, i) => i !== index)
    );
  };

  const adicionarPalavraChave = () => {
    if (
      novaPalavraChave.trim() &&
      !questao.palavras_chave.includes(novaPalavraChave.trim())
    ) {
      updateQuestao("palavras_chave", [
        ...questao.palavras_chave,
        novaPalavraChave.trim(),
      ]);
      setNovaPalavraChave("");
    }
  };

  const removerPalavraChave = (palavra: string) => {
    updateQuestao(
      "palavras_chave",
      questao.palavras_chave.filter((p) => p !== palavra)
    );
  };

  const adicionarTag = () => {
    if (novaTag.trim() && !questao.tags.includes(novaTag.trim())) {
      updateQuestao("tags", [...questao.tags, novaTag.trim()]);
      setNovaTag("");
    }
  };

  const removerTag = (tag: string) => {
    updateQuestao(
      "tags",
      questao.tags.filter((t) => t !== tag)
    );
  };

  const atualizarOpcao = (id: string, texto: string) => {
    updateQuestao(
      "opcoes",
      questao.opcoes.map((op) => (op.id === id ? { ...op, texto } : op))
    );
  };

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    const timer = setTimeout(() => {
      // Auto-save logic here (could save to localStorage or draft API)
      console.log("Auto-saving draft...");
      localStorage.setItem("questaoDraft", JSON.stringify(questao));
    }, 2000); // Auto-save after 2 seconds of inactivity
    setAutoSaveTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [questao]);

  // Load draft on component mount
  useEffect(() => {
    const draft = localStorage.getItem("questaoDraft");
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        setQuestao(parsedDraft);
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, []);

  const salvarQuestao = async () => {
    try {
      setLoading(true);

      // Preparar dados para envio
      const usuarioAtual = usuario ? {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        username: usuario.username
      } : null;

      const dadosEnvio = {
        ...questao,
        id: `q${Date.now()}`, // Gerar ID único
        status: "ativo",
        versao: 1,
        autoria: {
          principal: usuarioAtual?.nome || usuarioAtual?.username || usuarioAtual?.email || "Professor(a)",
          revisores: [],
        },
        // Incluir informações do usuário para o backend
        usuarioAtual,
        data_criacao: new Date().toISOString(),
        ultima_atualizacao: new Date().toISOString(),
        estatisticas: {
          vezesRespondida: 0,
          taxaAcerto: 0,
          tempoMedioRespostaSegundos: 0,
          rating: 0,
          feedbackAlunos: [],
          taxaErroPorOpcao: {},
        },
        licenca_uso: "premium",
        custo_criacao: 5.0,
        schema_version: 2,
        monetizacao: {
          modelo: "assinatura",
          valor_por_acesso: 0.0,
        },
        protecao: {
          hash: null,
          assinatura_digital: null,
        },
        gamificacao: {
          xp: 0,
          medalha: null,
        },
        ia: {
          gerado_por: "humano",
          dicas: [],
        },
      };

      console.log("Salvando questão:", dadosEnvio);

      // Fazer chamada da API
      const response = await fetch("http://localhost:3000/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosEnvio),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar questão no servidor");
      }

      const savedQuestion = await response.json();
      console.log("Questão salva com sucesso:", savedQuestion);

      // Resetar campos após salvar, mantendo apenas os campos acadêmicos
      setQuestao(prev => ({
        ...prev,
        titulo: "",
        texto: "",
        pergunta: "",
        inedita: true,
        tipo: "multipla_escolha",
        opcoes: [
          { id: "A", texto: "" },
          { id: "B", texto: "" },
          { id: "C", texto: "" },
          { id: "D", texto: "" },
        ],
        resposta_correta: "",
        objetivos_aprendizagem: [],
        explicacao: "",
        referencias: [],
        links_videos: [],
        nivel_dificuldade: "medio",
        tags: [],
        palavras_chave: [],
        imagem_url: "",
        descricao_imagem: "",
        visibilidade: "privada",
        plano_disponibilidade: ["free"],
      }));

      // Limpar estados auxiliares
      setNovaObjetivo("");
      setNovaReferencia("");
      setNovoVideo("");
      setNovaPalavraChave("");
      setNovaTag("");

      alert("Questão salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar questão:", error);
      alert("Erro ao salvar questão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Criar Nova Questão
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreview(!preview)}>
            {preview ? (
              <EyeOff className="w-4 h-4 mr-2" />
            ) : (
              <Eye className="w-4 h-4 mr-2" />
            )}
            {preview ? "Editar" : "Preview"}
          </Button>
          <Button onClick={salvarQuestao} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Salvando..." : "Salvar Questão"}
          </Button>
        </div>
      </div>

      {!preview ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <GenericSearchField
                    label="Disciplina"
                    fieldName="disciplina"
                    questao={questao}
                    updateQuestao={updateQuestao}
                    apiEndpoint="disciplinas"
                    required={true}
                  />

                  <GenericSearchField
                    label="Matéria"
                    fieldName="materia"
                    questao={questao}
                    updateQuestao={updateQuestao}
                    apiEndpoint="materias"
                  />
                </div>

                <GenericSearchField
                  label="Assunto"
                  fieldName="assunto"
                  questao={questao}
                  updateQuestao={updateQuestao}
                  apiEndpoint="assuntos"
                />

                <div className="grid grid-cols-3 gap-4">
                  <BancaField questao={questao} updateQuestao={updateQuestao} />

                  <div>
                    <Label htmlFor="ano">Ano</Label>
                    <Input
                      id="ano"
                      type="number"
                      value={questao.ano}
                      onChange={(e) =>
                        updateQuestao(
                          "ano",
                          parseInt(e.target.value) || new Date().getFullYear()
                        )
                      }
                      placeholder="2023"
                    />
                  </div>

                  <GenericSearchField
                    label="Instituição"
                    fieldName="instituicao"
                    questao={questao}
                    updateQuestao={updateQuestao}
                    apiEndpoint="instituicoes"
                  />
                </div>

                <div>
                  <Label htmlFor="texto">Texto/Enunciado *</Label>
                  <Textarea
                    id="texto"
                    value={questao.texto}
                    onChange={(e) => updateQuestao("texto", e.target.value)}
                    placeholder="Digite o enunciado completo da questão"
                    rows={4}
                  />
                </div>

               {/* <div>
  <Label htmlFor="titulo">Título da Questão *</Label>
  <Input
    id="titulo"
    value={questao.titulo}
    onChange={(e) => updateQuestao("titulo", e.target.value)}
    placeholder="Ex: Ciclo do Ouro – Derrama"
  />
</div> */}

<div>
  <Label htmlFor="pergunta">Enunciado da Questão *</Label>
  <Textarea
    id="pergunta"
    value={questao.pergunta}
    onChange={(e) => updateQuestao("pergunta", e.target.value)}
    placeholder="Digite o enunciado completo que será apresentado ao aluno"
  />
</div>


                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inedita"
                    checked={questao.inedita}
                    onCheckedChange={(checked) =>
                      updateQuestao("inedita", checked)
                    }
                  />
                  <Label htmlFor="inedita">
                    Questão inédita (não publicada anteriormente)
                  </Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo">Tipo de Questão *</Label>
                    <Select
                      value={questao.tipo}
                      onValueChange={(value) => updateQuestao("tipo", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multipla_escolha">
                          Múltipla Escolha
                        </SelectItem>
                        <SelectItem value="verdadeiro_falso">
                          Verdadeiro/Falso
                        </SelectItem>
                        <SelectItem value="aberta">Resposta Aberta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="nivel_dificuldade">
                      Nível de Dificuldade *
                    </Label>
                    <Select
                      value={questao.nivel_dificuldade}
                      onValueChange={(value) =>
                        updateQuestao("nivel_dificuldade", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facil">Fácil</SelectItem>
                        <SelectItem value="medio">Médio</SelectItem>
                        <SelectItem value="dificil">Difícil</SelectItem>
                        <SelectItem value="muito_dificil">
                          Muito Difícil
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alternativas ou Resposta */}
            {questao.tipo === "multipla_escolha" && (
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Alternativas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {questao.opcoes.map((opcao, index) => (
                    <div key={opcao.id} className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <Input
                        value={opcao.texto}
                        onChange={(e) =>
                          atualizarOpcao(opcao.id, e.target.value)
                        }
                        placeholder={`Alternativa ${String.fromCharCode(
                          65 + index
                        )}`}
                        className="flex-1"
                      />
                      <input
                        type="radio"
                        name="correta"
                        checked={questao.resposta_correta === opcao.id}
                        onChange={() =>
                          updateQuestao("resposta_correta", opcao.id)
                        }
                        className="w-4 h-4"
                      />
                      <Label className="text-sm">Correta</Label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {questao.tipo === "verdadeiro_falso" && (
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Resposta Correta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="vf"
                        checked={questao.resposta_correta === "V"}
                        onChange={() => updateQuestao("resposta_correta", "V")}
                        className="w-4 h-4"
                      />
                      <span>Verdadeiro</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="vf"
                        checked={questao.resposta_correta === "F"}
                        onChange={() => updateQuestao("resposta_correta", "F")}
                        className="w-4 h-4"
                      />
                      <span>Falso</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            )}

            {questao.tipo === "aberta" && (
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Resposta Esperada</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={questao.explicacao}
                    onChange={(e) =>
                      updateQuestao("explicacao", e.target.value)
                    }
                    placeholder="Digite a resposta esperada para esta questão aberta"
                    rows={3}
                  />
                </CardContent>
              </Card>
            )}

            {/* Explicação e Referências */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Explicação e Referências</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="explicacao">Explicação da Resposta</Label>
                  <Textarea
                    id="explicacao"
                    value={questao.explicacao}
                    onChange={(e) =>
                      updateQuestao("explicacao", e.target.value)
                    }
                    placeholder="Explique detalhadamente a resposta correta"
                    rows={3}
                  />
                </div>

                {/* Objetivos de Aprendizagem */}
                <div>
                  <Label>Objetivos de Aprendizagem</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={novaObjetivo}
                      onChange={(e) => setNovaObjetivo(e.target.value)}
                      placeholder="Ex: Identificar o papel das cidades..."
                      onKeyPress={(e) =>
                        e.key === "Enter" && adicionarObjetivo()
                      }
                    />
                    <Button onClick={adicionarObjetivo} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {questao.objetivos_aprendizagem.map((objetivo, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                      >
                        {objetivo}
                        <X
                          className="w-3 h-3 ml-1"
                          onClick={() => removerObjetivo(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Referências */}
                <div>
                  <Label>Referências</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={novaReferencia}
                      onChange={(e) => setNovaReferencia(e.target.value)}
                      placeholder="Ex: FAUSTO, Boris. História do Brasil."
                      onKeyPress={(e) =>
                        e.key === "Enter" && adicionarReferencia()
                      }
                    />
                    <Button onClick={adicionarReferencia} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {questao.referencias.map((referencia, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-muted rounded"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span className="flex-1">{referencia}</span>
                        <X
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => removerReferencia(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Links de Vídeos */}
                <div>
                  <Label>Links de Vídeos</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={novoVideo}
                      onChange={(e) => setNovoVideo(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      onKeyPress={(e) => e.key === "Enter" && adicionarVideo()}
                    />
                    <Button onClick={adicionarVideo} size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {questao.links_videos.map((video, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-muted rounded"
                      >
                        <Video className="w-4 h-4" />
                        <span className="flex-1">{video}</span>
                        <X
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => removerVideo(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags e Palavras-chave */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Tags e Palavras-chave</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tags */}
                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={novaTag}
                      onChange={(e) => setNovaTag(e.target.value)}
                      placeholder="Ex: história, brasil colônia"
                      onKeyPress={(e) => e.key === "Enter" && adicionarTag()}
                    />
                    <Button onClick={adicionarTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {questao.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                      >
                        {tag}
                        <X
                          className="w-3 h-3 ml-1"
                          onClick={() => removerTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Palavras-chave */}
                <div>
                  <Label>Palavras-chave</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={novaPalavraChave}
                      onChange={(e) => setNovaPalavraChave(e.target.value)}
                      placeholder="Ex: mineração, século XVIII"
                      onKeyPress={(e) =>
                        e.key === "Enter" && adicionarPalavraChave()
                      }
                    />
                    <Button onClick={adicionarPalavraChave} size="sm">
                      <Target className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {questao.palavras_chave.map((palavra) => (
                      <Badge
                        key={palavra}
                        variant="outline"
                        className="cursor-pointer"
                      >
                        {palavra}
                        <X
                          className="w-3 h-3 ml-1"
                          onClick={() => removerPalavraChave(palavra)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mídia */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Mídia da Questão</CardTitle>
              </CardHeader>
              <CardContent>
                <MediaUploader updateQuestao={updateQuestao} />
              </CardContent>
            </Card>

            {/* Estatísticas e Configurações */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Estatísticas e Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Caracteres no texto:</span>
                    <span>{questao.texto.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alternativas:</span>
                    <span>{questao.opcoes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tags:</span>
                    <span>{questao.tags.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Palavras-chave:</span>
                    <span>{questao.palavras_chave.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Objetivos:</span>
                    <span>{questao.objetivos_aprendizagem.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Referências:</span>
                    <span>{questao.referencias.length}</span>
                  </div>
                </div>

                {/* Configurações de Visibilidade */}
                <div className="border-t pt-4">
                  <Label className="text-base font-medium">
                    Configurações de Visibilidade
                  </Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="visibilidade">Visibilidade</Label>
                      <Select
                        value={questao.visibilidade}
                        onValueChange={(value) =>
                          updateQuestao("visibilidade", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="publica">Pública</SelectItem>
                          <SelectItem value="privada">Privada</SelectItem>
                          <SelectItem value="restrita">Restrita</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Planos de Disponibilidade</Label>
                      <div className="flex gap-2 mt-2">
                        {["free", "school", "premium"].map((plano) => (
                          <label
                            key={plano}
                            className="flex items-center gap-1"
                          >
                            <input
                              type="checkbox"
                              checked={questao.plano_disponibilidade.includes(
                                plano
                              )}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                updateQuestao(
                                  "plano_disponibilidade",
                                  checked
                                    ? [...questao.plano_disponibilidade, plano]
                                    : questao.plano_disponibilidade.filter(
                                        (p) => p !== plano
                                      )
                                );
                              }}
                              className="w-4 h-4"
                            />
                            <span className="text-sm capitalize">{plano}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Preview Mode */
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Preview da Questão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              {/* Imagem da questão */}
              {questao.imagem_url && (
                <div className="mb-4">
                  <img
                    src={questao.imagem_url}
                    alt={questao.descricao_imagem || "Imagem da questão"}
                    className="max-w-full h-auto rounded-lg border"
                  />
                  {questao.descricao_imagem && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {questao.descricao_imagem}
                    </p>
                  )}
                </div>
              )}

              {/* Texto da questão */}
              <p className="text-muted-foreground mb-4">
                {questao.texto || "Texto da questão aparecerá aqui..."}
              </p>

              {/* Pergunta específica */}
              {questao.pergunta && (
                <p className="font-medium text-blue-600 mb-4">
                  {questao.pergunta}
                </p>
              )}

              {questao.tipo === "multipla_escolha" && (
                <div className="space-y-2">
                  {questao.opcoes.map((opcao, index) => (
                    <div key={opcao.id} className="flex items-center gap-3">
                      <span className="w-6 h-6 border rounded-full flex items-center justify-center text-xs">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span
                        className={
                          questao.resposta_correta === opcao.id
                            ? "font-medium text-green-600"
                            : ""
                        }
                      >
                        {opcao.texto ||
                          `Alternativa ${String.fromCharCode(65 + index)}`}
                        {questao.resposta_correta === opcao.id && " ✓"}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {questao.tipo === "verdadeiro_falso" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 border rounded-full flex items-center justify-center text-xs">
                      V
                    </span>
                    <span
                      className={
                        questao.resposta_correta === "V"
                          ? "font-medium text-green-600"
                          : ""
                      }
                    >
                      Verdadeiro
                      {questao.resposta_correta === "V" && " ✓"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 border rounded-full flex items-center justify-center text-xs">
                      F
                    </span>
                    <span
                      className={
                        questao.resposta_correta === "F"
                          ? "font-medium text-green-600"
                          : ""
                      }
                    >
                      Falso
                      {questao.resposta_correta === "F" && " ✓"}
                    </span>
                  </div>
                </div>
              )}

              {questao.tipo === "aberta" && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {questao.explicacao ||
                      "Resposta esperada aparecerá aqui..."}
                  </p>
                </div>
              )}

              {questao.explicacao && questao.tipo !== "aberta" && (
                <Alert>
                  <AlertDescription>
                    <strong>Explicação:</strong> {questao.explicacao}
                  </AlertDescription>
                </Alert>
              )}

              {/* Metadados */}
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mt-4">
                <div>
                  <strong>Disciplina:</strong>{" "}
                  {questao.disciplina || "Não informado"}
                </div>
                <div>
                  <strong>Dificuldade:</strong>{" "}
                  {questao.nivel_dificuldade || "Não informado"}
                </div>
                <div>
                  <strong>Banca:</strong> {questao.banca || "Não informado"}
                </div>
                <div>
                  <strong>Ano:</strong> {questao.ano || "Não informado"}
                </div>
              </div>

              {questao.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {questao.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
