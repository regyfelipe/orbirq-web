-- Criar tabela study_streaks especificamente
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

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_study_streaks_aluno_id ON study_streaks(aluno_id);

-- Inserir dados de exemplo
INSERT INTO study_streaks (aluno_id, dias_consecutivos, recorde_dias, ultimo_dia_estudo)
SELECT id, 5, 12, CURRENT_DATE
FROM usuarios
WHERE nome_completo = 'aluno felipe'
ON CONFLICT DO NOTHING;