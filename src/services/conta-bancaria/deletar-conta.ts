import { FastifyReply } from "fastify";
import { prisma } from "../prisma";

export async function eliminarContaBancariaService(
  contaId: string,
  res: FastifyReply
) {
  try {
    // Verificar se a conta bancária existe
    const contaExistente = await prisma.contaBancaria.findUnique({
      where: { id: contaId }, // Utiliza o ID único para buscar a conta
    });

    if (!contaExistente) {
      return res.status(404).send({
        mensagem: "Conta bancária não encontrada.",
      });
    }

    // Deletar a conta bancária
    await prisma.contaBancaria.delete({
      where: { id: contaId },
    });

    return res.status(200).send({
      mensagem: "Conta bancária eliminada com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao eliminar conta bancária:", error);
    return res.status(500).send({
      mensagem: "Erro interno ao eliminar conta bancária.",
      detalhes: error instanceof Error ? error.message : error,
    });
  }
}
