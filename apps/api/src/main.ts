import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // 1. Headers de seguridad con Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://checkout.wompi.co'],
        connectSrc: ["'self'", 'https://production.wompi.co', 'https://sandbox.wompi.co'],
        frameSrc: ["'self'", 'https://checkout.wompi.co'],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  }));

  // 2. Rate limiting anti-DDoS
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      message: 'Demasiadas solicitudes desde esta IP, intente de nuevo en 15 minutos.',
    }),
  );

  // 3. CORS
  app.enableCors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // 4. Pipes de validación estricta anti-tampering
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('v1');
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`[Store API] Corriendo en puerto ${port}`);
}
bootstrap();
