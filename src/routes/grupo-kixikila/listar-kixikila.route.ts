import { FastifyInstance } from "fastify";
import { listarKixikilasService } from "../../services/grupo-kixikila/listar-kixikila";

export async function listarKixikilas(app: FastifyInstance) {
  app.get("/listar-kixikilas", async (req, res) => {
    try {
      // Chamar o serviço para listar todas as Kixikilas
      await listarKixikilasService(res);
    } catch (error) {
      console.error("Erro na rota de listar Kixikilas:", error);
      return res.status(500).send({
        mensagem: "Erro interno na rota de listar Kixikilas.",
      });
    }
  });
}
