import { FastifyReply } from "fastify";
import { prisma } from "../prisma";
import { CreateContaBancariaDTO } from "../../dto/conta-bancaria/criar-conta.dto";

export async function adicionarContaBancariaService(
    body: CreateContaBancariaDTO,
    res: FastifyReply
  ) {
    try {
      // Validar os dados recebidos
      const dadosValidados = CreateContaBancariaDTO.parse(body);
  
      // Verificar se o IBAN já está associado a uma conta
      const contaExistente = await prisma.contaBancaria.findFirst({
        where: { iban: dadosValidados.iban }, // IBAN tratado como BigInt
      });
  
      if (contaExistente) {
        return res.status(409).send({
          mensagem: "Este IBAN já está associado a outra conta bancária.",
        });
      }
  
      // Verificar se o usuário existe no banco
      const usuarioExiste = await prisma.user.findUnique({
        where: { id: dadosValidados.usuarioId },
      });
  
      if (!usuarioExiste) {
        return res.status(404).send({
          mensagem: "Usuário não encontrado.",
        });
      }
      
      // Criar a conta bancária
      const novaConta = await prisma.contaBancaria.create({
        data: {
          iban: dadosValidados.iban, // IBAN tratado como BigInt
          ordenante: usuarioExiste.nome_completo, // Nome do usuário será usado como ordenante
          usuarioId: dadosValidados.usuarioId,
          userAgreedTerms: dadosValidados.userAgreedTerms,
        },
      });
  
      return res.status(201).send({
        mensagem: "Conta bancária adicionada com sucesso.",
        conta: {
          ...novaConta,
          iban: novaConta.iban.toString(), // Convertendo BigInt para string para retornar na resposta
        },
      });
    } catch (error) {
      console.error("Erro ao adicionar conta bancária:", error);
      return res.status(500).send({
        mensagem: "Erro interno ao adicionar conta bancária.",
        detalhes: error instanceof Error ? error.message : error,
      });
    }
  }
  