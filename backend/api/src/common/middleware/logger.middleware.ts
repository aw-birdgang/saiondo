import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createWinstonLogger } from '@common/logger/winston.logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = createWinstonLogger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, ip } = req;
    const userAgent = req.headers['user-agent'];

    // 요청 로깅 (객체를 JSON 문자열로 변환)
    this.logger.log(
      `[REQUEST] ${method} ${originalUrl} | ip=${ip} | ua=${userAgent} | body=${JSON.stringify(this.sanitizeBody(req.body))} | query=${JSON.stringify(req.query)} | params=${JSON.stringify(req.params)}`,
    );

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      this.logger.log(
        `[RESPONSE] ${method} ${originalUrl} - ${statusCode} (${duration}ms) | contentLength=${contentLength}`,
      );
    });

    next();
  }

  /**
   * 민감한 정보를 제거한 요청 본문 반환
   */
  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'key'];

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}
