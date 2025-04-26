import bcrypt from 'bcrypt'

// Função para encriptar senhas
export function hashPassword(password: string) {
    return bcrypt.hashSync(password, 10)
}

//Função para comparar as senhas no login já com o hash
export function comparePasswords(password: string, hash: string) {
    return bcrypt.compareSync(password, hash)
}