import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../prisma"
import { CreateUserDTO } from "../../dto/create-user.dto";
import bcrypt from "bcrypt";

const timeZone = "Africa/Luanda"; // Fuso GMT+1 para Angola

// Função para ajustar data no fuso horário GMT+1
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

const SALT_ROUNDS = 10;

export async function cadastrarUsuarioService(
  request: FastifyRequest<{ Body: CreateUserDTO }>,
  reply: FastifyReply
) {
  const { nome_completo, telefone, senha } = request.body;

  try {
    // Verifica se o telefone já está em uso
    const usuarioExistente = await prisma.user.findUnique({
      where: { telefone: Number(telefone) }
    });

    if (usuarioExistente) {
      return reply.status(409).send({ mensagem: "Já existe um usuário com este telefone, cadastre com outro." });
    }

    // Criptografa a senha
    const senhaCriptografada = await bcrypt.hash(senha, SALT_ROUNDS);

    // Cria o novo usuário
    const novoUsuario = await prisma.user.create({
      data: {
        nome_completo,
        telefone,
        senha: senhaCriptografada,
      }
    });

    return reply.status(201).send({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario: {
        id: novoUsuario.id,
        nome_completo: novoUsuario.nome_completo,
        telefone: novoUsuario.telefone,
        criadoEm: ajustarFusoHorario(new Date(), timeZone),
      }
    });

  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return reply.status(500).send({ mensagem: "Erro interno ao cadastrar usuário." });
  }
}