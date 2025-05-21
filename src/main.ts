import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { ExpressAdapter } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./filters/bad-request.filter";
import { QueryFailedFilter } from "./filters/query-failed.filter";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { urlencoded, json } from 'express';
import { ConfigService } from '@nestjs/config';

// Check if running with Bun and handle compression accordingly
const isBun = typeof process !== 'undefined' &&
              typeof process.versions !== 'undefined' &&
              typeof process.versions.bun !== 'undefined';

let compression;
if (isBun) {
  console.warn('Running with Bun - compression disabled for compatibility');
  compression = () => (req, res, next) => next();
} else {
  try {
    compression = require('compression');
  } catch (e) {
    console.warn('Compression middleware not available, skipping...');
    compression = () => (req, res, next) => next();
  }
}

export async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      cors: {
        exposedHeaders: ["content-disposition"],
      },
    }
  );
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(compression());
  app.enable("trust proxy");

  const reflector = app.get(Reflector);

  app.useGlobalFilters(
    new HttpExceptionFilter(reflector),
    new QueryFailedFilter(reflector)
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
  );

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Get the ConfigService
  const configService = app.get(ConfigService);

  // Set the global prefix for all routes
  const apiPrefix = configService.get('API_PREFIX') || 'api';
  app.setGlobalPrefix(apiPrefix);

  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('Finance API')
    .setDescription('The Finance API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = 3040; // Override the PORT from .env
  await app.listen(port);

  console.info(`Server running on ${await app.getUrl()}`);
  console.info(`API Documentation available at http://localhost:${port}/docs`);
  console.info(`Auto-reload is enabled - changes will be detected automatically`);

  return app;
}

void bootstrap();
