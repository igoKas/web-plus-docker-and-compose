import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeORMErrorExceptionFilter } from './common/exceptions/filters/typeorm.filter';
import { SwaggerModule } from '@nestjs/swagger';
import swaggerConfig from './config/swagger-config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new TypeORMErrorExceptionFilter());
  const document = SwaggerModule.createDocument(app, swaggerConfig());
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(configService.get('server.port'));
}
bootstrap();
