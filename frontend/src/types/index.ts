export interface Usuario {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  nivelPermissao: number;
  cargo: string;
  departamento: string;
  gerente: string;
  dataNascimento: string;
  dataAdmissao: string;
  status: 'Ativo' | 'Inativo';
}

export interface Departamento {
  id: string;
  nome: string;
  descricao: string;
  cargos: string[];
}

export interface Sistema {
  id: string;
  nome: string;
  descricao: string;
}

export interface Contrato {
  id: string;
  sistemaId: string;
  sistema: string;
  tipo: 'Pago' | 'Free';
  dataInicio: string;
  dataFim: string;
  licencas: number;
  custoPorLicenca: number;
  status: 'Ativo' | 'Expirado' | 'Suspenso';
}