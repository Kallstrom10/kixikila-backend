import type { FastifyInstance } from "fastify";
import { obterUserService } from "../services/user/obter-user";

export function obterUser(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>(
    "/obter-usuario/:userId",
    async (req, res) => {
      try {
        return await obterUserService(req, res);
      } catch (error: any) {
        console.error("Erro na rota obter usuário:", error);
        return res.status(500).send({
          message: "Erro interno ao obter usuário.",
          detalhes: error.message || "Erro desconhecido.",
        });
      }
    }
  );
}
