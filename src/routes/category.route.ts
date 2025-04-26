import { HttpService } from "@nestjs/axios";
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom, lastValueFrom } from "rxjs";
import { CreateCategoryDto } from "src/common/dto/category-create.dto";
import { UpdateProductDto } from "src/common/dto/update-product.dto";

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
                this.httpService.post(`${this.categoryServiceUrl}`, createCategoryDto,{
                    headers: {
                        'x-internal-api-key': process.env.INTERNAL_API_KEY || 'my-secret-key', // thêm header
                    },
                }),
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
                this.httpService.get(`${this.categoryServiceUrl}`,{
                    headers: {
                        'x-internal-api-key': process.env.INTERNAL_API_KEY || 'my-secret-key', // thêm header
                    },
                }),
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
                this.httpService.get(`${this.categoryServiceUrl}/${id}`,{
                    headers: {
                        'x-internal-api-key': process.env.INTERNAL_API_KEY || 'my-secret-key', // thêm header
                    },
                }),
            );
            return data;

        } catch (error) {
            throw new HttpException(error.response?.data || 'Category not found', HttpStatus.NOT_FOUND);

        }
    }

     @Delete(':id')
        async deleteProduct(@Param('id') id: string) {
            try {
                const { data } = await lastValueFrom(
                    this.httpService.delete(`${this.categoryServiceUrl}/${id}`,{
                        headers: {
                            'x-internal-api-key': process.env.INTERNAL_API_KEY || 'my-secret-key', // thêm header
                        },
                    }),
                );
                return data;
            } catch (error) {
                throw new Error(error.response?.data || 'Error delete product');
    
            }
        }
    
        @Put(':id')
        async editProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
            try {
                const { data } = await lastValueFrom(
                    this.httpService.put(`${this.categoryServiceUrl}/${id}`, updateProductDto,{
                        headers: {
                            'x-internal-api-key': process.env.INTERNAL_API_KEY || 'my-secret-key', // thêm header
                        },
                    }),
                );
                return data;
            } catch (error) {
                throw new HttpException(error.response?.data || 'Error update product', HttpStatus.BAD_REQUEST);
            }
        }



}