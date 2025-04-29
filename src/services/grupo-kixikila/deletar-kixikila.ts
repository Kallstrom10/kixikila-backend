import { FastifyReply } from "fastify";
import { prisma } from "../prisma";

export async function deletarKixikilaService(
  kixikilaId: string,
  res: FastifyReply
) {
  try {
    // Verificar se o grupo Kixikila existe
    const kixikilaExistente = await prisma.kixikila.findUnique({
      where: { id: kixikilaId },
    });

    if (!kixikilaExistente) {
      return res.status(404).send({
        mensagem: "Grupo Kixikila não encontrado.",
      });
    }

    // Deletar o grupo Kixikila
    await prisma.kixikila.delete({
      where: { id: kixikilaId },
    });

    return res.status(200).send({
    });
  } catch (error) {
    console.error("Erro ao deletar grupo Kixikila:", error);
    return res.status(500).send({
      mensagem: "Erro interno ao deletar grupo Kixikila.",
      detalhes: error instanceof Error ? error.message : error,
    });
  }
}
