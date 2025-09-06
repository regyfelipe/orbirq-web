-- Create questoes table
CREATE TABLE IF NOT EXISTS questoes (
  id VARCHAR PRIMARY KEY,
  status VARCHAR DEFAULT 'ativo',
  versao INTEGER DEFAULT 1,

  -- Metadata
  disciplina VARCHAR,
  materia VARCHAR,
  assunto VARCHAR,
  banca VARCHAR,
  ano INTEGER,
  instituicao VARCHAR,
  inedita BOOLEAN DEFAULT true,
  autoria JSONB,
  data_criacao TIMESTAMP DEFAULT NOW(),
  ultima_atualizacao TIMESTAMP DEFAULT NOW(),

  -- Content
  titulo VARCHAR,
  texto TEXT,
  pergunta TEXT,
  tipo VARCHAR DEFAULT 'multipla_escolha',
  opcoes JSONB,
  resposta_correta VARCHAR,

  -- Educational content
  objetivos_aprendizagem JSONB DEFAULT '[]'::jsonb,
  explicacao TEXT,
  referencias JSONB DEFAULT '[]'::jsonb,
  links_videos JSONB DEFAULT '[]'::jsonb,

  -- Analytics and tags
  nivel_dificuldade VARCHAR DEFAULT 'medio',
  tags JSONB DEFAULT '[]'::jsonb,
  palavras_chave JSONB DEFAULT '[]'::jsonb,
  estatisticas JSONB DEFAULT '{
    "vezesRespondida": 0,
    "taxaAcerto": 0,
    "tempoMedioRespostaSegundos": 0,
    "rating": 0,
    "feedbackAlunos": [],
    "taxaErroPorOpcao": {}
  }'::jsonb,

  -- Media
  imagem_url VARCHAR,
  descricao_imagem TEXT,

  -- Business
  visibilidade VARCHAR DEFAULT 'privada',
  plano_disponibilidade JSONB DEFAULT '["free"]'::jsonb,
  licenca_uso VARCHAR DEFAULT 'premium',
  custo_criacao DECIMAL(10,2) DEFAULT 5.00,

  -- Technical
  schema_version INTEGER DEFAULT 2,
  monetizacao JSONB DEFAULT '{"modelo": "assinatura", "valor_por_acesso": 0.00}'::jsonb,
  protecao JSONB DEFAULT '{"hash": null, "assinatura_digital": null}'::jsonb,
  gamificacao JSONB DEFAULT '{"xp": 0, "medalha": null}'::jsonb,
  ia JSONB DEFAULT '{"gerado_por": "humano", "dicas": []}'::jsonb
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questoes_disciplina ON questoes(disciplina);
CREATE INDEX IF NOT EXISTS idx_questoes_materia ON questoes(materia);
CREATE INDEX IF NOT EXISTS idx_questoes_assunto ON questoes(assunto);
CREATE INDEX IF NOT EXISTS idx_questoes_banca ON questoes(banca);
CREATE INDEX IF NOT EXISTS idx_questoes_tipo ON questoes(tipo);
CREATE INDEX IF NOT EXISTS idx_questoes_nivel_dificuldade ON questoes(nivel_dificuldade);
CREATE INDEX IF NOT EXISTS idx_questoes_visibilidade ON questoes(visibilidade);
CREATE INDEX IF NOT EXISTS idx_questoes_data_criacao ON questoes(data_criacao);
CREATE INDEX IF NOT EXISTS idx_questoes_ultima_atualizacao ON questoes(ultima_atualizacao);

-- Create GIN indexes for JSONB fields
CREATE INDEX IF NOT EXISTS idx_questoes_tags ON questoes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_questoes_palavras_chave ON questoes USING GIN(palavras_chave);
CREATE INDEX IF NOT EXISTS idx_questoes_plano_disponibilidade ON questoes USING GIN(plano_disponibilidade);