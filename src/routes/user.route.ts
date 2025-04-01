import { HttpService } from "@nestjs/axios";
import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { RegisterAuthDto } from "src/common/dto/auth-register.dto";


@Controller('auth')
export class UserGatewayController {
    private readonly userServiceUrl?: string;
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL')
    }
    // User gateway login
    @Post('login')
    async login(@Req() req: Request, @Res() res: Response) {
        const { data } = await this.httpService.axiosRef.post(
            `${this.userServiceUrl}/login`,
            req.body,
            { withCredentials: true },
        );

        res.cookie('access_token', data.data.tokens.access_token, { httpOnly: true });
        res.cookie('refresh_token', data.data.tokens.refresh_token, { httpOnly: true });

        return res.json(data);
    }
    // User gateway register
    @Post('register')
    async register(@Body() registerAuthDto: RegisterAuthDto) {
        const { data } = await this.httpService.axiosRef.post(
            `${this.userServiceUrl}/register`,
            registerAuthDto,
        );
        return data;
    }
    // User gateway refresh
    @Post('refresh')
    async refreshToken(@Body('refreshToken') refreshToken: string) {
        const { data } = await this.httpService.axiosRef.post(
            `${this.userServiceUrl}/refresh`,
            { refreshToken },
        );
        return data;
    }

    // User gateway verify
    @Post('verify')
    async verifyAccount(@Body() body: { email: string; code: string }) {
        const { data } = await this.httpService.axiosRef.post(
            `${this.userServiceUrl}/verify`,
            body,
        );
        return data;
    }


}