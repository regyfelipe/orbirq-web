-- Criar tabela de turmas
CREATE TABLE IF NOT EXISTS turmas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  tenant_id UUID NOT NULL,
  disciplina TEXT[] NOT NULL DEFAULT '{}',
  ano VARCHAR(10) NOT NULL,
  periodo VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ativa',
  professor_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_turmas_professor_id ON turmas(professor_id);
CREATE INDEX IF NOT EXISTS idx_turmas_status ON turmas(status);
CREATE INDEX IF NOT EXISTS idx_turmas_nome ON turmas(nome);

-- Tabela de relacionamento alunos-turmas
CREATE TABLE IF NOT EXISTS alunos_turmas (
  id SERIAL PRIMARY KEY,
  aluno_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  turma_id UUID NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(aluno_id, turma_id)
);

-- Índices para alunos_turmas
CREATE INDEX IF NOT EXISTS idx_alunos_turmas_aluno_id ON alunos_turmas(aluno_id);
CREATE INDEX IF NOT EXISTS idx_alunos_turmas_turma_id ON alunos_turmas(turma_id);
