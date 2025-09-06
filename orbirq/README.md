# Orbirq Frontend - Arquitetura CEO

Aplicação React/TypeScript para a plataforma educacional Orbirq, desenvolvida com arquitetura modular baseada em features.

## 🏗️ Arquitetura Modular

```
src/
├── features/                    # Módulos por funcionalidade
│   ├── auth/                    # Módulo de autenticação
│   │   ├── components/          # Componentes específicos
│   │   ├── pages/              # Páginas de auth
│   │   ├── services/           # Chamadas de API
│   │   ├── hooks/              # Hooks específicos
│   │   ├── types/              # Tipos TypeScript
│   │   └── utils/              # Utilitários
│   ├── questions/              # Módulo de questões
│   ├── dashboard/              # Módulo de dashboard
│   └── users/                  # Módulo de usuários
├── shared/                     # Código compartilhado
│   ├── components/             # Componentes reutilizáveis
│   ├── hooks/                  # Hooks compartilhados
│   ├── utils/                  # Utilitários globais
│   ├── constants/              # Constantes da aplicação
│   ├── types/                  # Tipos globais
│   ├── services/               # Serviços compartilhados
│   ├── stores/                 # Estado global
│   └── styles/                 # Estilos globais
├── tests/                      # Configuração de testes
│   ├── setup.ts                # Setup dos testes
│   ├── unit/                   # Testes unitários
│   ├── integration/            # Testes de integração
│   └── e2e/                    # Testes end-to-end
├── App.tsx                     # Componente principal
├── main.tsx                    # Ponto de entrada
└── vite-env.d.ts               # Tipos do Vite
```

## 🚀 Instalação e Desenvolvimento

```bash
npm install
npm run dev
```

## 📋 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Executa linting
- `npm test` - Executa testes
- `npm run test:watch` - Testes em modo watch
- `npm run test:coverage` - Testes com cobertura

## 🧩 Estrutura de Features

Cada feature contém:

### Components (`components/`)
- Componentes específicos da feature
- Reutilizáveis apenas dentro da feature
- Exemplo: `LoginForm.tsx`, `UserProfile.tsx`

### Pages (`pages/`)
- Páginas/componentes de rota
- Ponto de entrada para cada rota
- Exemplo: `Login.tsx`, `Dashboard.tsx`

### Services (`services/`)
- Chamadas de API específicas da feature
- Lógica de comunicação com backend
- Exemplo: `auth.ts`, `questions.ts`

### Hooks (`hooks/`)
- Hooks customizados específicos da feature
- Lógica reutilizável da feature
- Exemplo: `useAuth.ts`, `useQuestions.ts`

### Types (`types/`)
- Interfaces e tipos TypeScript da feature
- Contratos de dados da feature

### Utils (`utils/`)
- Funções utilitárias da feature
- Helpers específicos da feature

## 🔧 Shared Resources

### Components (`shared/components/`)
- Componentes reutilizáveis globalmente
- UI components, layouts, etc.
- Exemplo: `Button.tsx`, `Header.tsx`

### Hooks (`shared/hooks/`)
- Hooks customizados globais
- Exemplo: `useAuth.ts`, `useLocalStorage.ts`

### Utils (`shared/utils/`)
- Funções utilitárias globais
- Helpers genéricos

### Stores (`shared/stores/`)
- Estado global da aplicação
- Zustand stores, context providers

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes com cobertura
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

### Estrutura de Testes
```
src/
├── features/
│   └── auth/
│       ├── components/
│       │   ├── LoginForm.test.tsx
│       │   └── RegisterForm.test.tsx
│       └── hooks/
│           └── useAuth.test.ts
├── shared/
│   ├── hooks/
│   │   └── useLocalStorage.test.ts
│   └── utils/
│       └── formatters.test.ts
└── tests/
    ├── setup.ts
    └── helpers/
```

## 📁 Convenções de Arquivos

### Nomenclatura
- **Pastas**: kebab-case (`user-profile`, `auth-service`)
- **Arquivos**: PascalCase para componentes (`UserCard.tsx`)
- **camelCase** para hooks, services, utils (`useAuth.ts`, `authService.ts`)

### Estrutura de Imports
```typescript
// Imports absolutos com aliases
import { Button } from '@/shared/components/Button';
import { useAuth } from '@/shared/hooks/useAuth';
import { LoginForm } from '@/features/auth/components/LoginForm';

// Imports relativos dentro da feature
import { authService } from '../services/authService';
import { LoginForm } from './components/LoginForm';
```

## 🔄 Migração de Arquivos

### Antes (Estrutura Antiga)
```
src/
├── components/
├── pages/
├── api/
├── auth/
└── lib/
```

### Depois (Nova Arquitetura)
```
src/
├── features/
│   ├── auth/
│   ├── questions/
│   └── dashboard/
└── shared/
    ├── components/
    ├── hooks/
    └── utils/
```

## 🎯 Benefícios da Nova Arquitetura

1. **Escalabilidade**: Fácil adicionar novas features
2. **Manutenibilidade**: Código organizado por responsabilidade
3. **Reutilização**: Componentes e hooks compartilhados
4. **Testabilidade**: Estrutura preparada para testes
5. **Colaboração**: Times podem trabalhar em features independentes
6. **Performance**: Code splitting por feature

## 🚀 Próximos Passos

1. **Implementar Stores**: Zustand para estado global
2. **Configurar CI/CD**: Pipelines de deploy
3. **Adicionar Monitoramento**: Error tracking e analytics
4. **Otimização**: Code splitting e lazy loading
5. **Documentação**: Storybook para componentes

## 📚 Documentação Adicional

- [Guia de Contribuição](CONTRIBUTING.md)
- [Convenções de Código](CODING_STANDARDS.md)
- [Guia de Testes](TESTING_GUIDE.md)
- [Deploy](DEPLOYMENT.md)

---

**Arquiteta CEO**: Arquitetura preparada para crescimento empresarial e excelência técnica.
