# TechChallenge 2 — Blogging App API

API REST para uma plataforma de blog, desenvolvida com Node.js, TypeScript e PostgreSQL.

---

## Sumário

- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#como-executar)
- [Endpoints da API](#endpoints-da-api)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Experiências e Desafios](#experiências-e-desafios)

---

## Arquitetura do Sistema

A aplicação segue uma arquitetura em camadas, separando responsabilidades entre:

```
Cliente HTTP
     │
     ▼
  Express (app.ts)
     │
     ▼
  Routes  ──►  Controllers  ──►  Services  ──►  Database (PostgreSQL)
```

- **Routes**: definem os endpoints e delegam para os controllers.
- **Controllers**: recebem a requisição HTTP, validam a entrada e chamam os services.
- **Services**: contêm a lógica de negócio e se comunicam com o banco de dados.
- **Database**: PostgreSQL rodando via Docker, acessado pela camada de services.

A validação de variáveis de ambiente é feita na inicialização com **Zod**, garantindo que a aplicação não suba com configuração inválida.

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Node.js | >= 18 | Runtime JavaScript |
| TypeScript | ^6.0 | Tipagem estática |
| Express | ^5.2 | Framework HTTP |
| Zod | ^4.4 | Validação de schemas |
| dotenv | ^17.4 | Carregamento de variáveis de ambiente |
| PostgreSQL | 15.18 | Banco de dados relacional |
| Docker / Docker Compose | - | Infraestrutura do banco de dados |
| tsx | ^4.23 | Execução de TypeScript em desenvolvimento |
| ESLint | ^10.6 | Qualidade e padronização do código |

---

## Estrutura do Projeto

```
TechChallenge-2/
├── src/
│   ├── app.ts              # Ponto de entrada — configura e sobe o Express
│   ├── env/
│   │   └── index.ts        # Validação de variáveis de ambiente com Zod
│   ├── controllers/        # Handlers das rotas HTTP
│   ├── routes/             # Definição dos endpoints
│   └── services/           # Lógica de negócio e acesso ao banco
├── docker-compose.yml      # Serviço PostgreSQL
├── .env.example            # Template de variáveis de ambiente
├── tsconfig.json           # Configuração do TypeScript
├── eslint.config.js        # Configuração do ESLint
└── package.json
```

---

## Como Executar

### Pré-requisitos

- Node.js >= 18
- Docker e Docker Compose

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário (veja a seção [Variáveis de Ambiente](#variáveis-de-ambiente)).

### 3. Subir o banco de dados

```bash
docker-compose up -d
```

O PostgreSQL ficará disponível em `localhost:5433`.

### 4. Executar em desenvolvimento

```bash
npm run dev
```

A API iniciará em `http://localhost:3000` com hot-reload automático.

### 5. Build para produção

```bash
npm run build
npm start
```

---

## Endpoints da API

### Health Check

```
GET /health
```

Retorna o status da aplicação.

**Resposta:**
```json
{
  "status": "ok"
}
```

---

## Variáveis de Ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `PORT` | `3000` | Porta em que a API será executada |

---

## Experiências e Desafios

### Configuração do ambiente TypeScript + ESM

A combinação de TypeScript com ES Modules (`"type": "module"`) exigiu atenção especial nas configurações do `tsconfig.json`, em particular nas opções `module: ESNext` e `moduleResolution: bundler`. Imports relativos precisam incluir a extensão `.js` no código fonte para funcionar corretamente em runtime com Node.js puro — uma diferença em relação ao CommonJS que gerou confusão inicial.

### Validação de ambiente com Zod

Adotamos Zod para validar as variáveis de ambiente na inicialização em vez de apenas ler `process.env` diretamente. Isso elimina uma categoria inteira de bugs em tempo de execução (variável ausente, tipo errado) e falha explicitamente com mensagem legível se algo estiver errado antes de a aplicação subir.

### Express 5

A equipe optou pelo Express 5 (ainda em release candidate no momento do início do projeto), que traz tratamento nativo de erros assíncronos — eliminando a necessidade do padrão `try/catch` + `next(err)` em cada controller. O principal desafio foi a compatibilidade de tipagens (`@types/express@5`), que ainda apresentava divergências em alguns casos.

<!-- 
  Adicione aqui outros desafios enfrentados durante o desenvolvimento:
  - Dificuldades com a modelagem do banco de dados
  - Problemas de autenticação/autorização
  - Decisões de arquitetura que geraram debate
  - Qualquer incidente ou aprendizado relevante
-->
