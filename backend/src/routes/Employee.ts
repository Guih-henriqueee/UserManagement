// src/routes/Employee.ts
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { Usuario } from '../schema/interfaces'

// "banco" em memória
const usuarios: Usuario[] = []

// Schema de entrada
const UsuarioBodySchema = z.object({
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
const UsuarioResponseSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  sobrenome: z.string(),
  cpf: z.string(),
})

export async function RouteUsuario(app: FastifyInstance) {
  app.post(
    '/usuarios',
    {
      schema: {
        description: 'Criar um novo usuário',
        tags: ['Usuarios'],
        body: UsuarioBodySchema,
        response: {
          201: UsuarioResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const body = request.body as z.infer<typeof UsuarioBodySchema>

      const newUsuario: Usuario = {
        ...body,
        id: randomUUID(),
      }

      usuarios.push(newUsuario)

      return reply.status(201).send(newUsuario)
    }
  )
}
