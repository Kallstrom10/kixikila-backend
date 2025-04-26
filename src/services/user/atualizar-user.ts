import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../prisma"
import { UpdateUserDTO } from "../../dto/update-user.dto";
import bcrypt from "bcrypt";
import { ZodError } from "zod";

const timeZone = "Africa/Luanda";

// Função para ajustar data ao fuso horário GMT+1
function ajustarFusoHorario(date: Date, timeZone: string): Date {
    const formatter = new Intl.DateTimeFormat("pt-PT", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const formattedParts = formatter.formatToParts(date);
    const [year, month, day, hour, minute, second] = [
        formattedParts.find((part) => part.type === "year")?.value,
        formattedParts.find((part) => part.type === "month")?.value,
        formattedParts.find((part) => part.type === "day")?.value,
        formattedParts.find((part) => part.type === "hour")?.value,
        formattedParts.find((part) => part.type === "minute")?.value,
        formattedParts.find((part) => part.type === "second")?.value,
    ];

    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
}

export async function atualizarUsuarioService(req: FastifyRequest, res: FastifyReply) {
  const { id } = req.params as { id: string };

  const userId = Number(id);
  if (isNaN(userId)) {
    return res.status(400).send({ error: "ID de usuário inválido." });
  }

  try {
    const dadosValidados = UpdateUserDTO.parse(req.body);

    const userExistente = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExistente) {
      return res.status(404).send({ error: "Usuário não encontrado." });
    }

    // Verificar se o telefone já está em uso por outro usuário
    const telefoneExiste = await prisma.user.findFirst({
      where: {
          telefone: dadosValidados.telefone,
          id: { not: userId },
      },
    });

    if (telefoneExiste) {
      return res.status(400).send({ message: "Este número de telefone já está em uso por outro usuário." });
    }

    let senhaFinal = userExistente.senha;
    if (dadosValidados.senha && dadosValidados.senha !== userExistente.senha) {
      const saltRounds = 10;
      senhaFinal = await bcrypt.hash(dadosValidados.senha, saltRounds);
    }

    const usuarioAtualizado = await prisma.user.update({
      where: { id: userId },
      data: {
        nome_completo: dadosValidados.nome_completo,
        telefone: dadosValidados.telefone,
        senha: senhaFinal,
        updatedAt: ajustarFusoHorario(new Date(), timeZone),
      },
      select: {
        id: true,
        nome_completo: true,
        telefone: true,
      },
    });

    return res.status(200).send(usuarioAtualizado);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).send({ error: "Dados inválidos.", detalhes: error.errors });
    }

    return res.status(500).send({ error: "Erro interno ao atualizar usuário." });
  }
}