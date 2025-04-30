import { FastifyReply } from "fastify";
import { prisma } from "../prisma";
import { CreateConvidadoDTO } from "../../dto/convidado/criar-convidado.dto";

export async function criarConviteService(
  body: CreateConvidadoDTO,
  res: FastifyReply
) {
  try {
    // Validar os dados recebidos
    const dadosValidados = CreateConvidadoDTO.parse(body);

    // Verificar se o grupo Kixikila existe
    const grupoExiste = await prisma.kixikila.findUnique({
      where: { id: dadosValidados.kixikilaId },
    });

    if (!grupoExiste) {
      return res.status(404).send({
        mensagem: "O grupo Kixikila especificado não foi encontrado.",
      });
    }

    // Verificar se o usuário que enviou o convite existe
    const convidadorExiste = await prisma.user.findUnique({
      where: { id: dadosValidados.conviteEnviadoPor },
    });

    if (!convidadorExiste) {
      return res.status(404).send({
        mensagem: "O usuário que enviou o convite não foi encontrado.",
      });
    }

    // Verificar se o usuário convidado já está no grupo
    const conviteExistente = await prisma.convidado.findUnique({
      where: { kixikilaId_usuarioId: { kixikilaId: dadosValidados.kixikilaId, usuarioId: dadosValidados.usuarioId } },
    });

    if (conviteExistente) {
      return res.status(409).send({
        mensagem: "Este usuário já foi convidado para este grupo.",
      });
    }

    // Criar o convite
    const novoConvite = await prisma.convidado.create({
      data: {
        kixikilaId: dadosValidados.kixikilaId,
        usuarioId: dadosValidados.usuarioId,
        conviteEnviadoPor: dadosValidados.conviteEnviadoPor,
        status: dadosValidados.status,
        dataConvite: new Date(),
      },
    });

    return res.status(201).send({
      mensagem: "Convite enviado com sucesso.",
      convite: novoConvite,
    });
  } catch (error) {
    console.error("Erro ao enviar convite:", error);
    return res.status(500).send({
      mensagem: "Erro interno ao enviar convite.",
      detalhes: error instanceof Error ? error.message : error,
    });
  }
}
