import { FastifyInstance } from "fastify";
import { atualizarUsuarioService } from "../services/user/atualizar-user";
import { UpdateUserDTO } from "../dto/update-user.dto";

export async function atualizarUser(app: FastifyInstance) {
    app.patch<{ Params: { id: string }; Body: UpdateUserDTO }>(
        "/atualizar-usuario/:id",
        async (req, res) => atualizarUsuarioService(req, res)
    );
}








