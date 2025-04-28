import { FastifyInstance } from "fastify";
import { criarCarteiraService } from "../../services/carteira-kixikila/criar-carteira"; 
import { CreateCarteiraDTO } from "../../dto/carteira-kixikila/carteira-kixikila.dto";

export async function criarCarteira(app: FastifyInstance) {
  app.post<{ Body: CreateCarteiraDTO }>("/criar-carteira", async (req, res) => {
    try {
      const body = req.body;

      // Chamar o serviço para criar a carteira
      await criarCarteiraService(body, res);
    } catch (error) {
      console.error("Erro na rota de criação de carteira:", error);
      return res.status(500).send({
        mensagem: "Erro interno na rota de criação de carteira.",
      });
    }
  });
}
