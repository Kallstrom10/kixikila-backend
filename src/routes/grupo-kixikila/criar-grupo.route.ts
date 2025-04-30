import { FastifyInstance } from "fastify";
import { criarKixikilaService } from "../../services/grupo-kixikila/criar-grupo";
import { CreateKixikilaDTO } from "../../dto/kixikila DTOs/create-kixikila.dto";

export async function criarKixikila(app: FastifyInstance) {
  app.post<{ Params: { id: string }; Body: CreateKixikilaDTO }>("/criar-kixikila/:id", async (req, res) => {
    try {
      const { id } = req.params; 
      const body = req.body;

      await criarKixikilaService(id, body, res);
    } catch (error) {
      console.error("Erro na rota de criação do grupo Kixikila:", error);
      return res.status(500).send({
        mensagem: "Erro interno na rota de criação do grupo Kixikila.",
      });
    }
  });
}