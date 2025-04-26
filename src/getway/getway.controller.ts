import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RateLimit } from 'nestjs-rate-limiter';

@Controller('getway')
export class GatewayController {
  @Get()
  @RateLimit({ points: 5, duration: 60 }) // Giới hạn 5 requests mỗi 60 giây cho route này
  getGatewayData() {
    return 'Gateway data';
  }
}

