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

  // console.log("FILES NO SERVICE:", files);
  // console.log("BODY NO SERVICE:", body);

  if (!files.imagem_perfil || !files.imagem_bi_frente || !files.imagem_bi_verso) {
    return res.status(400).send({
      mensagem: "Imagens obrigatórias não foram enviadas.",
    });
  }

  if (telefone.length > 9) {
    return res.status(400).send({
      mensagem: "O número de telefone não pode ter mais de 9 dígitos.",
    });
  }

  try {
    const usuarioExistente = await prisma.user.findUnique({
      where: { telefone: Number(telefone) },
    });

    if (usuarioExistente) {
      return res.send("Já existe um usuário com este telefone, cadastre com outro.").status(409);
    }

    const senhaCriptografada = await bcrypt.hash(senha, SALT_ROUNDS);

    const novoUsuario = await prisma.user.create({
      data: {
        nome_completo,
        telefone: Number(telefone),
        senha: senhaCriptografada,
        imagem_perfil: files.imagem_perfil.filename,
        imagem_bi_frente: files.imagem_bi_frente.filename,
        imagem_bi_verso: files.imagem_bi_verso.filename,
        createdAt: ajustarFusoHorario(new Date(), timeZone),
        updatedAt: ajustarFusoHorario(new Date(), timeZone),
      },
    });

    // Gerar e criar uma carteira para o novo usuário
    const dataExpiracao = new Date();
    dataExpiracao.setFullYear(dataExpiracao.getFullYear() + 3); // Validade de 5 anos

    const cartaoGerado = BigInt(Math.floor(10 ** 17 + Math.random() * 9 * 10 ** 17)); // 18 dígitos únicos

    await prisma.carteira.create({
      data: {
        cartao: cartaoGerado,
        saldo: 0,
        validoAte: ajustarFusoHorario(dataExpiracao, timeZone),
        usuarioId: novoUsuario.id,
      },
    });

    return res.status(201).send({
      usuario: {
        id: novoUsuario.id,
        nome_completo: novoUsuario.nome_completo,
        telefone: novoUsuario.telefone,
        imagem_perfil: novoUsuario.imagem_perfil,
        carteira: {
          cartao: cartaoGerado.toString(),
          saldo: 0,
          validoAte: dataExpiracao.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Erro ao cadastrar usuário e carteira:", error);
    return res.status(500).send({
      mensagem: "Erro interno ao cadastrar usuário e carteira.",
    });
  }
}