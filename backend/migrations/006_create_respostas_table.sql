-- Criar tabela respostas
CREATE TABLE IF NOT EXISTS respostas (
  id SERIAL PRIMARY KEY,
  aluno_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  questao_id VARCHAR NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
  opcao_escolhida VARCHAR NOT NULL,
  correta BOOLEAN NOT NULL,
  tempo_resposta_segundos INTEGER DEFAULT 0,
  tentativa INTEGER DEFAULT 1,
  respondida_em TIMESTAMP DEFAULT NOW(),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_respostas_aluno_id ON respostas(aluno_id);
CREATE INDEX IF NOT EXISTS idx_respostas_questao_id ON respostas(questao_id);
CREATE INDEX IF NOT EXISTS idx_respostas_aluno_questao ON respostas(aluno_id, questao_id);
CREATE INDEX IF NOT EXISTS idx_respostas_respondida_em ON respostas(respondida_em);

-- Nota: Esta tabela armazena todas as respostas dos alunos para análise de desempenho