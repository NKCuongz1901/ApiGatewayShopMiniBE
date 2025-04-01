import { HttpService } from "@nestjs/axios";
import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { CreateCategoryDto } from "src/common/dto/category-create.dto";

@Controller('category')
export class CategoryGatewayController {
    private readonly categoryServiceUrl?: string;
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService
    ) {
        this.categoryServiceUrl = this.configService.get<string>('CATEGORY_SERVICE_URL');
    }

    @Post()
    async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        try {
            const { data } = await firstValueFrom(
                this.httpService.post(`${this.categoryServiceUrl}`, createCategoryDto),
            );
            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error creating category', HttpStatus.BAD_REQUEST);
        }
    }


    @Get()
    async findAllCategory() {
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(`${this.categoryServiceUrl}`),
            );
            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error fetching categories', HttpStatus.BAD_REQUEST);
        }
    }

    @Get(':id')
    async findCategoryById(@Param("id") id: string) {
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(`${this.categoryServiceUrl}/${id}`),
            );
            return data;

        } catch (error) {
            throw new HttpException(error.response?.data || 'Category not found', HttpStatus.NOT_FOUND);

        }
    }


}