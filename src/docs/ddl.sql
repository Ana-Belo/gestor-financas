CREATE TABLE "usuarios" (
  "id" uuid PRIMARY KEY,
  "email" varchar UNIQUE,
  "data_criacao" timestamp,
  "data_atualizacao" timestamp
);

CREATE TYPE tipo_conta AS ENUM ('carteira', 'conta corrente', 'conta digital');

CREATE TABLE "contas" (
  "id" uuid PRIMARY KEY,
  "usuario_id" uuid,
  "nome" varchar,
  "tipo" tipo_conta,
  "saldo_inicial" decimal,
  "data_criacao" timestamp,
  "data_atualizacao" timestamp
);

CREATE TYPE tipo_categoria AS ENUM ('receita', 'despesa');

CREATE TABLE "categorias" (
  "id" uuid PRIMARY KEY,
  "usuario_id" uuid,
  "nome" varchar,
  "tipo" tipo_categoria,
  "icone" varchar,
  "data_criacao" timestamp,
  "data_atualizacao" timestamp
);

CREATE TYPE tipo_transacao AS ENUM ('Receita', 'Despesa');

CREATE TABLE "transacoes" (
  "id" uuid PRIMARY KEY,
  "usuario_id" uuid,
  "conta_id" uuid,
  "categoria_id" uuid,
  "tipo" tipo_transacao,
  "valor" decimal,
  "descricao" text,
  "data" date,
  "recorrente" boolean DEFAULT false,
  "parcela_atual" integer,
  "total_parcelas" integer,
  "data_criacao" timestamp,
  "data_atualizacao" timestamp
);

CREATE TABLE "orcamentos" (
  "id" uuid PRIMARY KEY,
  "usuario_id" uuid,
  "categoria_id" uuid,
  "valor_limite" decimal,
  "mes_ano" varchar,
  "data_criacao" timestamp,
  "data_atualizacao" timestamp
);

CREATE TYPE tipo_notificacao AS ENUM ('conta_vencimento', 'resumo_financeiro', 'outro');

CREATE TABLE "notificacoes" (
  "id" uuid PRIMARY KEY,
  "usuario_id" uuid,
  "tipo" tipo_notificacao,
  "mensagem" text,
  "enviada" boolean DEFAULT false,
  "data_envio" timestamp,
  "data_criacao" timestamp,
  "data_atualizacao" timestamp
);

CREATE TABLE "mascotes" (
  "id" uuid PRIMARY KEY,
  "nome" varchar,
  "imagem_url" text,
  "preco_moedas" integer,
  "data_criacao" timestamp,
  "data_atualizacao" timestamp
);

CREATE TABLE "mascotes_usuarios" (
  "id" uuid PRIMARY KEY,
  "usuario_id" uuid,
  "mascote_id" uuid,
  "nivel" integer DEFAULT 1,
  "data_criacao" timestamp,
  "data_atualizacao" timestamp
);

CREATE TABLE "conquistas" (
  "id" uuid PRIMARY KEY,
  "nome" varchar,
  "descricao" text,
  "recompensa_moedas" integer,
  "data_criacao" timestamp,
  "data_atualizacao" timestamp
);

CREATE TABLE "conquistas_usuarios" (
  "id" uuid PRIMARY KEY,
  "usuario_id" uuid,
  "conquista_id" uuid,
  "data_conquista" timestamp
);

CREATE TABLE "desafios" (
  "id" uuid PRIMARY KEY,
  "nome" varchar,
  "descricao" text,
  "recompensa_moedas" integer,
  "duracao_dias" integer,
  "data_criacao" timestamp,
  "data_atualizacao" timestamp
);

CREATE TYPE status_desafio AS ENUM ('em progresso', 'concluido', 'falhou');

CREATE TABLE "desafios_usuarios" (
  "id" uuid PRIMARY KEY,
  "usuario_id" uuid,
  "desafio_id" uuid,
  "status" status_desafio,
  "data_inicio" timestamp,
  "data_fim" timestamp
);

ALTER TABLE
  "contas"
ADD
  FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id");

ALTER TABLE
  "categorias"
ADD
  FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id");

ALTER TABLE
  "transacoes"
ADD
  FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id");

ALTER TABLE
  "transacoes"
ADD
  FOREIGN KEY ("conta_id") REFERENCES "contas" ("id");

ALTER TABLE
  "transacoes"
ADD
  FOREIGN KEY ("categoria_id") REFERENCES "categorias" ("id");

ALTER TABLE
  "orcamentos"
ADD
  FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id");

ALTER TABLE
  "orcamentos"
ADD
  FOREIGN KEY ("categoria_id") REFERENCES "categorias" ("id");

ALTER TABLE
  "notificacoes"
ADD
  FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id");

ALTER TABLE
  "mascotes_usuarios"
ADD
  FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id");

ALTER TABLE
  "mascotes_usuarios"
ADD
  FOREIGN KEY ("mascote_id") REFERENCES "mascotes" ("id");

ALTER TABLE
  "conquistas_usuarios"
ADD
  FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id");

ALTER TABLE
  "conquistas_usuarios"
ADD
  FOREIGN KEY ("conquista_id") REFERENCES "conquistas" ("id");

ALTER TABLE
  "desafios_usuarios"
ADD
  FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id");

ALTER TABLE
  "desafios_usuarios"
ADD
  FOREIGN KEY ("desafio_id") REFERENCES "desafios" ("id");