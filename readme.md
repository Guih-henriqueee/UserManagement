# SaaS Management System

Um sistema moderno e completo para gerenciamento de usuários, departamentos, sistemas e contratos, construído com React, TypeScript, TailwindCSS e ShadCN/UI.

## 🚀 Funcionalidades

### 📊 Dashboard
- Visão geral com estatísticas em tempo real
- Gráficos de crescimento e distribuição
- Monitoramento de contratos e alertas de expiração
- Indicadores de performance do sistema

### 👥 Gestão de Usuários
- Cadastro completo com validação de CPF
- Níveis de permissão (1-10)
- Vinculação a departamentos e gerentes
- Filtros avançados e busca
- Status ativo/inativo

### 🏢 Departamentos
- Criação e edição de departamentos
- Gerenciamento de cargos vinculados
- Visualização de funcionários por departamento
- Interface intuitiva para organização

### 💻 Sistemas
- Cadastro de sistemas e serviços
- Integração com contratos
- Status de funcionamento
- Descrições detalhadas

### 📄 Contratos
- Contratos pagos e gratuitos
- Controle de licenças
- Datas de validade com alertas
- Cálculos automáticos de custos
- Status detalhado (Ativo/Expirado/Suspenso)

## 🛠️ Tecnologias

- **Frontend:** React 18 + TypeScript
- **Styling:** TailwindCSS + ShadCN/UI
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Icons:** Lucide React
- **Database:** PostgreSQL (Neon)
- **Build:** Vite

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL (via Neon)
- npm ou yarn

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd saas-management-system
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
VITE_DATABASE_URL=postgresql://username:password@ep-xxxxx.us-east-1.postgres.neon.tech/dbname
VITE_API_URL=http://localhost:3001/api
```

4. **Configure o banco de dados**

Execute o schema SQL no seu banco Neon (encontrado em `src/lib/database.ts`):
- Conecte ao seu projeto Neon
- Execute o script SQL completo
- Verifique se as tabelas foram criadas corretamente

5. **Inicie o desenvolvimento**
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── forms/           # Formulários reutilizáveis
│   ├── tables/          # Tabelas com filtros
│   ├── layout/          # Layout components
│   └── ui/              # ShadCN/UI components
├── pages/
│   ├── usuarios/        # Gestão de usuários
│   ├── departamentos/   # Gestão de departamentos
│   ├── sistemas/        # Gestão de sistemas
│   └── contratos/       # Gestão de contratos
├── hooks/
│   └── useApi.ts        # Hooks para API
├── lib/
│   ├── api.ts           # Cliente API
│   ├── database.ts      # Schema do banco
│   └── mock-data.ts     # Dados de exemplo
└── types/
    └── index.ts         # TypeScript types
```

## 🎨 Design System

O sistema utiliza uma paleta de cores moderna:
- **Primary:** Gradientes purple-blue (#8B5CF6 → #3B82F6)
- **Success:** Green (#10B981)
- **Warning:** Amber (#F59E0B)
- **Error:** Red (#EF4444)
- **Gray Scale:** Neutral tones

### Componentes Principais
- **Cards:** Design glassmorphism com gradientes sutis
- **Forms:** Validação inline com feedback visual
- **Tables:** Responsivas com ações contextuais
- **Buttons:** Gradientes e micro-interações
- **Badges:** Status coloridos e informativos

## 🔗 API Integration

### Endpoints Disponíveis
```
GET    /api/usuarios          # Listar usuários
POST   /api/usuarios          # Criar usuário
PUT    /api/usuarios/:id      # Atualizar usuário
DELETE /api/usuarios/:id      # Remover usuário

GET    /api/departamentos     # Listar departamentos
POST   /api/departamentos     # Criar departamento
PUT    /api/departamentos/:id # Atualizar departamento
DELETE /api/departamentos/:id # Remover departamento

GET    /api/sistemas          # Listar sistemas
POST   /api/sistemas          # Criar sistema
PUT    /api/sistemas/:id      # Atualizar sistema
DELETE /api/sistemas/:id      # Remover sistema

GET    /api/contratos         # Listar contratos
POST   /api/contratos         # Criar contrato
PUT    /api/contratos/:id     # Atualizar contrato
DELETE /api/contratos/:id     # Remover contrato

GET    /api/dashboard/stats   # Estatísticas do dashboard
GET    /api/dashboard/charts  # Dados dos gráficos
```

## 📊 Database Schema

### Tabelas Principais
- **usuarios:** Dados pessoais, cargo, departamento, permissões
- **departamentos:** Nome, descrição, cargos vinculados
- **sistemas:** Nome e descrição dos sistemas
- **contratos:** Vínculos sistema-contrato com licenças e custos

### Relacionamentos
- Usuários → Departamentos (many-to-one)
- Contratos → Sistemas (many-to-one)
- Validações e constraints para integridade

## 🔒 Validações

### Formulários
- **CPF:** Validação completa com dígitos verificadores
- **Datas:** Coerência entre datas de início e fim
- **Níveis:** Permissões dentro do range 1-10
- **Custos:** Contratos gratuitos com custo 0
- **Licenças:** Mínimo de 1 licença por contrato

### Dados
- Campos obrigatórios destacados
- Feedback visual em tempo real
- Mensagens de erro contextuais
- Confirmação para ações destrutivas

## 🚀 Deploy

### Frontend (Vercel/Netlify)
```bash
npm run build
```

### Backend (Node.js + Express)
- Configure as variáveis de ambiente
- Implemente as rotas da API
- Configure CORS para o frontend
- Deploy no Heroku, Railway ou similar

### Database (Neon)
- Crie um projeto no Neon
- Execute o schema SQL
- Configure as variáveis de conexão
- Monitore performance e logs

## 📈 Próximos Passos

- [ ] Implementar backend REST API
- [ ] Adicionar autenticação/autorização
- [ ] Sistema de notificações
- [ ] Exportação de relatórios
- [ ] Tema dark/light automático
- [ ] PWA com service workers
- [ ] Testes unitários e E2E
- [ ] Docker containerization

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

---

**Desenvolvido com 💜 usando React + TypeScript**