import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { createWinstonLogger } from '@common/logger/winston.logger';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  private readonly logger = createWinstonLogger(ValidationPipe.name);

  async transform(value: any, { metatype, type }: ArgumentMetadata) {
    this.logger.log(
      `[ValidationPipe] 시작 - Type: ${type}, Metatype: ${metatype?.name ?? 'unknown'}`,
    );
    this.logger.log(`[ValidationPipe] 입력값: ${JSON.stringify(value)}`);

    if (!metatype || !this.toValidate(metatype)) {
      this.logger.log('[ValidationPipe] 검증 스킵 - 기본 타입이므로 검증하지 않음');

      return value;
    }

    const object = plainToClass(metatype, value);

    this.logger.log(`[ValidationPipe] 변환된 객체: ${JSON.stringify(object)}`);

    const errors = await validate(object);

    this.logger.log(`[ValidationPipe] 검증 결과 - 에러 개수: ${errors.length}`);

    if (errors.length > 0) {
      this.logger.error(`[ValidationPipe] 검증 실패 - 에러 상세: ${JSON.stringify(errors)}`);
      const messages = errors.map(error => Object.values(error.constraints ?? {}).join(', '));
      const errorMessage = `유효성 검사 실패: ${messages.join('; ')}`;

      this.logger.error(`[ValidationPipe] 에러 메시지: ${errorMessage}`);
      throw new BadRequestException(errorMessage);
    }

    this.logger.log('[ValidationPipe] 검증 성공 - 값 반환');

    return value;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }
}
