import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedisService } from '@common/redis/redis.service';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  constructor(private readonly redisService: RedisService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const endpoint = request.route.path;
    const key = `rate_limit:${ip}:${endpoint}`;

    const current = await this.redisService.incr(key);
    if (current === 1) {
      await this.redisService.expire(key, 60); // 1분
    }

    if (current > 100) { // 1분당 100회 제한
      throw new HttpException('요청이 너무 많습니다. 잠시 후 다시 시도 해주세요.', HttpStatus.TOO_MANY_REQUESTS);
    }

    return next.handle();
  }
}
