import { FastifyInstance } from "fastify";
import { criarKixikilaService } from "../../services/grupo-kixikila/criar-grupo";
import { CreateKixikilaDTO } from "../../dto/kixikila DTOs/create-kixikila.dto";

export async function criarKixikila(app: FastifyInstance) {
  app.post<{ Body: CreateKixikilaDTO }>("/criar-kixikila", async (req, res) => {
    try {
      const body = req.body;

      // Chamar o serviço para criar o grupo Kixikila
      await criarKixikilaService(body, res);
    } catch (error) {
      console.error("Erro na rota de criação do grupo Kixikila:", error);
      return res.status(500).send({
        mensagem: "Erro interno na rota de criação do grupo Kixikila.",
      });
    }
  });
}
