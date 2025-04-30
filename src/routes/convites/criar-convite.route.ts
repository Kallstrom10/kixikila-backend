import { FastifyInstance } from "fastify";
import { criarConviteService } from "../../services/convites/criar-convite";
import { CreateConvidadoDTO } from "../../dto/convidado/criar-convidado.dto";

export async function criarConvite(app: FastifyInstance) {
    app.post<{ Params: { kixikilaId: string }; Body: CreateConvidadoDTO }>("/kixikila/:kixikilaId/convidar", async (req, res) => {
    try {
      const body = req.body;
      const kixikilaId: string = req.params.kixikilaId;

      // Adicionar `kixikilaId` nos dados para garantir que está sendo enviado
      const conviteComGrupo = { ...body, kixikilaId };

      await criarConviteService(conviteComGrupo, res);
    } catch (error) {
      console.error("Erro na rota de convite:", error);
      return res.status(500).send({
        mensagem: "Erro interno na rota de convite.",
      });
    }
  });
}
