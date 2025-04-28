import { z } from "zod";

// DTO para validar os dados da conta bancária com IBAN como BigInt
export const CreateContaBancariaDTO = z.object({
  iban: z
    .string()
    .refine((iban) => /^\d{21}$/.test(iban), "O IBAN deve conter exatamente 21 números.")
    .transform((iban) => BigInt(iban)), // Converte o valor para BigInt
  ordenante: z
    .string()
    .min(3, "O nome do ordenante deve ter pelo menos 3 caracteres.")
    .max(100, "O nome do ordenante pode ter no máximo 100 caracteres."),
  usuarioId: z
    .string()
    .uuid("O ID do usuário deve ser um UUID válido."),
  userAgreedTerms: z
    .boolean()
    .refine((value) => value === true, "É necessário aceitar os termos para adicionar a conta."),
});

export type CreateContaBancariaDTO = z.infer<typeof CreateContaBancariaDTO>;
