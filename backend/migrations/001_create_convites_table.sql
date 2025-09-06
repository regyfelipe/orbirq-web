-- Criar tabela de convites
CREATE TABLE IF NOT EXISTS convites (
  id SERIAL PRIMARY KEY,
  token VARCHAR(255) UNIQUE NOT NULL,
  professor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  professor_name VARCHAR(255) NOT NULL,
  professor_email VARCHAR(255) NOT NULL,
  aluno_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  tipo VARCHAR(50) NOT NULL DEFAULT 'unico', -- 'unico' ou 'permanente'
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'expired', 'used'
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_convites_token ON convites(token);
CREATE INDEX IF NOT EXISTS idx_convites_professor_id ON convites(professor_id);
CREATE INDEX IF NOT EXISTS idx_convites_status ON convites(status);
CREATE INDEX IF NOT EXISTS idx_convites_expires_at ON convites(expires_at);

-- Nota: Os convites serão criados dinamicamente pela API
-- Não inserir dados de exemplo para evitar conflitos de tipos