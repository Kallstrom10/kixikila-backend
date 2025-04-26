import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../prisma"

export async function listarUsersService(req: FastifyRequest, res: FastifyReply) {
  try {

    // Buscar todos os usuários do sistema
    const users = await prisma.user.findMany({
        omit:{
            senha: true,
            createdAt: true,
            updatedAt: true
        }
    });

    // Verificar se há usuários no sistema
    if (users.length === 0) {
      return res.status(404).send({ message: "Nenhum usuário encontrado." });
    }

    return res.status(200).send(users); 
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro interno ao listar usuários:", error.message); // Log detalhado
      return res.status(500).send({
        message: "Erro interno ao listar usuários.",
        detalhes: error.message,
      });
    } else {
      console.error("Erro desconhecido ao listar usuários:", error);
      return res.status(500).send({ message: "Erro interno desconhecido." });
    }
  }
}
