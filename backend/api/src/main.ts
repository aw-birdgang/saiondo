import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModuleConfig } from './modules/swagger/swagger.module';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';
import { useContainer } from 'class-validator';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { validationOptions } from '@common/utils/validation-options';
import { createWinstonLogger } from './common/logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);
  const llmApiUrl = configService.getOrThrow('common', {
    infer: true,
  }).llmApiUrl;
  const port = configService.getOrThrow('common', { infer: true }).port;

  const logger = createWinstonLogger('Bootstrap');

  logger.log(`app > bootstrap > apiPrefix::${llmApiUrl}, port::${port} `);

  app.use(helmet());
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? ['https://your-domain.com'] : '*',
    credentials: true,
  });
  SwaggerModuleConfig.setupSwagger(app);
  // app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalInterceptors(new LoggingInterceptor());

  // ValidationPipe 다시 활성화
  app.useGlobalPipes(
    new ValidationPipe({
      ...validationOptions,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
// ecr-sample-dev-branch
