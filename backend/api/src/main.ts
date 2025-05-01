import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {SwaggerModuleConfig} from "./modules/swagger/swagger.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerModuleConfig.setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
