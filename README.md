# Orbirq - Plataforma Educacional

[![Acesso Online](https://img.shields.io/badge/Acesso-Online-blue?style=flat-square)](https://orbirq-web.vercel.app/)
[![Status](https://img.shields.io/badge/Status-Ativo-success?style=flat-square)]()
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue?style=flat-square)](https://postgresql.org/)

Uma plataforma educacional completa desenvolvida com arquitetura full-stack moderna, projetada para conectar professores, alunos e instituições de ensino em um ecossistema integrado de aprendizado.

## 📋 Visão Geral

Orbirq é uma solução educacional abrangente que oferece ferramentas para criação e gerenciamento de questões, provas, turmas, dashboards analíticos e muito mais. A plataforma suporta gamificação, feedback inteligente via IA, streaks de estudo e analytics avançados para otimizar o processo de ensino-aprendizagem.

## ✨ Principais Funcionalidades

### 🎓 Para Professores
- **Criação de Questões**: Interface intuitiva para elaborar questões com diferentes tipos e complexidades
- **Gerenciamento de Turmas**: Controle completo sobre alunos, convites e progresso
- **Dashboard Analítico**: Métricas detalhadas sobre desempenho de alunos e turmas
- **Biblioteca de Questões**: Repositório organizado por disciplinas, assuntos e bancas
- **Sistema de Feedback**: Avaliação automática e manual das respostas dos alunos

### 👨‍🎓 Para Alunos
- **Ambiente de Estudo**: Interface limpa e focada no aprendizado
- **Gamificação**: Sistema de pontos, badges e streaks para manter a motivação
- **Feedback Inteligente**: Sugestões personalizadas baseadas no desempenho
- **Biblioteca Pessoal**: Acesso rápido às questões e materiais de estudo
- **Relatórios de Progresso**: Acompanhamento detalhado do desenvolvimento

### 🏫 Para Instituições
- **Gestão Centralizada**: Controle sobre múltiplas turmas e professores
- **Analytics Avançados**: Relatórios institucionais e métricas de engajamento
- **Integração com Sistemas**: API robusta para integrações externas
- **Suporte Multidisciplinar**: Suporte a diferentes áreas do conhecimento

## 🏗️ Arquitetura do Projeto

```
orbirq/
├── backend/                    # API REST (Node.js + Express)
│   ├── src/
│   │   ├── modules/           # Módulos por domínio
│   │   │   ├── auth/          # Autenticação e autorização
│   │   │   ├── users/         # Gestão de usuários
│   │   │   ├── questions/     # Sistema de questões
│   │   │   ├── answers/       # Respostas e correções
│   │   │   ├── turmas/        # Gerenciamento de turmas
│   │   │   ├── analytics/     # Analytics e relatórios
│   │   │   ├── feedback/      # Sistema de feedback
│   │   │   └── invites/       # Convites e acessos
│   │   ├── shared/            # Código compartilhado
│   │   └── config/            # Configurações
│   ├── migrations/            # Migrações do banco
│   ├── tests/                 # Testes backend
│   └── package.json
│
└── orbirq/                     # Frontend (React + TypeScript)
    ├── src/
    │   ├── features/          # Módulos por funcionalidade
    │   │   ├── auth/          # Autenticação
    │   │   ├── dashboard/     # Dashboards
    │   │   ├── questions/     # Gestão de questões
    │   │   ├── turmas/        # Turmas
    │   │   ├── users/         # Usuários
    │   │   ├── biblioteca/    # Biblioteca
    │   │   ├── forum/         # Fórum de discussão
    │   │   ├── mensagens/     # Sistema de mensagens
    │   │   ├── notificacoes/  # Notificações
    │   │   ├── provas/        # Provas e avaliações
    │   │   ├── relatorios/    # Relatórios
    │   │   └── suporte/       # Suporte
    │   ├── shared/            # Componentes compartilhados
    │   └── tests/             # Testes frontend
    ├── public/                # Assets estáticos
    └── package.json
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Hashing de senhas
- **Winston** - Sistema de logging
- **Jest** - Framework de testes
- **ESLint** - Linting e formatação

### Frontend
- **React 19** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **Radix UI** - Componentes primitivos
- **Framer Motion** - Animações
- **React Router** - Roteamento
- **Recharts** - Gráficos e visualizações
- **React Hook Form** - Gerenciamento de formulários

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- PostgreSQL 13+
- npm ou yarn

### 1. Clonagem do Repositório
```bash
git clone <repository-url>
cd orbirq
```

### 2. Configuração do Backend
```bash
cd backend
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Executar migrações
npm run migrate

# Popular banco com dados iniciais (opcional)
npm run seed
```

### 3. Configuração do Frontend
```bash
cd ../orbirq
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações
```

### 4. Executar a Aplicação
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd orbirq
npm run dev
```

A aplicação estará disponível em:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- **Online: https://orbirq-web.vercel.app/**

## 📊 Scripts Disponíveis

### Backend
```bash
npm run dev          # Desenvolvimento com nodemon
npm start            # Produção
npm test             # Executar testes
npm run test:watch   # Testes em modo watch
npm run lint         # Linting
npm run migrate      # Executar migrações
```

### Frontend
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Linting
```

## 🔧 Configuração de Ambiente

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/orbirq
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Orbirq
```

## 🧪 Testes

### Backend
```bash
# Testes unitários
npm test

# Testes com cobertura
npm run test:coverage

# Testes de integração
npm run test:integration
```

### Frontend
```bash
# Testes unitários
npm test

# Testes E2E (se configurado)
npm run test:e2e
```

## 📈 Funcionalidades em Destaque

### 🎯 Sistema de Questões
- Criação de questões múltipla escolha, discursivas e mistas
- Organização por disciplinas, assuntos e bancas examinadoras
- Sistema de dificuldade e tags personalizáveis
- Preview em tempo real durante criação

### 📊 Analytics e Relatórios
- Dashboard com métricas em tempo real
- Relatórios de desempenho individual e coletivo
- Gráficos interativos com Recharts
- Exportação de dados em múltiplos formatos

### 🎮 Gamificação
- Sistema de pontos e badges
- Streaks de estudo consecutivos
- Rankings e leaderboards
- Recompensas por conquistas

### 🤖 Feedback Inteligente
- Análise automática de respostas
- Sugestões personalizadas de estudo
- Identificação de padrões de erro
- Recomendações baseadas em IA

### 💬 Comunicação
- Fórum integrado para discussões
- Sistema de mensagens privadas
- Notificações em tempo real
- Suporte técnico integrado

## 🔒 Segurança

- Autenticação JWT com refresh tokens
- Hashing de senhas com bcrypt
- Validação de entrada de dados
- Proteção contra ataques comuns (XSS, CSRF)
- Logs detalhados de segurança

## 📚 Documentação da API

A documentação completa da API está disponível em `/api/docs` quando o servidor estiver rodando em modo desenvolvimento.

### Endpoints Principais
- `POST /auth/login` - Autenticação
- `GET /questions` - Listar questões
- `POST /questions` - Criar questão
- `GET /turmas` - Gerenciar turmas
- `GET /analytics/dashboard` - Dados do dashboard

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de Código
- Use ESLint e Prettier
- Siga as convenções de nomenclatura estabelecidas
- Escreva testes para novas funcionalidades
- Mantenha a documentação atualizada

## 📝 Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

- **Desenvolvimento**: Equipe de desenvolvimento Orbirq
- **Design**: Equipe de UX/UI
- **Produto**: Gerenciamento de produto

## 📞 Suporte

Para suporte técnico:
- Email: suporte@orbirq.com
- Documentação: [docs.orbirq.com](https://docs.orbirq.com)
- Issues: [GitHub Issues](https://github.com/orbirq/orbirq/issues)

## 🚀 Roadmap

### Próximas Funcionalidades
- [ ] Integração com LMS externos
- [ ] Aplicativo mobile nativo
- [ ] Sistema de videoaulas integrado
- [ ] IA avançada para correção automática
- [ ] Realidade aumentada para questões interativas

---

**Orbirq** - Transformando a educação através da tecnologia. 🧠✨