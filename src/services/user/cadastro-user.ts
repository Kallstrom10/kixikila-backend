import { FastifyReply } from "fastify";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";
import { MultipartFile } from "@fastify/multipart";

const timeZone = "Africa/Luanda";

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
  body: Record<string, string>,
  files: Record<string, MultipartFile>,
  res: FastifyReply
) {
  const { nome_completo, telefone, senha } = body;

  console.log("FILES NO SERVICE:", files);
  console.log("BODY NO SERVICE:", body);

  // Verificação se todas as imagens obrigatórias foram enviadas
  if (!files.imagem_perfil || !files.imagem_bi_frente || !files.imagem_bi_verso) {
    return res.status(400).send({
      mensagem: "Imagens obrigatórias não foram enviadas.",
    });
  }

  // Verificação do comprimento do telefone
  if (telefone.length > 9) {
    return res.status(400).send({
      mensagem: "O número de telefone não pode ter mais de 9 dígitos.",
    });
  }

  try {
    // Verificar se o telefone já está em uso
    const usuarioExistente = await prisma.user.findUnique({
      where: { telefone: Number(telefone) },
    });

    if (usuarioExistente) {
      return res.status(409).send({
        mensagem: "Já existe um usuário com este telefone, cadastre com outro.",
      });
    }

    // Criptografar a senha
    const senhaCriptografada = await bcrypt.hash(senha, SALT_ROUNDS);

    // Criar o novo usuário
    const novoUsuario = await prisma.user.create({
      data: {
        nome_completo,
        telefone: Number(telefone),
        senha: senhaCriptografada,
        imagem_perfil: files.imagem_perfil.filename,
        imagem_bi_frente: files.imagem_bi_frente.filename,
        imagem_bi_verso: files.imagem_bi_verso.filename,
        createdAt: ajustarFusoHorario(new Date(), timeZone),
        updatedAt: ajustarFusoHorario(new Date(), timeZone)
      },
    });

    // Retornar sucesso
    return res.status(201).send({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario: {
        id: novoUsuario.id,
        nome_completo: novoUsuario.nome_completo,
        telefone: novoUsuario.telefone, // Converte BigInt para string
        imagens: {
          perfil: novoUsuario.imagem_perfil,
          bi_frente: novoUsuario.imagem_bi_frente,
          bi_verso: novoUsuario.imagem_bi_verso,
        },
      },
    });    
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return res.status(500).send({
      mensagem: "Erro interno ao cadastrar usuário.",
    });
  }
}
