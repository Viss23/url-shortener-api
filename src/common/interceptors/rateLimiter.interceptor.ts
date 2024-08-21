import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private readonly limit = 10; // Max number of requests
  private readonly windowInSeconds = 60; // Time window in seconds

  constructor(private redisService: RedisService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;

    const currentMinute = new Date().getMinutes();
    const redisKey = `${ip}:${currentMinute}`;

    const requests = await this.redisService.get(redisKey);
    const currentRequests = requests ? parseInt(requests, 10) : 0;

    if (currentRequests >= this.limit) {
      throw new HttpException(
        'Rate limit exceeded. Please try again later.',
        HttpStatus.FORBIDDEN,
      );
    }

    // Increment the request count
    await this.redisService.incr(redisKey);

    // Set the expiration if it's a new key
    if (currentRequests === 0) {
      await this.redisService.expire(redisKey, this.windowInSeconds);
    }

    return next.handle();
  }
}
