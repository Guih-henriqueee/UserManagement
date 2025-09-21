// Database configuration and connection utilities
// This would be used on the backend, but included here for reference

export const DATABASE_CONFIG = {
  // Connection string will be provided by Neon
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production',
};

// SQL Schema for PostgreSQL (to be run on Neon)
export const SQL_SCHEMA = `
-- Users table
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    nivel_permissao INTEGER NOT NULL CHECK (nivel_permissao >= 1 AND nivel_permissao <= 10),
    cargo VARCHAR(100) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    gerente VARCHAR(200),
    data_nascimento DATE NOT NULL,
    data_admissao DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Ativo', 'Inativo')) DEFAULT 'Ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE IF NOT EXISTS departamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT NOT NULL,
    cargos JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Systems table
CREATE TABLE IF NOT EXISTS sistemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contracts table
CREATE TABLE IF NOT EXISTS contratos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sistema_id UUID NOT NULL REFERENCES sistemas(id) ON DELETE CASCADE,
    sistema VARCHAR(100) NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('Pago', 'Free')),
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    licencas INTEGER NOT NULL CHECK (licencas > 0),
    custo_por_licenca DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Ativo', 'Expirado', 'Suspenso')) DEFAULT 'Ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT data_fim_maior_inicio CHECK (data_fim > data_inicio),
    CONSTRAINT custo_gratuito CHECK (
        (tipo = 'Free' AND custo_por_licenca = 0) OR 
        (tipo = 'Pago' AND custo_por_licenca >= 0)
    )
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_usuarios_departamento ON usuarios(departamento);
CREATE INDEX IF NOT EXISTS idx_usuarios_status ON usuarios(status);
CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON usuarios(cpf);

CREATE INDEX IF NOT EXISTS idx_contratos_sistema_id ON contratos(sistema_id);
CREATE INDEX IF NOT EXISTS idx_contratos_status ON contratos(status);
CREATE INDEX IF NOT EXISTS idx_contratos_data_fim ON contratos(data_fim);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departamentos_updated_at 
    BEFORE UPDATE ON departamentos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sistemas_updated_at 
    BEFORE UPDATE ON sistemas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contratos_updated_at 
    BEFORE UPDATE ON contratos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO departamentos (nome, descricao, cargos) VALUES 
('Tecnologia da Informação', 'Responsável pelo desenvolvimento e manutenção de sistemas', '["Desenvolvedor Junior", "Desenvolvedor Pleno", "Desenvolvedor Senior", "Tech Lead", "Gerente de TI"]'),
('Vendas', 'Equipe responsável pela prospecção e vendas', '["SDR", "Analista de Vendas", "Consultor de Vendas", "Gerente de Vendas"]'),
('Marketing', 'Estratégias de marketing e comunicação', '["Analista de Marketing", "Designer", "Social Media", "Gerente de Marketing"]'),
('Recursos Humanos', 'Gestão de pessoas e processos internos', '["Analista de RH", "Recrutador", "Gerente de RH"]')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO sistemas (nome, descricao) VALUES 
('CRM Vendas', 'Sistema de gerenciamento de relacionamento com clientes'),
('ERP Financeiro', 'Sistema integrado de gestão empresarial'),
('Portal RH', 'Portal de gestão de recursos humanos'),
('Sistema de Projetos', 'Gestão e acompanhamento de projetos')
ON CONFLICT (nome) DO NOTHING;
`;

// TypeScript types matching database schema
export interface DatabaseUsuario {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  nivel_permissao: number;
  cargo: string;
  departamento: string;
  gerente: string | null;
  data_nascimento: string;
  data_admissao: string;
  status: 'Ativo' | 'Inativo';
  created_at: string;
  updated_at: string;
}

export interface DatabaseDepartamento {
  id: string;
  nome: string;
  descricao: string;
  cargos: string[];
  created_at: string;
  updated_at: string;
}

export interface DatabaseSistema {
  id: string;
  nome: string;
  descricao: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseContrato {
  id: string;
  sistema_id: string;
  sistema: string;
  tipo: 'Pago' | 'Free';
  data_inicio: string;
  data_fim: string;
  licencas: number;
  custo_por_licenca: number;
  status: 'Ativo' | 'Expirado' | 'Suspenso';
  created_at: string;
  updated_at: string;
}