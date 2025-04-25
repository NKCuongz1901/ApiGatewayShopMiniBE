import { HttpService } from "@nestjs/axios";
import { Body, Controller, Get, Post, Req, Res, Delete, Param, Patch } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from 'express';
import { RegisterAuthDto } from "src/common/dto/auth-register.dto";
import { CreateUserDto } from "src/common/dto/user-create.dto";
import { UpdateUserDto } from "src/common/update-user.dto";



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

    @Get('me')
    async getMe(@Req() req: Request, @Res() res: Response) {
        try {
            const accessToken = req.cookies['access_token'];
            if (!accessToken) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const { data } = await this.httpService.axiosRef.get(
                `${this.userServiceUrl}/me`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            return res.json(data);
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Tokenn expired or invalid' });
        }
    }
    // async getMe(@Req() req: Request, @Res() res: Response) {
    //     // Lấy access token từ localStorage
    //     const accessToken = req.cookies ? req.cookies['access_token'] : null;
        
    //     if (!accessToken) {
    //         return res.status(401).json({ success: false, message: 'Unauthorized' });
    //     }
    
    //     try {
    //         // Gửi yêu cầu GET tới API với Authorization header
    //         const { data } = await this.httpService.axiosRef.get(
    //             `${this.userServiceUrl}/me`,{
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //             },
    //         });
    
    //         // Xử lý kết quả trả về từ API
    //         return res.json(data);
    //     } catch (error) {
            
    //         // Trường hợp token hết hạn hoặc không hợp lệ
    //         if (error.response && error.response.status === 401) {
    //             console.log('Token expired or invalid');
    //         } else {
    //             console.log('An error occurred while fetching data');
    //         }
    //     }
    // }
    

    @Post('user')
    async createUser(@Body() createUserDto: CreateUserDto) {
        const { data } = await this.httpService.axiosRef.post(
            `${this.userServiceUrl}/user`,
            createUserDto,
        );
        return data;
    }

    @Get("user")
    async getAllUsers() {
        const { data } = await this.httpService.axiosRef.get(
            `${this.userServiceUrl}/user`,
        );
        return data;
    }

    @Patch('user/:id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const { data } = await this.httpService.axiosRef.patch(
            `${this.userServiceUrl}/user/${id}`,
            updateUserDto,
        );
        return data;
    }

    @Delete('user/:id')
    async remove(@Param('id') id: string) {
        const { data } = await this.httpService.axiosRef.delete(
            `${this.userServiceUrl}/user/${id}`,
        );
        return data;
    }
}