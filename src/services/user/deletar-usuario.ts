import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../prisma"

export async function deletarUserService(
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply
) {
    const { id } = req.params;
    const userId = Number(id);

    // Verifica se o ID é válido
    if (isNaN(userId)) {
        return res.status(400).send({ message: "ID inválido. O ID deve ser um número válido." });
    }

    try {
        // Busca o usuário para verificar se existe
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).send({ message: "Usuário inexistente." });
        }

        // Deletar o usuário do banco de dados
        await prisma.user.delete({
            where: { id: userId },
        });

        return res.status(200).send({
            message: "Usuário deletado com sucesso!",
            pacienteId: userId,
        });
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        return res.status(500).send({
            message: "Erro interno ao deletar usuário.",
            error,
        });
    }
}
