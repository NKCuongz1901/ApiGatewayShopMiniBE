import { HttpService } from "@nestjs/axios";
import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";
import { CreateOrderDto } from "src/common/dto/create-order.dto";

@Controller('order')
export class OrderGatewayController {
    private readonly orderServiceUrl?: string;
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.orderServiceUrl = this.configService.get<string>('ORDER_SERVICE_URL');
    }


    @Post()
    async placeOrder(@Body() userId: string, @Body() createOrderDto: CreateOrderDto) {
        try {
            const { data } = await lastValueFrom(
                this.httpService.post(`${this.orderServiceUrl}`, { userId, ...createOrderDto }),
            );
            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error place order', HttpStatus.BAD_REQUEST);

        }
    }

    @Get('userId')
    async getOrderByUserId(@Param('userId') userId: string) {
        try {
            const { data } = await lastValueFrom(
                this.httpService.get(`${this.orderServiceUrl}/${userId}`),
            );
            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error fetching order data', HttpStatus.BAD_REQUEST);

        }
    }
}