import { z } from "zod";

// DTO para validar os dados do grupo Kixikila
export const CreateKixikilaDTO = z.object({
  grupo: z
    .string()
    .min(3, "O nome do grupo deve ter pelo menos 3 caracteres")
    .max(100, "O nome do grupo pode ter no máximo 100 caracteres"),
  valor: z
    .number()
    .positive("O valor deve ser maior que zero")
    .int("O valor deve ser um número inteiro"),
  limiteDeMembros: z
    .number()
    .positive("O limite de membros deve ser maior que zero")
    .int("O limite de membros deve ser um número inteiro")
    .lte(50, "O limite máximo de membros é 50"), // Limite de 50 membros por grupo
  adminId: z
    .string()
    .uuid("O ID do administrador deve ser um UUID válido"),
  inicio: z
    .string()
    .refine((data) => !isNaN(Date.parse(data)), "A data de início deve ser uma data válida"), // Valida que é uma data
  frequencia: z.enum(["DIARIA", "SEMANAL", "QUINZENAL", "MENSAL", "ANUAL"]), // Frequências aceitas corrigidas
});

export type CreateKixikilaDTO = z.infer<typeof CreateKixikilaDTO>;
