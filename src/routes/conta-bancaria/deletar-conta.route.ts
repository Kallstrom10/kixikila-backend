import { FastifyInstance } from "fastify";
import { eliminarContaBancariaService } from "../../services/conta-bancaria/deletar-conta";

export async function eliminarContaBancaria(app: FastifyInstance) {
  app.delete<{ Params: { id: string } }>(
    "/eliminar-conta-bancaria/:id",
    async (req, res) => {
      try {
        const { id } = req.params;

        // Chamar o serviço para eliminar a conta bancária
        await eliminarContaBancariaService(id, res);
      } catch (error) {
        console.error("Erro na rota de eliminação de conta bancária:", error);
        return res.status(500).send({
          mensagem: "Erro interno na rota de eliminação de conta bancária.",
        });
      }
    }
  );
}
