import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {SwaggerModuleConfig} from "./modules/swagger/swagger.module";
import {ConfigService} from "@nestjs/config";
import {AllConfigType} from "./config/config.type";
import {useContainer} from "class-validator";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);
  const llmApiUrl = configService.getOrThrow('common', { infer: true }).llmApiUrl;
  const port = configService.getOrThrow('common', { infer: true }).port;
  console.log(`app > bootstrap > apiPrefix::${llmApiUrl}, port::${port} `);

  app.enableCors({
    origin: '*',
    credentials: true,
  });
  SwaggerModuleConfig.setupSwagger(app);
  // app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
