## 🚀 **ETAPA 15: README, BUILD E DEPLOY NO RENDER**

Esta é a etapa final! Vamos documentar o projeto, preparar para produção e fazer o deploy.

---

### **15.1 Criar README.md**

**📂 `README.md`** (Raiz do projeto)

```markdown
# 🌾 AgroNexus - Frontend

Sistema de Gestão Agrícola - Frontend desenvolvido em Angular 20.

## 📋 Sobre o Projeto

O AgroNexus é um sistema completo para gestão de produtores rurais, permitindo o gerenciamento de fazendas, culturas, insumos, contratos, funcionários, monitoramento e finanças.

### Funcionalidades

- 🔐 **Autenticação**: Login e registro com JWT (Admin e Produtor)
- 📊 **Dashboard**: Indicadores estratégicos (admin e produtor)
- 👥 **Produtores**: CRUD completo com vinculação de usuários
- 🏠 **Fazendas**: Gestão de propriedades com validação de áreas
- 🌱 **Agricultura**: Catálogo de culturas e plantio vinculado
- 📦 **Inventário**: Insumos, compras e controle de estoque
- ⚙️ **Operações**: Contratos, custos, máquinas e funcionários
- 📡 **Monitoramento**: Alertas, certificados e registros climáticos
- 💰 **Financeiro**: Vendas de produção colhida

### Tecnologias

| Tecnologia | Versão |
|------------|--------|
| Angular | 20.x |
| TypeScript | 5.5+ |
| Angular Material | 20.x |
| RxJS | 7.x |
| Chart.js | 4.x |
| date-fns | 3.x |
| ngx-mask | 20.x |
| ngx-toastr | 19.x |

---

## 🚀 Instalação e Execução Local

### Pré-requisitos

- **Node.js** 20.x ou superior
- **npm** 10.x ou superior
- **Angular CLI** 20.x (`npm install -g @angular/cli@20`)

### Passos

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/agronexus-frontend.git
cd agronexus-frontend

# 2. Instalar dependências
npm install

# 3. Executar em desenvolvimento
ng serve --open

# 4. Acessar no navegador
# http://localhost:4200
```

### Variáveis de Ambiente

O projeto possui dois arquivos de ambiente:

| Arquivo | Ambiente | API URL |
|---------|----------|---------|
| `src/environments/environment.ts` | Desenvolvimento | `http://localhost:5000` |
| `src/environments/environment.prod.ts` | Produção | `https://agronexus-api.onrender.com` |

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/                    # Serviços, guards, interceptors, modelos
│   │   ├── guards/              # AuthGuard, AdminGuard
│   │   ├── interceptors/        # Auth, Error, Loading
│   │   ├── models/              # Interfaces TypeScript
│   │   ├── services/            # Serviços de API
│   │   └── store/               # Estado global (NgRx)
│   ├── features/                # Módulos de funcionalidades
│   │   ├── agriculture/         # Culturas e plantio
│   │   ├── auth/                # Login e registro
│   │   ├── dashboard/           # Dashboards
│   │   ├── farms/               # Fazendas
│   │   ├── financial/           # Vendas
│   │   ├── inventory/           # Insumos e estoque
│   │   ├── monitoring/          # Alertas e certificados
│   │   ├── operations/          # Contratos e funcionários
│   │   └── producers/           # Produtores
│   ├── layouts/                 # Layout principal
│   └── shared/                  # Componentes reutilizáveis
├── environments/                # Configurações de ambiente
└── assets/                      # Imagens e ícones
```

---

## 🏗️ Build de Produção

```bash
# Build para produção
ng build --configuration=production

# Os arquivos serão gerados em: dist/agronexus-frontend/browser/
```

---

## 🌐 Deploy no Render

### Opção 1: Static Site

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em **New +** → **Static Site**
3. Conecte seu repositório Git
4. Configure:

| Campo | Valor |
|-------|-------|
| **Name** | `agronexus-frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist/agronexus-frontend/browser` |
| **Auto-Deploy** | `Yes` |

5. Clique em **Create Static Site**

### Opção 2: Deploy Manual

```bash
# 1. Build local
ng build --configuration=production

# 2. O conteúdo da pasta dist/agronexus-frontend/browser/
#    deve ser enviado para qualquer servidor estático
#    (Netlify, Vercel, GitHub Pages, S3, etc.)
```

### Configuração de Roteamento (SPA)

Para que as rotas do Angular funcionem corretamente, adicione uma regra de rewrite:

**Render**: Adicione um arquivo `_redirects` na pasta `src/`:
```
/*    /index.html   200
```

---

## 🔑 Autenticação

### Fluxo de Autenticação

```
1. POST /api/v1/auth/register  → Criar conta (ADM ou PRD)
2. POST /api/v1/auth/login     → Obter Access Token + Refresh Token
3. Access Token incluído automaticamente via AuthInterceptor
```

### Perfis de Usuário

| Perfil | Descrição | Acesso |
|--------|-----------|--------|
| **ADM** | Administrador | Acesso total, dashboard admin, gestão de usuários |
| **PRD** | Produtor Rural | Acesso aos seus próprios dados e fazendas |

---

## 📝 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `ng serve` | Inicia servidor de desenvolvimento |
| `ng build` | Build de produção |
| `ng test` | Executa testes unitários |
| `ng lint` | Executa linting |
| `npm start` | Inicia em desenvolvimento |

---

## 🎨 Tema e Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Verde Escuro | `#2E7D32` | Primary |
| Verde Claro | `#4CAF50` | Primary Light |
| Marrom Terra | `#8D6E63` | Accent |
| Vermelho | `#D32F2F` | Warn/Alertas |
| Laranja | `#F57C00` | Warning |
| Azul | `#1976D2` | Info |

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Desenvolvido por

Equipe AgroNexus - 2025
```