import { FastifyInstance } from 'fastify'
import { cadastrarUsuarioService } from '../services/user/cadastro-user'
import { CreateUserDTO } from '../dto/create-user.dto'

export async function cadastrarUser(app: FastifyInstance) {
    app.post<{ Body: CreateUserDTO }>("/cadastro-usuario",
        async (req, res) => {
            try {
                return await cadastrarUsuarioService(req, res)
            } catch (error: any) {
                console.error("Erro ao cadastrar usuário: ", error)
                return res.status(500).send({
                    message: "Erro interno na rota de cadastro de usuários.",
                    detalhes: error.message || "Erro desconhecido"
                })
            }
        }
    )
}