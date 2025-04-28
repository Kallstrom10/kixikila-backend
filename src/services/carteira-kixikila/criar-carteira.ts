import { FastifyReply } from "fastify";
import { prisma } from "../prisma";
import { CreateCarteiraDTO } from "../../dto/carteira-kixikila/carteira-kixikila.dto";

export async function criarCarteiraService(
  body: CreateCarteiraDTO,
  res: FastifyReply
) {
  try {
    // Validar os dados recebidos
    const dadosValidados = CreateCarteiraDTO.parse(body);

    // Verificar se o usuário existe
    const usuarioExiste = await prisma.user.findUnique({
      where: { id: dadosValidados.usuarioId },
    });

    if (!usuarioExiste) {
      return res.status(404).send({
        mensagem: "Usuário não encontrado.",
      });
    }

    // Verificar se o usuário já possui uma carteira
    const carteiraExistente = await prisma.carteira.findUnique({
      where: { usuarioId: dadosValidados.usuarioId },
    });

    if (carteiraExistente) {
      return res.status(409).send({
        mensagem: "O usuário já possui uma carteira.",
      });
    }

    // Gerar dados da carteira
    const cartaoGerado = BigInt(Math.floor(10 ** 17 + Math.random() * 9 * 10 ** 17)); // Gerar número único de 18 dígitos
    const dataExpiracao = new Date();
    dataExpiracao.setFullYear(dataExpiracao.getFullYear() + 5); // Validade de 5 anos

    // Criar a carteira no banco
    const novaCarteira = await prisma.carteira.create({
      data: {
        cartao: cartaoGerado,
        saldo: 0,
        validoAte: dataExpiracao,
        usuarioId: dadosValidados.usuarioId,
      },
    });

    return res.status(201).send({
      mensagem: "Carteira criada com sucesso.",
      carteira: {
        id: novaCarteira.id,
        cartao: novaCarteira.cartao.toString(), // Convertendo BigInt para string
        saldo: novaCarteira.saldo,
        validoAte: novaCarteira.validoAte,
        // usuarioId: novaCarteira.usuarioId,
      },
    });
  } catch (error) {
    console.error("Erro ao criar carteira:", error);
    return res.status(500).send({
      mensagem: "Erro interno ao criar carteira.",
      detalhes: error instanceof Error ? error.message : error,
    });
  }
}
