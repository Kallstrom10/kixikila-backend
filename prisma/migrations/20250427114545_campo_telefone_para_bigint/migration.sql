/*
  Warnings:

  - You are about to alter the column `telefone` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_completo" TEXT NOT NULL,
    "telefone" BIGINT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "imagem_perfil" TEXT,
    "imagem_bi_frente" TEXT,
    "imagem_bi_verso" TEXT
);
INSERT INTO "new_usuarios" ("createdAt", "id", "imagem_bi_frente", "imagem_bi_verso", "imagem_perfil", "nome_completo", "senha", "telefone", "updatedAt") SELECT "createdAt", "id", "imagem_bi_frente", "imagem_bi_verso", "imagem_perfil", "nome_completo", "senha", "telefone", "updatedAt" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_telefone_key" ON "usuarios"("telefone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
