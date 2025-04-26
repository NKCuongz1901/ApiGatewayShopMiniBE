import { Module } from '@nestjs/common';
import { CustomRateLimiterGuard } from './custom-rate-limiter.guard';
import { GatewayController } from './getway.controller';
import { RateLimiterModule } from 'nestjs-rate-limiter';
import { APP_GUARD } from '@nestjs/core';
import Redis from 'ioredis';

@Module({
  imports: [
    RateLimiterModule.register({
      points: 10, // Giới hạn số request (10 requests)
      duration: 60, // Trong 60 giây
      keyPrefix: 'gateway', // Định danh cho Gateway
      storeClient: new Redis({ host: 'localhost', port: 6379 }),
    }),
  ],
  controllers: [GatewayController],
  providers: [ {
    provide: APP_GUARD,
    useClass: CustomRateLimiterGuard,
  },],
})
export class GetwayModule {}
