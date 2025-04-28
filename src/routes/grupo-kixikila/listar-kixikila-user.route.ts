import { FastifyInstance } from "fastify";
import { listarKixikilasUsuarioService } from "../../services/grupo-kixikila/listar-kixikila-user";

export async function listarKixikilasUsuario(app: FastifyInstance) {
  app.get<{ Params: { usuarioId: string } }>(
    "/listar-kixikilas-usuario/:usuarioId",
    async (req, res) => {
      try {
        const { usuarioId } = req.params;

        // Chamar o serviço para listar os grupos Kixikila do usuário
        await listarKixikilasUsuarioService(usuarioId, res);
      } catch (error) {
        console.error("Erro na rota de listar Kixikilas do usuário:", error);
        return res.status(500).send({
          mensagem: "Erro interno na rota de listar Kixikilas do usuário.",
        });
      }
    }
  );
}
