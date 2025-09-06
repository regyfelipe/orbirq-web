-- Criar tabela de professores
CREATE TABLE IF NOT EXISTS professores (
  id SERIAL PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  formacao TEXT,
  disciplinas TEXT[],
  instituicao_vinculo VARCHAR(255),
  validado_pela_plataforma BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(usuario_id)
);

-- Índices para professores
CREATE INDEX IF NOT EXISTS idx_professores_usuario_id ON professores(usuario_id);