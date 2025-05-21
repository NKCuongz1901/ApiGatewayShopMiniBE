import { HttpService } from "@nestjs/axios";
import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { CreatePaymentDto } from "src/common/dto/create-payment.dto";

@Controller('payment')
export class PaymentGatewayController {
    private readonly paymentServiceUrl?: string;
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.paymentServiceUrl = this.configService.get<string>('PAYMENT_SERVICE_URL');
    }
    @Post('create_payment_url')
    async createPaymentUrl(@Body() createPaymentDto: CreatePaymentDto) {
        try {
            const { data } = await firstValueFrom(
                this.httpService.post(`${this.paymentServiceUrl}/create_payment_url`, createPaymentDto, {
                    headers: {
                        'x-internal-api-key': process.env.INTERNAL_API_KEY || 'my-secret-key', // thêm header
                    },
                }),
            );
            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error creating payment url', HttpStatus.BAD_REQUEST);
        }
    }

    @Get('vnpay-return')
    async vnpayReturn(@Query() query: any) {
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(`${this.paymentServiceUrl}/vnpay-return`, {
                    headers: {
                        'x-internal-api-key': process.env.INTERNAL_API_KEY || 'my-secret-key', // thêm header
                    },
                    params: query,
                }),
            );
            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error creating payment url', HttpStatus.BAD_REQUEST);
        }
    }

  
}