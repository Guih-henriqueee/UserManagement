import {z} from '@hono/zod-openapi'
import { Usuario } from '../../schema/interfaces'

// "banco" em memória
export const usuarios: Usuario[] = []

// Schema de entrada
export const usuarioBodySchema = z.object({
  nome: z.string().describe('Nome do Usuário'),
  sobrenome: z.string().describe('Sobrenome do Usuário'),
  cpf: z.string().describe('CPF do usuário'),
  nivel_permissao_id: z.number().describe('Identificador de Nível de Permissão'),
  cargo_id: z.number().describe('Identificador de Cargo'),
  gerente_id: z.number().describe('Identificador de Gerente'),
  data_nascimento: z.date().describe('Data de nascimento (YYYY-MM-DD)'),
  data_adminissao: z.date().describe('Data de admissão (YYYY-MM-DD)'),
  status: z.boolean().describe('Indica se o usuário está ativo'),
  departamento_id: z.number().describe('Identificador de Departamento'),
})

// Schema de resposta
export const usuarioResponseSchemaPOST = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  sobrenome: z.string(),
  cpf: z.string(),
})