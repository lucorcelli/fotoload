-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" TEXT NOT NULL,
    "referencia_fabrica" VARCHAR(50),
    "codigo_barras" VARCHAR(50),
    "usuario_id" INTEGER NOT NULL,
    "nota_atual" INTEGER DEFAULT 0,
    "data_criacao" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "categoria_id" INTEGER NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoCampoExtra" (
    "id" SERIAL NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "campo" VARCHAR(50),
    "valor" TEXT,

    CONSTRAINT "ProdutoCampoExtra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoFoto" (
    "id" SERIAL NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "conteudo" BYTEA NOT NULL,
    "nome_arquivo" TEXT,
    "mime_type" TEXT,

    CONSTRAINT "ProdutoFoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoNota" (
    "id" SERIAL NOT NULL,
    "produto_id" INTEGER NOT NULL,
    "nota" INTEGER,
    "origem" VARCHAR(50),
    "usuario_id" INTEGER,
    "data_criacao" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "comentario" TEXT,

    CONSTRAINT "ProdutoNota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransacaoCredito" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "tipo" VARCHAR(20),
    "valor" INTEGER NOT NULL,
    "produto_id" INTEGER,
    "data_transacao" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "descricao" TEXT,

    CONSTRAINT "TransacaoCredito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100),
    "email" VARCHAR(100),
    "saldo_creditos" INTEGER DEFAULT 0,
    "saldo_debitos" INTEGER DEFAULT 0,
    "data_cadastro" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TableName" (
    "id" BIGSERIAL NOT NULL,
    "inserted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT timezone('utc'::text, now()),
    "data" JSONB,
    "name" TEXT,

    CONSTRAINT "TableName_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProdutoCampoExtra" ADD CONSTRAINT "ProdutoCampoExtra_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "Produto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProdutoFoto" ADD CONSTRAINT "ProdutoFoto_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoNota" ADD CONSTRAINT "ProdutoNota_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "Produto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProdutoNota" ADD CONSTRAINT "ProdutoNota_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TransacaoCredito" ADD CONSTRAINT "TransacaoCredito_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "Produto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TransacaoCredito" ADD CONSTRAINT "TransacaoCredito_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
