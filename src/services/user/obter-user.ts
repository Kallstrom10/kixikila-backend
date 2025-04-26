import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../prisma"

export async function obterUserService(req: FastifyRequest, res: FastifyReply) {
  try {
    const userIdParam = (req.params as any).userId;

    if (!userIdParam || isNaN(Number(userIdParam))) {
      return res.status(400).send({ message: "ID do usuário inválido ou ausente." });
    }

    const userId = Number(userIdParam);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome_completo: true,
        telefone: true,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "Usuário não encontrado." });
    }

    return res.status(200).send(user);
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    return res.status(500).send({
      message: "Erro interno ao buscar o usuário.",
      detalhes: error instanceof Error ? error.message : "Erro desconhecido.",
    });
  }
}