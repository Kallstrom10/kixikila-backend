import { z } from "zod";

// DTO para validar os dados da criação de uma carteira
export const CreateCarteiraDTO = z.object({
  usuarioId: z
    .string()
    .uuid("O ID do usuário deve ser um UUID válido."),
});

export type CreateCarteiraDTO = z.infer<typeof CreateCarteiraDTO>; 
