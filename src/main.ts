import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get app config for cors settings and starting the app.
  const appConfig: AppConfigService = app.get('AppConfigService');

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  // Swagger OpenAPI Documentation
  const options = new DocumentBuilder()
    .setTitle('Discourse TeamSpeak Sync')
    .setDescription('The Discourse TeamSpeak Sync API description')
    .setVersion('1.0')
    .addTag('discourse')
    .addTag('teamspeak')
    .addTag('sync')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(appConfig.port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
