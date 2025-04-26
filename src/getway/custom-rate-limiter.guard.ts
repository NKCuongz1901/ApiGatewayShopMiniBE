import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import  Redis from 'ioredis';

@Injectable()
export class CustomRateLimiterGuard implements CanActivate {
  private rateLimiter: RateLimiterRedis;

  constructor(private readonly reflector: Reflector) {
    // Khởi tạo Redis client và RateLimiterRedis
    const redis = new Redis({
      host: 'localhost', // hoặc kết nối với Redis cluster nếu cần
      port: 6379, // Port Redis
    });
    redis.on('connect', () => console.log('✅ Redis connected'));
    redis.on('error', (err) => console.error('❌ Redis error:', err));

    this.rateLimiter = new RateLimiterRedis({
      storeClient: redis,
      points: 10, // cho phép 10 request
      duration: 60, // trong 60 giây
      keyPrefix: 'rate-limit', // định danh cho Redis key
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const ip = req.ip; // sử dụng IP làm key lưu trữ

    try {
      await this.rateLimiter.consume(ip); // kiểm tra giới hạn rate
      return true;
    } catch (err) {
      const retrySecs = Math.round(err.msBeforeNext / 1000) || 60;
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `🚫 Quá nhiều yêu cầu! Vui lòng thử lại sau ${retrySecs} giây.`,
          error: 'Too Many Requests',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
