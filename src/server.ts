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
import { cadastrarUser } from "./routes/users/cadastro-user.route";
app.register(cadastrarUser, { prefix: "/usuarios" });

import { atualizarUser } from "./routes/users/atualizar-user.route";
app.register(atualizarUser, { prefix: "/usuarios" });

import { login } from "./routes/users/login.route";
app.register(login, { prefix: "/auth" });

import { deletarUser } from "./routes/users/deletar-user.route";
app.register(deletarUser, { prefix: "/usuarios" });

import { listarUsers } from "./routes/users/listar-user.route";
app.register(listarUsers, { prefix: "/usuarios" });

import { obterUser } from "./routes/users/obter-user.route";
app.register(obterUser, { prefix: "/usuarios" });

//FUNÇÕES E ROTAS DA KIXIKILA
import { criarKixikila } from "./routes/grupo-kixikila/criar-grupo.route";
app.register(criarKixikila, {prefix:"/kixikila"})

import { deletarKixikila } from "./routes/grupo-kixikila/deletar-kixkila.route";
app.register(deletarKixikila, {prefix:"/kixikila"})

import { listarKixikilas } from "./routes/grupo-kixikila/listar-kixikila.route";
app.register(listarKixikilas, {prefix:"/kixikila"})

import { listarKixikilasUsuario } from "./routes/grupo-kixikila/listar-kixikila-user.route";
app.register(listarKixikilasUsuario, {prefix:"/kixikila"})

//FUNÇÕES E ROTAS DA CONTA BANCÁRIA
import { adicionarContaBancaria } from "./routes/conta-bancaria/conta-bacaria.route";
app.register(adicionarContaBancaria, {prefix:"/contas"})

import { eliminarContaBancaria } from "./routes/conta-bancaria/deletar-conta.route";
app.register(eliminarContaBancaria, {prefix:"/contas"})

//FUNÇÕES E ROTAS DA CARTEIRA
import { criarCarteira } from "./routes/carteira-kixikila/criar-carteira.route";
app.register(criarCarteira, {prefix:"carteira"})

const start = async () => {
    try {
        await app.listen({ port: 7777, host: '0.0.0.0' });
        console.log('Servidor working em: http://localhost:7777');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
