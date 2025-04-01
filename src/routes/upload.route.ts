import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

@Controller('upload')
export class UploadGatewayController {
    private readonly uploadServiceUrl?: string;
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.uploadServiceUrl = this.configService.get<string>('UPLOAD_SERVICE_URL')
    }

    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        const formData = new FormData();
        formData.append('file', file.buffer, { filename: file.originalname });

        const { data } = await lastValueFrom(
            this.httpService.post(`${this.uploadServiceUrl}/image`, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            }),
        );

        return data;
    }
}