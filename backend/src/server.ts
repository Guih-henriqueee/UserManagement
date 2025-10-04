import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { RouteUsuario } from './routes/usuario/usuario';
import 'fastify-jwt';
import { CheckUserSign } from './auth/functionAuth';

dotenv.config();

const app = fastify().withTypeProvider<ZodTypeProvider>();

// === Configurações base ===
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Cookies
app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || 'supersecret',
  parseOptions: {},
});

// CORS
app.register(fastifyCors, { origin: '*', credentials: true });

// JWT
app.register(fastifyJwt, { secret: process.env.JWT_SECRET || 'supersecretjwt' });

// Middleware JWT
app.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Token inválido ou expirado' });
  }
});

// === Rotas de autenticação ===
app.post('/login', async (req: FastifyRequest, reply: FastifyReply) => {
  const { username, password } = req.body as { username: string; password: string };

  // 🔒 Exemplo simples — em produção valide no banco de dados
  if (await CheckUserSign({ username, password }) !== true) {
    return reply.code(401).send({ error: 'Credenciais inválidas' });
  }

  // Gerar token JWT
  const token = app.jwt.sign({ username }, { expiresIn: '1h' });
  reply.send({ token });
});

// Rota protegida
app.get('/me', { preHandler: [app.authenticate] }, async (req: FastifyRequest & { user: any }) => {
  return { user: req.user };
});

// === Swagger ===
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Manager Users',
      description: 'Backend - Painel de Agendamentos',
      version: '0.0.3v beta',
      contact: { name: 'Guilherme Martins', url: 'https://github.com/guih-henriqueee', email: 'gmartinsdevelop@gmail.com' },
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: '/',
  uiConfig: { docExpansion: 'full', deepLinking: false },
  uiHooks: { onRequest: (_req, _rep, next) => next(), preHandler: (_req, _rep, next) => next() },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject) => swaggerObject,
  transformSpecificationClone: true,
});

// === Rotas de usuário ===
app.register(RouteUsuario);

// === Inicialização ===
app.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`✅ Server listening at ${address}`);
});
