import { HttpService } from "@nestjs/axios";
import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";

@Controller('cart')
export class CartGatewayController {
    private readonly cartServiceUrl?: string;
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {
        this.cartServiceUrl = this.configService.get<string>('CART_SERVICE_URL');
    }

    @Post()
    async addToCart(@Body() body: { userId: string, productId: string, quantity: number }) {
        try {
            const { data } = await lastValueFrom(
                this.httpService.post(`${this.cartServiceUrl}`, body),
            );
            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error add to cart', HttpStatus.BAD_REQUEST);

        }
    }

    @Get(':userId')
    async getCart(@Param('userId') userId: string) {
        try {
            const { data } = await lastValueFrom(
                this.httpService.get(`${this.cartServiceUrl}/${userId}`,)
            );
            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error add to cart', HttpStatus.BAD_REQUEST);

        }
    }

}