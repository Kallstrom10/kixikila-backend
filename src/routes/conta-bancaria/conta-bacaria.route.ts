import { FastifyInstance } from "fastify";
import { adicionarContaBancariaService } from "../../services/conta-bancaria/criar-conta";
import { CreateContaBancariaDTO } from "../../dto/conta-bancaria/criar-conta.dto";

export async function adicionarContaBancaria(app: FastifyInstance) {
  app.post<{ Body: CreateContaBancariaDTO }>("/adicionar-conta-bancaria", async (req, res) => {
    try {
      const body = req.body;

      // Chamar o serviço para adicionar conta bancária
      await adicionarContaBancariaService(body, res);
    } catch (error) {
      console.error("Erro na rota de adicionar conta bancária:", error);
      return res.status(500).send({
        mensagem: "Erro interno na rota de adicionar conta bancária.",
      });
    }
  });
}
