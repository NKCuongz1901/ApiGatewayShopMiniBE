import { HttpService } from "@nestjs/axios";
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post } from "@nestjs/common";
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
                this.httpService.post(`${this.cartServiceUrl}`, body,{
                    headers: {
                        'x-internal-api-key': process.env.INTERNAL_API_KEY || 'my-secret-key', // thêm header
                    },
                } )
            );
            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error add to cart', HttpStatus.BAD_REQUEST);

        }
    }

    @Patch('update')
    async updateCart(@Body() body: { userId: string, productId: string, quantity: number }) {
        try {
            const { data } = await lastValueFrom(
                this.httpService.patch(`${this.cartServiceUrl}/update`, body,{
                    headers: {
                        'x-internal-api-key': process.env.INTERNAL_API_KEY || 'my-secret-key', // thêm header
                    },
                } )
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
                this.httpService.get(`${this.cartServiceUrl}/${userId}`, {
                    headers: {
                        'x-internal-api-key': process.env.INTERNAL_API_KEY || 'my-secret-key', // thêm header
                    },
                })
            );
            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || '   Error add to cart', HttpStatus.BAD_REQUEST);

        }
    }

    //remove cart
    @Delete('remove')
    async removeCart(@Body() body: { userId: string}) {
        try {
            const { data } = await lastValueFrom(
                this.httpService.delete(`${this.cartServiceUrl}/remove` ,{
                    headers: {
                        'x-internal-api-key': process.env.INTERNAL_API_KEY || 'my-secret-key', // thêm header
                    },
                    data: body,
                }, 
            )
            );
            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error remove cart', HttpStatus.BAD_REQUEST);

        }
    }

    //remove product in cart
    @Delete('remove-product')
    async removeProductInCart(@Body() body: { userId: string, productId: string }) {
        try {
            const { data } = await lastValueFrom(
                this.httpService.delete(`${this.cartServiceUrl}/remove-product`, {
                    headers: {
                        'x-internal-api-key': process.env.INTERNAL_API_KEY || 'my-secret-key', // thêm header
                    },
                    data: body,
                })
            );
            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error remove product in cart', HttpStatus.BAD_REQUEST);

        }
    }
}