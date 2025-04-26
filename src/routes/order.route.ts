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
                this.httpService.post(`${this.orderServiceUrl}`, { userId, ...createOrderDto },{
                    headers: {
                        'x-internal-api-key': process.env.INTERNAL_API_KEY || 'my-secret-key', // thêm header
                    },
                }),
            );
            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error place order', HttpStatus.BAD_REQUEST);

        }
    }

    @Get(':id')
    async getOrderByUserId(@Param('id') userId: string) {
        try {
            const { data } = await lastValueFrom(
                this.httpService.get(`${this.orderServiceUrl}/${userId}`,{
                    headers: {
                        'x-internal-api-key': process.env.INTERNAL_API_KEY || 'my-secret-key', // thêm header
                    },
                }),
            );
            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error fetching order data', HttpStatus.BAD_REQUEST);

        }
    }

    @Get()
    async getAllOrder() {
        try {
            const { data } = await lastValueFrom(
                this.httpService.get(`${this.orderServiceUrl}`,{
                    headers: {
                        'x-internal-api-key': process.env.INTERNAL_API_KEY || 'my-secret-key', // thêm header
                    },
                }),
            );
            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error fetching order data', HttpStatus.BAD_REQUEST);

        }
    }

}