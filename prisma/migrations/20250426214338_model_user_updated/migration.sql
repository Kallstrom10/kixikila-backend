/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "User_telefone_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_completo" TEXT NOT NULL,
    "telefone" INTEGER NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "imagem_perfil" TEXT,
    "imagem_bi_frente" TEXT,
    "imagem_bi_verso" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_sessoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME,
    CONSTRAINT "sessoes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_sessoes" ("createdAt", "expired", "expiresAt", "id", "userId") SELECT "createdAt", "expired", "expiresAt", "id", "userId" FROM "sessoes";
DROP TABLE "sessoes";
ALTER TABLE "new_sessoes" RENAME TO "sessoes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_telefone_key" ON "usuarios"("telefone");
