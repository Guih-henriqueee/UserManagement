export interface User {
    id: string;
    name: string;
    cpf: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    token: string;

}

export interface Agendamento {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    dataEntrega: Date;
    xml: string;
    commits: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    userCreated: User;
    userUpdated: User;
    fornecedor: Fornecedor;
    userId: string;
    userName: string;
    userEmail: string;
}

export interface Fornecedor{
    id: string;
    name: string;
    cnpj: string;
    contact: string
    agendamentos: string;
}

export interface  Usuario {
    id: string;
    nome: string;
    sobrenome: string;
    cpf: string;
    nivel_permissao_id: number;
    cargo_id: number;
    gerente_id: number;
    data_nascimento: Date;
    data_adminissao: Date;
    status: true | false;
    departamento_id: number;
}