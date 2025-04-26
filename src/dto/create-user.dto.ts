import { z } from "zod";

export const CreateUserDTO = z.object({
    nome_completo: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

    telefone: z
    .number()
    .int()
    .min(900000000, "Contacto inválido")
    .max(999999999, "Contacto inválido"),
    
    senha: z
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .max(64, 'A senha pode ter no máximo 64 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
    .regex(/[\W_]/, 'A senha deve conter pelo menos um caractere especial')
});

export type CreateUserDTO = z.infer<typeof CreateUserDTO>;