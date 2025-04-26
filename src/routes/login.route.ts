import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import loginHandler from '../../auth/login';

export interface LoginParams {
  telefone: number;
  senha: string;
}

export function login(app: FastifyInstance) {
  app.get<{ Params: LoginParams }>('/login/:telefone/:senha', async (req: FastifyRequest<{ Params: LoginParams }>, res: FastifyReply) => {
    const { telefone, senha } = req.params; // Captura os parâmetros da URL
    const data: LoginParams = { telefone, senha }; // Monta o objeto `data`

    // Chama o loginHandler passando o objeto `data`
    return loginHandler(data, req, res);
  });
}
