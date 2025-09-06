-- Criar tabelas necessárias para o dashboard completo

-- Tabela de recomendações IA
DROP TABLE IF EXISTS ai_recommendations;
CREATE TABLE ai_recommendations (
  id SERIAL PRIMARY KEY,
  aluno_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL, -- 'estudo', 'revisao', 'avancado'
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  prioridade INTEGER DEFAULT 1, -- 1-5
  status VARCHAR(50) DEFAULT 'ativo', -- 'ativo', 'concluido', 'ignorado'
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de previsões de aprovação
DROP TABLE IF EXISTS approval_predictions;
CREATE TABLE approval_predictions (
  id SERIAL PRIMARY KEY,
  aluno_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  disciplina VARCHAR(100),
  previsao_percentual DECIMAL(5,2),
  confianca DECIMAL(5,2), -- 0-100
  fatores_analisados JSONB, -- fatores que influenciaram a previsão
  periodo VARCHAR(50), -- 'proximo_mes', 'proximo_bimestre', etc.
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de streaks (sequências de estudo)
CREATE TABLE IF NOT EXISTS study_streaks (
  id SERIAL PRIMARY KEY,
  aluno_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  dias_consecutivos INTEGER DEFAULT 0,
  recorde_dias INTEGER DEFAULT 0,
  ultimo_dia_estudo DATE,
  data_inicio_streak DATE,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de agenda de estudos
DROP TABLE IF EXISTS study_schedule;
CREATE TABLE study_schedule (
  id SERIAL PRIMARY KEY,
  aluno_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  data_agendada DATE NOT NULL,
  horario TIME,
  duracao_minutos INTEGER,
  prioridade VARCHAR(20) DEFAULT 'media', -- 'baixa', 'media', 'alta'
  status VARCHAR(50) DEFAULT 'pendente', -- 'pendente', 'concluido', 'cancelado'
  tipo VARCHAR(50), -- 'estudo', 'revisao', 'prova'
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de alertas de fadiga cognitiva
DROP TABLE IF EXISTS fatigue_alerts;
CREATE TABLE fatigue_alerts (
  id SERIAL PRIMARY KEY,
  aluno_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL, -- 'fadiga', 'pausa', 'descanso'
  severidade VARCHAR(20) DEFAULT 'media', -- 'baixa', 'media', 'alta'
  mensagem TEXT NOT NULL,
  tempo_estudo_acumulado INTEGER, -- minutos
  recomendacao TEXT,
  status VARCHAR(50) DEFAULT 'ativo', -- 'ativo', 'resolvido', 'ignorado'
  criado_em TIMESTAMP DEFAULT NOW(),
  resolvido_em TIMESTAMP NULL
);

-- Tabela de conquistas e badges
DROP TABLE IF EXISTS achievements;
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  aluno_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(100) NOT NULL, -- 'streak', 'questoes', 'tempo', 'disciplina'
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  icone VARCHAR(100),
  xp_ganho INTEGER DEFAULT 0,
  desbloqueado_em TIMESTAMP DEFAULT NOW(),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de estatísticas de usuário (para cache de cálculos)
CREATE TABLE IF NOT EXISTS user_stats (
  id SERIAL PRIMARY KEY,
  aluno_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  periodo VARCHAR(50) NOT NULL, -- 'hoje', 'semana', 'mes', 'total'
  questoes_respondidas INTEGER DEFAULT 0,
  taxa_acerto DECIMAL(5,2) DEFAULT 0,
  tempo_medio_resposta DECIMAL(5,2) DEFAULT 0,
  minutos_estudados INTEGER DEFAULT 0,
  streak_atual INTEGER DEFAULT 0,
  nivel_atual INTEGER DEFAULT 1,
  xp_total INTEGER DEFAULT 0,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW(),
  UNIQUE(aluno_id, periodo)
);

-- Adicionar colunas que podem estar faltando na tabela usuarios
ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS last_study_date DATE,
ADD COLUMN IF NOT EXISTS study_streak_start DATE;

-- Adicionar coluna que pode estar faltando na tabela respostas
ALTER TABLE respostas
ADD COLUMN IF NOT EXISTS sequencia INTEGER DEFAULT 1;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_aluno_id ON ai_recommendations(aluno_id);
CREATE INDEX IF NOT EXISTS idx_approval_predictions_aluno_id ON approval_predictions(aluno_id);
CREATE INDEX IF NOT EXISTS idx_study_streaks_aluno_id ON study_streaks(aluno_id);
CREATE INDEX IF NOT EXISTS idx_study_schedule_aluno_id_data ON study_schedule(aluno_id, data_agendada);
CREATE INDEX IF NOT EXISTS idx_fatigue_alerts_aluno_id ON fatigue_alerts(aluno_id);
-- CREATE INDEX IF NOT EXISTS idx_achievements_aluno_id ON achievements(aluno_id); -- Commented out temporarily
CREATE INDEX IF NOT EXISTS idx_user_stats_aluno_id ON user_stats(aluno_id);

-- Inserir dados de exemplo para teste
INSERT INTO study_streaks (aluno_id, dias_consecutivos, recorde_dias, ultimo_dia_estudo)
SELECT id, 5, 12, CURRENT_DATE
FROM usuarios
WHERE nome_completo = 'aluno felipe'
ON CONFLICT DO NOTHING;

INSERT INTO ai_recommendations (aluno_id, tipo, titulo, descricao, prioridade)
SELECT u.id, 'estudo', 'Revisar Geometria', 'Foque em teoremas de Pitágoras', 3
FROM usuarios u
WHERE u.nome_completo = 'aluno felipe'
ON CONFLICT DO NOTHING;

INSERT INTO ai_recommendations (aluno_id, tipo, titulo, descricao, prioridade)
SELECT u.id, 'revisao', 'Praticar Redação', 'Trabalhe coesão textual', 2
FROM usuarios u
WHERE u.nome_completo = 'aluno felipe'
ON CONFLICT DO NOTHING;

INSERT INTO ai_recommendations (aluno_id, tipo, titulo, descricao, prioridade)
SELECT u.id, 'avancado', 'Estudar História', 'Revolução Industrial', 4
FROM usuarios u
WHERE u.nome_completo = 'aluno felipe'
ON CONFLICT DO NOTHING;

INSERT INTO approval_predictions (aluno_id, previsao_percentual, confianca, periodo)
SELECT u.id, 75.0, 85.0, 'proximo_bimestre'
FROM usuarios u
WHERE u.nome_completo = 'aluno felipe'
ON CONFLICT DO NOTHING;

INSERT INTO study_schedule (aluno_id, titulo, data_agendada, horario, duracao_minutos, prioridade, tipo)
SELECT u.id, 'Matemática - Geometria', CURRENT_DATE, '14:00', 60, 'alta', 'estudo'
FROM usuarios u
WHERE u.nome_completo = 'aluno felipe'
ON CONFLICT DO NOTHING;

INSERT INTO study_schedule (aluno_id, titulo, data_agendada, horario, duracao_minutos, prioridade, tipo)
SELECT u.id, 'Português - Redação', CURRENT_DATE, '16:00', 45, 'media', 'revisao'
FROM usuarios u
WHERE u.nome_completo = 'aluno felipe'
ON CONFLICT DO NOTHING;

INSERT INTO fatigue_alerts (aluno_id, tipo, severidade, mensagem, tempo_estudo_acumulado, recomendacao)
SELECT u.id, 'fadiga', 'media', 'Você estudou por 3h seguidas. Que tal uma pausa de 15min?', 180, 'Faça uma pausa de 15 minutos para recarregar as energias'
FROM usuarios u
WHERE u.nome_completo = 'aluno felipe'
ON CONFLICT DO NOTHING;

INSERT INTO user_stats (aluno_id, periodo, questoes_respondidas, taxa_acerto, tempo_medio_resposta, minutos_estudados, streak_atual, nivel_atual, xp_total)
SELECT u.id, 'total', 25, 78.0, 10.0, 250, 5, 1, 30
FROM usuarios u
WHERE u.nome_completo = 'aluno felipe'
ON CONFLICT DO NOTHING;