import { FastifyReply } from "fastify";
import { prisma } from "../prisma";

export async function listarKixikilasService(res: FastifyReply) {
  try {
    // Buscar todas as Kixikilas no banco de dados
    const kixikilas = await prisma.kixikila.findMany({
      include: {
        admin: true, // Inclui os dados do administrador
        membros: true, // Inclui os membros associados
      },
    });

    // Retornar as Kixikilas encontradas
    return res.status(200).send({
      kixikilas,
    });
  } catch (error) {
    console.error("Erro ao listar Kixikilas:", error);
    return res.status(500).send({
      mensagem: "Erro interno ao listar Kixikilas.",
      detalhes: error instanceof Error ? error.message : error,
    });
  }
}
