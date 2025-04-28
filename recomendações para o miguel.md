# LOGIN - ROTA: /auth/login/telefone/senha
    => Retorno da Rota: 
        ID
        Nome
        telefone - não usado
        Foto de perfil - não usado

# CADASTRO DO USUÁRIO - ROTA: /usuarios/cadastro-usuario
    => Items necessários
        nome compelto
        telefone
        senha
        foto de perfil
        foto de frente do BI
        foto do verso do BI

# CRIAR GRUPO (KIXIKILA) - ROTA: /kixikila/criar-kixikila
    => Items necessários
        nome do grupo
        valor da kixikila
        limite de membros da kixikila
        administrador (ID)
        início da kixikila 
        frequência da kixikila

# LISTAR KIXIKILAS DE UM USUÁRIO - ROTA: /kixikila/listar-kixikilas-usuario/:usuarioId
    => Como funciona?
        Irá listar todos os grupos (kixikilas) que o usuário participa

# ADICIONAR CONTA - ROTA: /contas/adicionar-conta-bancaria
    => Items necessários
        iban (só devem ser números)
        ordenante (dono da conta)
        usuário (ID)
        aceitar os termos

# CRIAR A CARTEIRA KIXIKILA - ROTA: /carteira/criar-carteira
    => Items ncessários
        número do cartão (18 dígitos)
        saldo inicial
        validade
        usuário (ID)

# DADOS RETORNADOS DO CARTÃO APÓS O CADASTRO
    => Dados:
        os números do catão
        o saldo da conta
        a validade do cartão