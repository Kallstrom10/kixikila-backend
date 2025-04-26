import fastify from "fastify";
import cors from "@fastify/cors";

const app = fastify({
    ajv: {
        customOptions: {
            strict: false
        }
    },
    logger: true
})

app.get('/', async(req, res) => {
    return { message: 'API do Kixikila working!' }
})

app.register(cors, {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    credentials: true
})

import { cadastrarUser } from "../src/routes/cadastro-user.route";
app.register(cadastrarUser, {prefix: "/usuarios"})

import { atualizarUsuario } from "../src/routes/atualizar-user.route";
app.register(atualizarUsuario, {prefix: "/usuarios"})

import { login } from "../src/routes/login.route";
app.register(login, {prefix: "/auth"})

import { deletarUser } from "../src/routes/deletar-user.route";
app.register(deletarUser, {prefix: "/usuarios"})

import { listarUsers } from "../src/routes/listar-user.route";
app.register(listarUsers, {prefix: "/usuarios"})

import { obterUser } from "../src/routes/obter-user.route";
app.register(obterUser, {prefix: "/usuarios"})

const start = async () => {
    try {
        await app.listen({ port: 8080, host: '0.0.0.0'})
        console.log('Servidor working em: http://localhost:8080')
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start();