import { FastifyReply } from "fastify";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";
import { MultipartFile } from "@fastify/multipart";
import fs from "fs";
import path from "path";

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

// Função para gerar nomes únicos para imagens
function gerarNomeArquivo(
  userNomeCompleto: string,
  userTelefone: string,
  dataAtual: string,
  fieldname: string,
  fileExtension: string
): string {
  switch (fieldname) {
    case "imagem_perfil":
      return `selfie-${userTelefone}-${userNomeCompleto}-${dataAtual}${fileExtension}`;
    case "imagem_bi_frente":
      return `bilhete-frente-${userTelefone}-${userNomeCompleto}-${dataAtual}${fileExtension}`;
    case "imagem_bi_verso":
      return `bilhete-traseira-${userTelefone}-${userNomeCompleto}-${dataAtual}${fileExtension}`;
    default:
      return `arquivo-${dataAtual}${fileExtension}`;
  }
}

export async function atualizarUsuarioService(
  id: string,
  body: Record<string, string>,
  files: Record<string, MultipartFile>,
  res: FastifyReply
) {
  const userId = Number(id);

  if (isNaN(userId)) {
    return res.status(400).send({ mensagem: "ID de usuário inválido." });
  }

  // Verificação se o telefone excede o limite de dígitos
  if (body.telefone && body.telefone.length > 9) {
    return res.status(400).send({
      mensagem: "O número de telefone não pode ter mais de 9 dígitos.",
    });
  }

  try {
    const userExistente = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExistente) {
      return res.status(404).send({ mensagem: "Usuário não encontrado." });
    }

    // Verificar se o telefone já está em uso por outro usuário
    if (body.telefone) {
      const telefoneExiste = await prisma.user.findFirst({
        where: {
          telefone: Number(body.telefone),
          id: { not: userId },
        },
      });

      if (telefoneExiste) {
        return res.status(400).send({
          mensagem: "Este número de telefone já está em uso por outro usuário.",
        });
      }
    }

    let senhaFinal = userExistente.senha;
    if (body.senha && body.senha !== userExistente.senha) {
      const saltRounds = 10;
      senhaFinal = await bcrypt.hash(body.senha, saltRounds);
    }

    // Ajustar nomes das imagens e salvar no disco
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const dataAtual = new Date().toISOString().replace(/[:.-]/g, "");

    const imagensAtualizadas = {
      imagem_perfil: files.imagem_perfil
        ? gerarNomeArquivo(
            body.nome_completo || userExistente.nome_completo,
            body.telefone || userExistente.telefone.toString(),
            dataAtual,
            "imagem_perfil",
            path.extname(files.imagem_perfil.filename)
          )
        : userExistente.imagem_perfil,

      imagem_bi_frente: files.imagem_bi_frente
        ? gerarNomeArquivo(
            body.nome_completo || userExistente.nome_completo,
            body.telefone || userExistente.telefone.toString(),
            dataAtual,
            "imagem_bi_frente",
            path.extname(files.imagem_bi_frente.filename)
          )
        : userExistente.imagem_bi_frente,

      imagem_bi_verso: files.imagem_bi_verso
        ? gerarNomeArquivo(
            body.nome_completo || userExistente.nome_completo,
            body.telefone || userExistente.telefone.toString(),
            dataAtual,
            "imagem_bi_verso",
            path.extname(files.imagem_bi_verso.filename)
          )
        : userExistente.imagem_bi_verso,
    };

    const usuarioAtualizado = await prisma.user.update({
      where: { id: userId },
      data: {
        nome_completo: body.nome_completo || userExistente.nome_completo,
        telefone: body.telefone ? Number(body.telefone) : userExistente.telefone,
        senha: senhaFinal,
        imagem_perfil: imagensAtualizadas.imagem_perfil,
        imagem_bi_frente: imagensAtualizadas.imagem_bi_frente,
        imagem_bi_verso: imagensAtualizadas.imagem_bi_verso,
        updatedAt: ajustarFusoHorario(new Date(), timeZone),
      },
    });

    return res.status(200).send({
      mensagem: "Usuário atualizado com sucesso.",
      usuario: {
        id: usuarioAtualizado.id,
        nome_completo: usuarioAtualizado.nome_completo,
        telefone: usuarioAtualizado.telefone, // Converte BigInt para string
        imagens: {
          perfil: usuarioAtualizado.imagem_perfil,
          bi_frente: usuarioAtualizado.imagem_bi_frente,
          bi_verso: usuarioAtualizado.imagem_bi_verso,
        },
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).send({
      mensagem: "Erro interno ao atualizar usuário.",
    });
  }
}
