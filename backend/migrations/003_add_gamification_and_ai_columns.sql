-- Migração para adicionar colunas de gamificação e IA
-- Data: 2025-09-05

-- Adicionar colunas para streaks e gamificação na tabela usuarios
ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS last_study_date DATE,
ADD COLUMN IF NOT EXISTS study_streak_start DATE;

-- Adicionar colunas para analytics de IA na tabela respostas
ALTER TABLE respostas
ADD COLUMN IF NOT EXISTS session_duration_seconds INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS cognitive_load_score DECIMAL(3,2) DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS difficulty_perceived INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS time_pressure BOOLEAN DEFAULT false;

-- Criar tabela para recomendações de IA
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(50) NOT NULL,
  content JSONB NOT NULL,
  effectiveness_score DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  applied_at TIMESTAMP WITH TIME ZONE,
  feedback_score INTEGER
);

-- Criar tabela para previsões de aprovação
CREATE TABLE IF NOT EXISTS approval_predictions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  predicted_score DECIMAL(5,2) NOT NULL,
  confidence_level DECIMAL(3,2) NOT NULL,
  factors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para alertas de fadiga
CREATE TABLE IF NOT EXISTS fatigue_alerts (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  alert_type VARCHAR(20) NOT NULL, -- 'fadiga', 'inatividade'
  message TEXT NOT NULL,
  severity VARCHAR(10) NOT NULL, -- 'baixa', 'media', 'alta'
  study_hours_today DECIMAL(4,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acknowledged_at TIMESTAMP WITH TIME ZONE
);

-- Criar tabela para agenda de estudo
CREATE TABLE IF NOT EXISTS study_schedule (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  duration_minutes INTEGER DEFAULT 60,
  subject VARCHAR(100),
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_approval_predictions_user_id ON approval_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_fatigue_alerts_user_id ON fatigue_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_study_schedule_user_date ON study_schedule(user_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_respostas_aluno_data ON respostas(aluno_id, respondida_em);

-- Atualizar dados existentes com valores padrão
UPDATE usuarios
SET current_streak = 0,
    longest_streak = 0,
    total_xp = 0,
    level = 1
WHERE current_streak IS NULL;

UPDATE respostas
SET session_duration_seconds = 300, -- 5 minutos padrão
    cognitive_load_score = 0.5,
    difficulty_perceived = 3,
    time_pressure = false
WHERE session_duration_seconds IS NULL;