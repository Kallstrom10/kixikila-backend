import { FastifyInstance } from "fastify";
import { deletarKixikilaService } from "../../services/grupo-kixikila/deletar-kixikila";

export async function deletarKixikila(app: FastifyInstance) {
  app.delete<{ Params: { id: string } }>(
    "/deletar-kixikila/:id",
    async (req, res) => {
      try {
        const { id } = req.params;

        // Chamar o serviço para deletar o grupo Kixikila
        await deletarKixikilaService(id, res);
      } catch (error) {
        console.error("Erro na rota de deleção de Kixikila:", error);
        return res.status(500).send({
          mensagem: "Erro interno na rota de deleção de Kixikila.",
        });
      }
    }
  );
}
