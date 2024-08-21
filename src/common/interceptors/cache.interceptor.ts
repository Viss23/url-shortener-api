import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
import { Response } from 'express';
import { Observable, of, tap } from 'rxjs';
import { RedirectService } from 'src/modules/redirect/redirect.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private redisService: RedisService,
    private redirectService: RedirectService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    const { originalUrl } = request;
    const code = originalUrl.split('/').slice(-1)[0];
    const cachedResponse = await this.redisService.get(code);
    if (cachedResponse) {
      this.redirectService.updateStats(code);
      console.log(
        `Request ${originalUrl} was cached. Getting cached version...`,
      );

      response.redirect(302, cachedResponse);

      return of(null);
    }
    console.log(` ${code} is not found in cache. Requesting data from API...`);

    return next.handle().pipe(
      tap(async (response) => {
        await this.redisService.setEx(code, 3600, response.url);
        console.log(`${code} added to cache`);
      }),
    );
  }
}
