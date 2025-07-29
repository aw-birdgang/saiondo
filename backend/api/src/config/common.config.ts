import { registerAs } from '@nestjs/config';
import { IsInt, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';
import { validateConfig } from '@common/utils/validation.util';
import { CommonConfig } from './common-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  NODE_ENV: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: string;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE: string;

  @IsString()
  @IsOptional()
  LLM_API_URL: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  WS_PORT: number;

  @IsString()
  @IsOptional()
  REDIS_HOST: string;

  @IsInt()
  @IsOptional()
  REDIS_PORT: number;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD: string;

  @IsInt()
  @IsOptional()
  REDIS_DB: number;
}

export default registerAs<CommonConfig>('common', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    name: process.env.APP_NAME ?? 'app',
    workingDirectory: process.env.PWD ?? process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN,
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 5200,
    apiPrefix: process.env.API_PREFIX ?? 'api',
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE ?? 'en',
    headerLanguage: process.env.APP_HEADER_LANGUAGE ?? 'x-custom-lang',
    llmApiUrl: process.env.LLM_API_URL ?? 'http://localhost:8000',
    wsPort: process.env.WS_PORT ? parseInt(process.env.WS_PORT, 10) : 3000,
    redis: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
      password: process.env.REDIS_PASSWORD ?? undefined,
      db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB, 10) : 0,
    },
  };
});
