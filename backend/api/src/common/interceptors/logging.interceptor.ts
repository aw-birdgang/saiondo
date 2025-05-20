import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl, body } = req;
    console.log(`[${method}] ${originalUrl} - body:`, body);

    return next.handle().pipe(
      tap((data) => {
        // 응답 로그도 찍고 싶으면 여기에 추가
        // console.log(`[${method}] ${originalUrl} - response:`, data);
      }),
    );
  }
}
