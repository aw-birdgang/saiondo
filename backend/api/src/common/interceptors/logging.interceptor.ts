import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { createWinstonLogger } from '@common/logger/winston.logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = createWinstonLogger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;
    const now = Date.now();

    this.logger.log(`[REQUEST] ${method} ${url} - User: ${user?.id || 'anonymous'}`);

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - now;
          this.logger.log(`[RESPONSE] ${method} ${url} - ${responseTime}ms`);
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.logger.error(`[ERROR] ${method} ${url} - ${responseTime}ms - ${error.message}`);
        },
      }),
    );
  }
}
