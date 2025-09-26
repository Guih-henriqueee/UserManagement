import fastify from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { RouteUsuario } from './routes/usuario/usuario';

const app = fastify().withTypeProvider<ZodTypeProvider>();


app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);


app.register(fastifyCors, {
    origin: '*',
});

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Manager Users',
            description: 'Backend - Painel de Agendamentos',
            version: '0.0.2v beta - Last update 03/04/2025',
            contact: {
                name: 'Guilherme Martins',
                url: 'https://github.com/guih-henriqueee',
                email: 'gmartinsdevelop@gmail.com',

                
            },

        },
        components: {
            securitySchemes: {
                apiKey: {
                    type: 'apiKey',
                    name: 'apiKey',
                    in: 'header',
                },
            },
        },
        security: [{ apiKey: [] }],

    },
    transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
    routePrefix: '/',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (_request, _reply, next) {
        next();
      },
      preHandler: function (_request, _reply, next) {
        next();
      }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => {
      return swaggerObject;
    },
    transformSpecificationClone: true
  
});

app.register(RouteUsuario );



app.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
