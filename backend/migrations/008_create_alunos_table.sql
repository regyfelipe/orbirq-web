-- Criar tabela de alunos
CREATE TABLE IF NOT EXISTS alunos (
  id SERIAL PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  curso VARCHAR(255),
  nivel VARCHAR(100),
  instituicao VARCHAR(255),
  turma VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(usuario_id)
);

-- Índices para alunos
CREATE INDEX IF NOT EXISTS idx_alunos_usuario_id ON alunos(usuario_id);