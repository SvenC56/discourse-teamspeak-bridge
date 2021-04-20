import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';

async function bootstrap() {
  const logger = new Logger('Server');
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.ENV === 'development'
        ? ['debug', 'error', 'log', 'verbose', 'warn']
        : ['error', 'warn', 'log'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
    }),
  );

  // Get app config for cors settings and starting the app.
  const appConfigService: AppConfigService = app.get('AppConfigService');

  app.setGlobalPrefix('api');

  // See: https://docs.nestjs.com/security/cors
  app.enableCors({
    origin: appConfigService.isProduction ? true : '*',
  });

  // Swagger OpenAPI Documentation
  const options = new DocumentBuilder()
    .setTitle('Discourse TeamSpeak Sync')
    .setDescription('The Discourse TeamSpeak Sync API description')
    .setVersion('1.0')
    .addTag('discourse')
    .addTag('teamspeak')
    .addTag('assignment')
    .addTag('sync')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(appConfigService.port);
  logger.log(`Application is running on port: ${appConfigService.port}`);
}
bootstrap();
