import { Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

@Module({})
export class SwaggerModuleConfig {
  static setupSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('API 문서')
      .setDescription('서비스 API 명세')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }
}
