import type { Usuario, Departamento, Sistema, Contrato } from '@/types';

export const mockUsuarios: Usuario[] = [
  {
    id: '1',
    nome: 'João',
    sobrenome: 'Silva',
    cpf: '123.456.789-00',
    nivelPermissao: 8,
    cargo: 'Desenvolvedor Senior',
    departamento: 'Tecnologia da Informação',
    gerente: 'Maria Santos',
    dataNascimento: '1990-05-15',
    dataAdmissao: '2022-01-10',
    status: 'Ativo'
  },
  {
    id: '2',
    nome: 'Maria',
    sobrenome: 'Santos',
    cpf: '987.654.321-00',
    nivelPermissao: 10,
    cargo: 'Gerente de TI',
    departamento: 'Tecnologia da Informação',
    gerente: 'Carlos Oliveira',
    dataNascimento: '1985-08-22',
    dataAdmissao: '2020-03-01',
    status: 'Ativo'
  },
  {
    id: '3',
    nome: 'Pedro',
    sobrenome: 'Costa',
    cpf: '456.789.123-00',
    nivelPermissao: 6,
    cargo: 'Analista de Vendas',
    departamento: 'Vendas',
    gerente: 'Ana Ferreira',
    dataNascimento: '1992-12-03',
    dataAdmissao: '2023-02-15',
    status: 'Ativo'
  },
  {
    id: '4',
    nome: 'Ana',
    sobrenome: 'Ferreira',
    cpf: '789.123.456-00',
    nivelPermissao: 9,
    cargo: 'Gerente de Vendas',
    departamento: 'Vendas',
    gerente: 'Carlos Oliveira',
    dataNascimento: '1988-04-18',
    dataAdmissao: '2021-07-20',
    status: 'Ativo'
  },
  {
    id: '5',
    nome: 'Carlos',
    sobrenome: 'Oliveira',
    cpf: '321.654.987-00',
    nivelPermissao: 10,
    cargo: 'Diretor',
    departamento: 'Diretoria',
    gerente: '',
    dataNascimento: '1975-11-30',
    dataAdmissao: '2018-01-01',
    status: 'Ativo'
  }
];

export const mockDepartamentos: Departamento[] = [
  {
    id: '1',
    nome: 'Tecnologia da Informação',
    descricao: 'Responsável pelo desenvolvimento e manutenção de sistemas',
    cargos: ['Desenvolvedor Junior', 'Desenvolvedor Pleno', 'Desenvolvedor Senior', 'Tech Lead', 'Gerente de TI']
  },
  {
    id: '2',
    nome: 'Vendas',
    descricao: 'Equipe responsável pela prospecção e vendas',
    cargos: ['SDR', 'Analista de Vendas', 'Consultor de Vendas', 'Gerente de Vendas']
  },
  {
    id: '3',
    nome: 'Marketing',
    descricao: 'Estratégias de marketing e comunicação',
    cargos: ['Analista de Marketing', 'Designer', 'Social Media', 'Gerente de Marketing']
  },
  {
    id: '4',
    nome: 'Recursos Humanos',
    descricao: 'Gestão de pessoas e processos internos',
    cargos: ['Analista de RH', 'Recrutador', 'Gerente de RH']
  }
];

export const mockSistemas: Sistema[] = [
  {
    id: '1',
    nome: 'CRM Vendas',
    descricao: 'Sistema de gerenciamento de relacionamento com clientes'
  },
  {
    id: '2',
    nome: 'ERP Financeiro',
    descricao: 'Sistema integrado de gestão empresarial'
  },
  {
    id: '3',
    nome: 'Portal RH',
    descricao: 'Portal de gestão de recursos humanos'
  },
  {
    id: '4',
    nome: 'Sistema de Projetos',
    descricao: 'Gestão e acompanhamento de projetos'
  }
];

export const mockContratos: Contrato[] = [
  {
    id: '1',
    sistemaId: '1',
    sistema: 'CRM Vendas',
    tipo: 'Pago',
    dataInicio: '2024-01-01',
    dataFim: '2024-12-31',
    licencas: 50,
    custoPorLicenca: 29.90,
    status: 'Ativo'
  },
  {
    id: '2',
    sistemaId: '2',
    sistema: 'ERP Financeiro',
    tipo: 'Pago',
    dataInicio: '2024-01-01',
    dataFim: '2025-12-31',
    licencas: 25,
    custoPorLicenca: 89.90,
    status: 'Ativo'
  },
  {
    id: '3',
    sistemaId: '3',
    sistema: 'Portal RH',
    tipo: 'Free',
    dataInicio: '2024-01-01',
    dataFim: '2024-12-31',
    licencas: 100,
    custoPorLicenca: 0,
    status: 'Ativo'
  },
  {
    id: '4',
    sistemaId: '4',
    sistema: 'Sistema de Projetos',
    tipo: 'Pago',
    dataInicio: '2023-01-01',
    dataFim: '2023-12-31',
    licencas: 20,
    custoPorLicenca: 49.90,
    status: 'Expirado'
  }
];