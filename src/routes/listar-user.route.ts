import type { FastifyInstance } from "fastify";
import { listarUsersService } from "../services/user/listar-user";

export async function listarUsers(app: FastifyInstance) {
    app.get(
        "/listar-usuarios",
        async (req, res) => listarUsersService(req, res)
    );
}

