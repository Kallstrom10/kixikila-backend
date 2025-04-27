import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../src/services/prisma';
import { comparePasswords } from '../auth/auth';
import { LoginParams } from '../src/routes/login.route';
import { error } from 'console';

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

export default async function loginHandler(data: LoginParams, req: FastifyRequest, res: FastifyReply) {
  const { telefone, senha } = data;
  const telefoneConvertido = Number(telefone)

  if (isNaN(telefoneConvertido)) {
    return res.status(400).send({error: "Telefone Inválido."})
  }

  try {
    // Busca o usuário pelo telefone
    const user = await prisma.user.findUnique({ where: { telefone: telefoneConvertido } });

    // Verifica se o usuário existe e se a senha está correta
    if (!user || !comparePasswords(senha, user.senha)) {
      return res.status(401).send({ message: 'Credenciais inválidas. Verifique seu telefone e senha.' });
    }

    // Criar uma sessão única para o usuário
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expired: false, // Controlar expiração se necessário
        createdAt: ajustarFusoHorario(new Date(), timeZone)
      },
    });

  // Configurar o cookie da sessão
  res.header('Set-Cookie', `sessionId=${session.id}; Path=/; HttpOnly; SameSite=Lax`);


    // Retorna os dados do usuário no corpo da resposta
    return res.status(200).send({
      id: user.id,
      nome_completo: user.nome_completo,
      telefone: user.telefone,
      imagem_perfil: user.imagem_perfil
    });
  } catch (error) {
    console.error('Erro durante o login:', error);
    return res.status(500).send({ message: 'Erro interno no servidor.' });
  }
}
