# Gestor Finanças Pessoais

## 🚀 Resumo das Tecnologias Utilizadas
- ✅ Supabase – Autenticação, banco de dados e storage.
- ✅ Vue.js + Vuetify – Interface responsiva e estilizada.
- ✅ Capacitor – Empacotamento para dispositivos móveis.
- ✅ TypeScript – Tipagem e segurança no código.
- ✅ Vite – Build rápido e otimizado para Vue 3.

## Arquitetura
```
│── /src/
│   ├── /api/                  # Serviços de API e integração com Supabase
│   │   ├── authService.ts     # Gerenciamento de autenticação
│   │   ├── storageService.ts  # Gerenciamento de arquivos no Supabase
│   │   ├── supabase.ts        # Configuração do Supabase
│   │
│   ├── /components/           # Componentes reutilizáveis
│   │   ├── Button.vue         # Exemplo de um botão customizado
│   │   ├── Card.vue           # Exemplo de um card estilizado
│   │
│   ├── /pages/                # Páginas principais
│   │   ├── Home.vue           # Página inicial
│   │   ├── Login.vue          # Tela de login
│   │   ├── Dashboard.vue      # Tela após login
│   │
│   ├── /router/               # Configuração de rotas
│   │   ├── index.ts
│   │
│   ├── /store/                # Gerenciamento de estado (Pinia)
│   │   ├── auth.ts
│   │   ├── user.ts
│   │
│   ├── /assets/               # Imagens, fontes e estilos globais
│   │
│   ├── /plugins/              # Plugins globais
│   │   ├── vuetify.ts         # Configuração do Vuetify
│   │
│   ├── App.vue                # Componente raiz
│   ├── main.ts                # Ponto de entrada da aplicação
│
│── /capacitor/                # Configuração do Capacitor
│── /public/                   # Arquivos públicos
│── /tests/                    # Testes unitários e e2e
│── package.json               # Dependências do projeto
│── tsconfig.json              # Configuração do TypeScript
│── vite.config.ts             # Configuração do Vite
```

## Funcionalidades Principais
1.	Cadastro e Autenticação
    - Registro e login de usuários (email/senha, OAuth com Google).
    - Recuperação de senha.
2.	Gestão de Receitas e Despesas
    - Cadastro de receitas e despesas com categorias personalizadas.
    - Adição de despesas recorrentes (ex.: assinatura de serviços, contas fixas).
    - Cadastro de despesas no cartão de crédito com opção de parcelamento e data de vencimento.
    - Registro de contas e carteiras (ex.: carteira física, conta corrente, conta digital).
    - Registro de transferências entre contas.
3.	Controle de Orçamento
    - Definição de orçamentos por categoria (ex.: alimentação, transporte).
    - Alertas quando o orçamento estiver próximo do limite.
4.	Modo Offline
    - Permitir uso sem internet com sincronização posterior.
5.	Notificações
    - Alertas para vencimento de contas com lembretes customizáveis por skin.
    - Resumo financeiro semanal ou mensal.
6.	Configurações e Personalização
    - Customização de categorias de gastos e receitas.
    - Opção de exibir ou ocultar saldo em telas públicas.
7.	Gamificação e Mascotes
    - Mascotes animados em GIF que evoluem conforme o usuário gerencia bem suas finanças.
    - Sistema de conquistas (ex.: "Primeira Meta Atingida", "30 Dias Sem Estourar o Orçamento").
    - Loja de mascotes e acessórios adquiridos com moedas virtuais.
    - Desafios financeiros com recompensas (ex.: "1 Semana Sem Gastar em Fast Food").
    - Integração com notificações para que as mascotes interajam com o usuário.

## Diagrama Entidade-Relacionamento (DER)
```
1. Usuários (usuarios)
id (UUID, PK) (Gerenciado pelo Supabase Auth)
email (VARCHAR, UNIQUE) (Gerenciado pelo Supabase Auth)
data_criacao (TIMESTAMP, DEFAULT NOW())
data_atualizacao (TIMESTAMP, DEFAULT NOW())

2. Contas (contas)
id (UUID, PK)
usuario_id (UUID, FK -> usuarios.id)
nome (VARCHAR)
tipo (ENUM: "carteira", "conta corrente", "conta digital")
saldo_inicial (DECIMAL)
data_criacao (TIMESTAMP, DEFAULT NOW())
data_atualizacao (TIMESTAMP, DEFAULT NOW())

3. Categorias (categorias)
id (UUID, PK)
usuario_id (UUID, FK -> usuarios.id, NULL para categorias padrão)
nome (VARCHAR)
tipo (ENUM: "receita", "despesa")
icone (VARCHAR, opcional)
data_criacao (TIMESTAMP, DEFAULT NOW())
data_atualizacao (TIMESTAMP, DEFAULT NOW())

4. Transações (transacoes)
id (UUID, PK)
usuario_id (UUID, FK -> usuarios.id)
conta_id (UUID, FK -> contas.id)
categoria_id (UUID, FK -> categorias.id)
tipo (ENUM: "receita", "despesa")
valor (DECIMAL)
descricao (TEXT, opcional)
data (DATE)
recorrente (BOOLEAN, DEFAULT FALSE)
parcela_atual (INTEGER, opcional)
total_parcelas (INTEGER, opcional)
data_criacao (TIMESTAMP, DEFAULT NOW())
data_atualizacao (TIMESTAMP, DEFAULT NOW())

5. Orçamentos (orcamentos)
id (UUID, PK)
usuario_id (UUID, FK -> usuarios.id)
categoria_id (UUID, FK -> categorias.id)
valor_limite (DECIMAL)
mes_ano (VARCHAR, formato "YYYY-MM")
data_criacao (TIMESTAMP, DEFAULT NOW())
data_atualizacao (TIMESTAMP, DEFAULT NOW())

6. Notificações (notificacoes)
id (UUID, PK)
usuario_id (UUID, FK -> usuarios.id)
tipo (ENUM: "conta_vencimento", "resumo_financeiro", "outro")
mensagem (TEXT)
enviada (BOOLEAN, DEFAULT FALSE)
data_envio (TIMESTAMP, opcional)
data_criacao (TIMESTAMP, DEFAULT NOW())
data_atualizacao (TIMESTAMP, DEFAULT NOW())

7. Mascotes (mascotes)
id (UUID, PK)
nome (VARCHAR)
imagem_url (TEXT)
preco_moedas (INTEGER)
data_criacao (TIMESTAMP, DEFAULT NOW())
data_atualizacao (TIMESTAMP, DEFAULT NOW())

8. Mascotes do Usuário (mascotes_usuarios)
id (UUID, PK)
usuario_id (UUID, FK -> usuarios.id)
mascote_id (UUID, FK -> mascotes.id)
nivel (INTEGER, DEFAULT 1)
data_criacao (TIMESTAMP, DEFAULT NOW())
data_atualizacao (TIMESTAMP, DEFAULT NOW())

9. Conquistas (conquistas)
id (UUID, PK)
nome (VARCHAR)
descricao (TEXT)
recompensa_moedas (INTEGER)
data_criacao (TIMESTAMP, DEFAULT NOW())
data_atualizacao (TIMESTAMP, DEFAULT NOW())

10. Conquistas do Usuário (conquistas_usuarios)
id (UUID, PK)
usuario_id (UUID, FK -> usuarios.id)
conquista_id (UUID, FK -> conquistas.id)
data_conquista (TIMESTAMP, DEFAULT NOW())

11. Desafios (desafios)
id (UUID, PK)
nome (VARCHAR)
descricao (TEXT)
recompensa_moedas (INTEGER)
duracao_dias (INTEGER)
data_criacao (TIMESTAMP, DEFAULT NOW())
data_atualizacao (TIMESTAMP, DEFAULT NOW())

12. Desafios do Usuário (desafios_usuarios)
id (UUID, PK)
usuario_id (UUID, FK -> usuarios.id)
desafio_id (UUID, FK -> desafios.id)
status (ENUM: "em progresso", "concluido", "falhou")
data_inicio (TIMESTAMP)
data_fim (TIMESTAMP, opcional)
```

# Vuetify (Default)

This is the official scaffolding tool for Vuetify, designed to give you a head start in building your new Vuetify application. It sets up a base template with all the necessary configurations and standard directory structure, enabling you to begin development without the hassle of setting up the project from scratch.

## ❗️ Important Links

- 📄 [Docs](https://vuetifyjs.com/)
- 🚨 [Issues](https://issues.vuetifyjs.com/)
- 🏬 [Store](https://store.vuetifyjs.com/)
- 🎮 [Playground](https://play.vuetifyjs.com/)
- 💬 [Discord](https://community.vuetifyjs.com)

## 💿 Install

Set up your project using your preferred package manager. Use the corresponding command to install the dependencies:

| Package Manager                                                | Command        |
|---------------------------------------------------------------|----------------|
| [yarn](https://yarnpkg.com/getting-started)                   | `yarn install` |
| [npm](https://docs.npmjs.com/cli/v7/commands/npm-install)     | `npm install`  |
| [pnpm](https://pnpm.io/installation)                          | `pnpm install` |
| [bun](https://bun.sh/#getting-started)                        | `bun install`  |

After completing the installation, your environment is ready for Vuetify development.

## ✨ Features

- 🖼️ **Optimized Front-End Stack**: Leverage the latest Vue 3 and Vuetify 3 for a modern, reactive UI development experience. [Vue 3](https://v3.vuejs.org/) | [Vuetify 3](https://vuetifyjs.com/en/)
- 🗃️ **State Management**: Integrated with [Pinia](https://pinia.vuejs.org/), the intuitive, modular state management solution for Vue.
- 🚦 **Routing and Layouts**: Utilizes Vue Router for SPA navigation and vite-plugin-vue-layouts for organizing Vue file layouts. [Vue Router](https://router.vuejs.org/) | [vite-plugin-vue-layouts](https://github.com/JohnCampionJr/vite-plugin-vue-layouts)
- 💻 **Enhanced Development Experience**: Benefit from TypeScript's static type checking and the ESLint plugin suite for Vue, ensuring code quality and consistency. [TypeScript](https://www.typescriptlang.org/) | [ESLint Plugin Vue](https://eslint.vuejs.org/)
- ⚡ **Next-Gen Tooling**: Powered by Vite, experience fast cold starts and instant HMR (Hot Module Replacement). [Vite](https://vitejs.dev/)
- 🧩 **Automated Component Importing**: Streamline your workflow with unplugin-vue-components, automatically importing components as you use them. [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)
- 🛠️ **Strongly-Typed Vue**: Use vue-tsc for type-checking your Vue components, and enjoy a robust development experience. [vue-tsc](https://github.com/johnsoncodehk/volar/tree/master/packages/vue-tsc)

These features are curated to provide a seamless development experience from setup to deployment, ensuring that your Vuetify application is both powerful and maintainable.

## 💡 Usage

This section covers how to start the development server and build your project for production.

### Starting the Development Server

To start the development server with hot-reload, run the following command. The server will be accessible at [http://localhost:3000](http://localhost:3000):

```bash
yarn dev
```

(Repeat for npm, pnpm, and bun with respective commands.)

> Add NODE_OPTIONS='--no-warnings' to suppress the JSON import warnings that happen as part of the Vuetify import mapping. If you are on Node [v21.3.0](https://nodejs.org/en/blog/release/v21.3.0) or higher, you can change this to NODE_OPTIONS='--disable-warning=5401'. If you don't mind the warning, you can remove this from your package.json dev script.

### Building for Production

To build your project for production, use:

```bash
yarn build
```

(Repeat for npm, pnpm, and bun with respective commands.)

Once the build process is completed, your application will be ready for deployment in a production environment.

## 💪 Support Vuetify Development

This project is built with [Vuetify](https://vuetifyjs.com/en/), a UI Library with a comprehensive collection of Vue components. Vuetify is an MIT licensed Open Source project that has been made possible due to the generous contributions by our [sponsors and backers](https://vuetifyjs.com/introduction/sponsors-and-backers/). If you are interested in supporting this project, please consider:

- [Requesting Enterprise Support](https://support.vuetifyjs.com/)
- [Sponsoring John on Github](https://github.com/users/johnleider/sponsorship)
- [Sponsoring Kael on Github](https://github.com/users/kaelwd/sponsorship)
- [Supporting the team on Open Collective](https://opencollective.com/vuetify)
- [Becoming a sponsor on Patreon](https://www.patreon.com/vuetify)
- [Becoming a subscriber on Tidelift](https://tidelift.com/subscription/npm/vuetify)
- [Making a one-time donation with Paypal](https://paypal.me/vuetify)

## 📑 License
[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016-present Vuetify, LLC


