import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    customFields?: {
      nome_completo?: string;
      telefone?: string;
      senha?: string;
    };
  }
}
