# Orbirq Backend

API REST para a plataforma educacional Orbirq, desenvolvida com Node.js, Express e PostgreSQL.

## Estrutura do Projeto

```
backend/
├── src/
│   ├── modules/                    # Módulos por domínio
│   │   ├── auth/                   # Módulo de autenticação
│   │   ├── users/                  # Módulo de usuários
│   │   ├── questions/              # Módulo de questões
│   │   └── ...
│   ├── shared/                     # Código compartilhado
│   │   ├── database/               # Conexão com banco
│   │   ├── logger/                 # Sistema de logs
│   │   ├── errors/                 # Tratamento de erros
│   │   └── utils/                  # Utilitários
│   └── config/                     # Configurações centralizadas
├── tests/                          # Testes
├── migrations/                     # Migrações de banco
├── seeds/                          # Dados iniciais
└── scripts/                        # Scripts utilitários
```

## Instalação

```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`
2. Configure as variáveis de ambiente:
   - `DATABASE_URL` - URL de conexão com PostgreSQL
   - `JWT_SECRET` - Chave secreta para JWT
   - `NODE_ENV` - Ambiente (development/staging/production)

## Desenvolvimento

```bash
# Iniciar servidor em modo desenvolvimento
npm run dev

# Executar testes
npm test

# Executar linting
npm run lint

# Executar testes com cobertura
npm run test:coverage
```

## Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor com nodemon
- `npm test` - Executa todos os testes
- `npm run test:watch` - Executa testes em modo watch
- `npm run lint` - Executa linting
- `npm run migrate` - Executa migrações de banco
- `npm run seed` - Popula banco com dados iniciais

## Estrutura de Módulos

Cada módulo contém:

- `controllers/` - Controladores da API
- `services/` - Lógica de negócio
- `repositories/` - Acesso a dados
- `routes/` - Definição de rotas
- `middlewares/` - Middlewares específicos
- `types/` - Definições TypeScript
- `tests/` - Testes do módulo
- `index.js` - Exportações do módulo

## API Endpoints

### Autenticação
- `POST /auth/login` - Login de usuário

### Usuários
- `POST /usuarios` - Criar usuário
- `GET /usuarios/:id` - Buscar usuário

### Saúde da Aplicação
- `GET /health` - Verificar saúde da aplicação

## Testes

Os testes estão organizados por módulo:

```bash
# Testes unitários
src/modules/*/tests/unit/

# Testes de integração
src/modules/*/tests/integration/

# Testes E2E
tests/e2e/
```

## Logs

Logs são salvos em `logs/` com os níveis:
- `error.log` - Apenas erros
- `combined.log` - Todos os logs

## Contribuição

1. Crie uma branch para sua feature
2. Escreva testes para sua funcionalidade
3. Execute `npm run lint` e `npm test`
4. Faça commit das mudanças
5. Abra um Pull Request

## Licença

ISC