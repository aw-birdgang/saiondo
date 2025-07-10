import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

// 로그 레벨 정의
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 환경에 따른 로그 레벨 설정
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// 로그 색상 정의
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// 색상 추가
import { addColors } from 'winston';
addColors(colors);

// 로그 포맷 정의
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  format.colorize({ all: true }),
  format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// 파일 로그 포맷 (색상 제거)
const fileLogFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Winston 로거 생성
const logger = createLogger({
  level: level(),
  levels,
  format: logFormat,
  transports: [
    // 콘솔 출력
    new transports.Console(),
    // 파일 출력 (에러)
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: fileLogFormat,
    }),
    // 파일 출력 (전체)
    new transports.File({
      filename: 'logs/all.log',
      format: fileLogFormat,
    }),
  ],
});

// NestJS Logger와 호환되는 래퍼 클래스
export class WinstonLoggerWrapper {
  private logger: WinstonLogger;
  private context: string;

  constructor(context: string) {
    this.logger = logger;
    this.context = context;
  }

  log(message: any, context?: string) {
    this.logger.info(`${context || this.context}: ${message}`);
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(`${context || this.context}: ${message}${trace ? `\n${trace}` : ''}`);
  }

  warn(message: any, context?: string) {
    this.logger.warn(`${context || this.context}: ${message}`);
  }

  debug(message: any, context?: string) {
    this.logger.debug(`${context || this.context}: ${message}`);
  }

  verbose(message: any, context?: string) {
    this.logger.info(`${context || this.context}: ${message}`);
  }
}

// 기본 로거 export
export { logger };

// 로거 팩토리 함수
export function createWinstonLogger(context: string): WinstonLoggerWrapper {
  return new WinstonLoggerWrapper(context);
}
