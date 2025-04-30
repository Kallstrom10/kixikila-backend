import { z } from "zod";

export const CreateConvidadoDTO = z.object({
  kixikilaId: z.string().uuid("O ID do grupo Kixikila deve ser um UUID válido."),
  usuarioId: z.string().uuid("O ID do usuário convidado deve ser um UUID válido."),
  conviteEnviadoPor: z.string().uuid("O ID do usuário que enviou o convite deve ser um UUID válido."),
  status: z.enum(["APROVADO", "PENDENTE", "NEGADO"]).default("PENDENTE"), // Enum com status padronizado
  dataConvite: z.date().default(new Date()), // Define a data automaticamente
});

export type CreateConvidadoDTO = z.infer<typeof CreateConvidadoDTO>;
