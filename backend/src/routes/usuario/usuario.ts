// src/routes/Employee.ts
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { Usuario } from '../../schema/interfaces'
import {
usuarioBodySchema, 
usuarioResponseSchemaPOST,
usuarios } from './usuarioSchema'


export async function RouteUsuario(app: FastifyInstance) {
  app.post(
    '/usuarios',
    {
      schema: {
        description: 'Criar um novo usuário',
        tags: ['Usuarios'],
        body: usuarioBodySchema,
        response: {
          201: usuarioResponseSchemaPOST,
        },
      },
    },
    async (request, reply) => {
      const body = request.body as z.infer<typeof usuarioBodySchema>

      const newUsuario: Usuario = {
        ...body,
        id: randomUUID(),
      }

      usuarios.push(newUsuario)

      return reply.status(201).send(newUsuario)
    }
  )
}
