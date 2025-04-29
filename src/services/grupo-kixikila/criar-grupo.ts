import { FastifyReply } from "fastify";
import { prisma } from "../prisma"; // Certifique-se de ter o cliente do Prisma configurado
import { CreateKixikilaDTO } from "../../dto/kixikila DTOs/create-kixikila.dto";

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

export async function criarKixikilaService(
    body: CreateKixikilaDTO,
    res: FastifyReply
  ) {
    try {
      // Validar os dados recebidos
      const dadosValidados = CreateKixikilaDTO.parse(body);
  
      // Verificar se o adminId existe
      const adminExiste = await prisma.user.findUnique({
        where: { id: dadosValidados.adminId },
      });
  
      if (!adminExiste) {
        return res.status(404).send({
          mensagem: "O administrador não foi encontrado.",
        });
      }
  
      // Ajustar a data de início ao fuso horário
      const inicioAjustado = ajustarFusoHorario(new Date(dadosValidados.inicio), timeZone);
  
      // Criar o grupo Kixikila
      const novoKixikila = await prisma.kixikila.create({
        data: {
          grupo: dadosValidados.grupo,
          valor: dadosValidados.valor,
          limiteDeMembros: dadosValidados.limiteDeMembros,
          adminId: dadosValidados.adminId,
          inicio: inicioAjustado, // Data ajustada com fuso horário
          frequencia: dadosValidados.frequencia,
        },
      });
  
      return res.status(201).send({
        grupo: novoKixikila,
      });
    } catch (error) {
      console.error("Erro ao criar grupo Kixikila:", error);
      return res.status(500).send({
        mensagem: "Erro interno ao criar grupo Kixikila.",
        detalhes: error instanceof Error ? error.message : error,
      });
    }
  }
  