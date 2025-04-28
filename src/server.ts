import fastify from "fastify";
import cors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart"; // Import do plugin multipart

const app = fastify({
    ajv: {
      customOptions: {
        strict: false
      }
    },
    logger: true,
    bodyLimit: 5242880, // Limite de 5 MB para o corpo da requisição
    connectionTimeout: 15000, // Timeout de 15 segundos para conexões
  });  

// Registrar o suporte a multipart/form-data com limites configurados
app.register(fastifyMultipart, {
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB por arquivo
        files: 3, // Limitar a 3 arquivos
    },
});

// Registrar CORS
app.register(cors, {
    origin: ["*"],
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    credentials: true
});

// Registrar rotas
import { cadastrarUser } from "../src/routes/cadastro-user.route";
app.register(cadastrarUser, { prefix: "/usuarios" });

import { atualizarUser } from "../src/routes/atualizar-user.route";
app.register(atualizarUser, { prefix: "/usuarios" });

import { login } from "../src/routes/login.route";
app.register(login, { prefix: "/auth" });

import { deletarUser } from "../src/routes/deletar-user.route";
app.register(deletarUser, { prefix: "/usuarios" });

import { listarUsers } from "../src/routes/listar-user.route";
app.register(listarUsers, { prefix: "/usuarios" });

import { obterUser } from "../src/routes/obter-user.route";
app.register(obterUser, { prefix: "/usuarios" });

const start = async () => {
    try {
        await app.listen({ port: 8080, host: '0.0.0.0' });
        console.log('Servidor working em: http://localhost:8080');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
