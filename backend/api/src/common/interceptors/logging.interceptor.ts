import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { logger } from '../logger/winston.logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl, body } = req;
    logger.info(`[${method}] ${originalUrl} - body: ${JSON.stringify(body)}`);

    return next.handle().pipe(
      tap((data) => {
        // logger.info(`[${method}] ${originalUrl} - response: ${JSON.stringify(data)}`);
      }),
    );
  }
}
