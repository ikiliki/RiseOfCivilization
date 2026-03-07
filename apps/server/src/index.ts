import Fastify from 'fastify';
import { config } from './config.js';
import { runMigrations } from './db/migrate.js';
import { pool } from './db/pool.js';
import { registerApiRoutes } from './routes/api.js';
import { registerWebSocket } from './realtime/websocket.js';
import { closeRedis, connectRedis } from './services/redis.js';

const app = Fastify({
  logger: true
});

async function registerSwaggerDocs(): Promise<void> {
  const { default: fastifySwagger } = await import('@fastify/swagger');
  const { default: fastifySwaggerUi } = await import('@fastify/swagger-ui');

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Rise Of Civilization Server API',
        version: '0.1.0'
      }
    }
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/swagger'
  });
}

app.addHook('onRequest', async (request, reply) => {
  reply.header('Access-Control-Allow-Origin', request.headers.origin ?? '*');
  reply.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  reply.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (request.method === 'OPTIONS') {
    reply.status(204).send();
  }
});

await runMigrations();
await connectRedis();
await registerSwaggerDocs();
await registerApiRoutes(app);
await registerWebSocket(app);

app.addHook('onClose', async () => {
  await closeRedis();
  await pool.end();
});

app.listen({ port: config.port, host: '0.0.0.0' }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
