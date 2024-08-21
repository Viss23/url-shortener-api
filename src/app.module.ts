import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortenModule } from './modules/shorten/shorten.module';
import { RedirectModule } from './modules/redirect/redirect.module';
import { StatsModule } from './modules/stats/stats.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RateLimitInterceptor } from './common/interceptors/rateLimiter.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    ShortenModule,
    RedirectModule,
    StatsModule,
    RedisModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimitInterceptor,
    },
  ],
})
export class AppModule {}
