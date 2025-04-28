import type { FastifyInstance } from "fastify";
import { deletarUserService } from "../../services/user/deletar-usuario";

export function deletarUser(app: FastifyInstance) {
    app.delete<{ 
        Params: { id: string }; 
    }>(
        "/deletar-usuario/:id",
        async (req, res) => {
            try {
                const resultado = await deletarUserService(req, res);
                return res.status(200).send(resultado);
            } catch (error: any) {
                console.error("Erro na rota de deletar usuário:", error);
                return res.status(500).send({
                    message: "Erro interno ao deletar o usuário.",
                    detalhes: error.message || "Erro desconhecido.",
                });
            }
        }
    );
}
