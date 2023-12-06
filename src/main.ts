import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

const { npm_package_version } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = buildSwaggerConfig();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Use the ValidationPipe globally
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(process.env.PORT || 3000);
}

function buildSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Challenge API')
    .setDescription('Projects management')
    .setVersion(npm_package_version)
    .build();
}

bootstrap();
