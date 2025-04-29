import { FastifyReply } from "fastify";
import { prisma } from "../prisma";

export async function listarKixikilasUsuarioService(
  usuarioId: string,
  res: FastifyReply
) {
  try {
    // Buscar os grupos Kixikila onde o usuário é membro
    const gruposDoUsuario = await prisma.usuarioKixikila.findMany({
      where: { usuarioId },
      include: {
        kixikila: {
          include: {
            admin: true, // Inclui as informações do administrador
          },
        },
      },
    });

    // Verificar se o usuário faz parte de algum grupo
    if (gruposDoUsuario.length === 0) {
      return res.status(404).send({
        mensagem: "O usuário não faz parte de nenhum grupo Kixikila.",
      });
    }

    // Mapeando os resultados para retornar apenas os dados relevantes
    const gruposFormatados = gruposDoUsuario.map((grupoUsuario) => {
      const { kixikila } = grupoUsuario;
      return {
        id: kixikila.id,
        grupo: kixikila.grupo,
        valor: kixikila.valor,
        limiteDeMembros: kixikila.limiteDeMembros,
        inicio: kixikila.inicio,
        frequencia: kixikila.frequencia,
        admin: {
          id: kixikila.admin.id,
          nome: kixikila.admin.nome_completo,
        },
      };
    });

    return res.status(200).send({
      grupos: gruposFormatados,
    });
  } catch (error) {
    console.error("Erro ao listar grupos Kixikila do usuário:", error);
    return res.status(500).send({
      mensagem: "Erro interno ao listar grupos Kixikila do usuário.",
      detalhes: error instanceof Error ? error.message : error,
    });
  }
}
