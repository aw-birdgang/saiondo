import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { createWinstonLogger } from '@common/logger/winston.logger';

const logger = createWinstonLogger('ValidationUtil');

/**
 * 검증 에러를 구조화된 형태로 생성
 */
function generateErrors(errors: ValidationError[]): Record<string, any> {
  return errors.reduce(
    (accumulator, currentValue) => ({
      ...accumulator,
      [currentValue.property]:
        (currentValue.children?.length ?? 0) > 0
          ? generateErrors(currentValue.children ?? [])
          : Object.values(currentValue.constraints ?? {}).join(', '),
    }),
    {},
  );
}

/**
 * 환경 변수 설정 검증 함수
 */
export function validateConfig<T extends object>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
): T {
  try {
    const validatedConfig = plainToClass(envVariablesClass, config, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      const errorMessage = `Configuration validation failed: ${errors.toString()}`;

      logger.error(`환경 설정 검증 실패: errors=${JSON.stringify(generateErrors(errors))}`);
      throw new Error(errorMessage);
    }

    logger.debug('환경 설정 검증 성공');

    return validatedConfig;
  } catch (error) {
    logger.error('환경 설정 검증 중 오류:', error);
    throw error;
  }
}

/**
 * NestJS ValidationPipe 옵션
 */
export const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => {
    logger.error(`Validation errors: errors=${JSON.stringify(generateErrors(errors))}`);

    return new UnprocessableEntityException({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: generateErrors(errors),
    });
  },
};

/**
 * 커스텀 검증 데코레이터를 위한 헬퍼 함수
 */
export function createValidationDecorator(validator: (value: any) => boolean, message: string) {
  return function (target: any, propertyKey: string) {
    const value = target[propertyKey];

    if (!validator(value)) {
      throw new UnprocessableEntityException(message);
    }
  };
}
