-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome_completo" TEXT NOT NULL,
    "telefone" INTEGER NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "imagem_perfil" TEXT,
    "imagem_bi_frente" TEXT,
    "imagem_bi_verso" TEXT
);

-- CreateTable
CREATE TABLE "sessoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME,
    CONSTRAINT "sessoes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Kixikila" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "grupo" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "limiteDeMembros" INTEGER NOT NULL,
    "adminId" TEXT NOT NULL,
    "inicio" DATETIME NOT NULL,
    "frequencia" TEXT NOT NULL,
    CONSTRAINT "Kixikila_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UsuarioKixikila" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_kixikila" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    CONSTRAINT "UsuarioKixikila_id_kixikila_fkey" FOREIGN KEY ("id_kixikila") REFERENCES "Kixikila" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UsuarioKixikila_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContaBancaria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "iban" TEXT NOT NULL,
    "ordenante" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "userAgreedTerms" BOOLEAN NOT NULL,
    CONSTRAINT "ContaBancaria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Carteira" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cartao" BIGINT NOT NULL,
    "saldo" INTEGER NOT NULL DEFAULT 0,
    "validoAte" DATETIME NOT NULL,
    "usuarioId" TEXT NOT NULL,
    CONSTRAINT "Carteira_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_telefone_key" ON "usuarios"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioKixikila_usuarioId_id_kixikila_key" ON "UsuarioKixikila"("usuarioId", "id_kixikila");

-- CreateIndex
CREATE UNIQUE INDEX "ContaBancaria_usuarioId_key" ON "ContaBancaria"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Carteira_usuarioId_key" ON "Carteira"("usuarioId");
