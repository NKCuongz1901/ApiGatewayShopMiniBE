import { HttpService } from "@nestjs/axios";
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";
import { CreateProductDto } from "src/common/dto/create-product.dto";
import { SearchProductDto } from "src/common/dto/search-product.dto";
import { UpdateProductDto } from "src/common/dto/update-product.dto";


@Controller('product')
export class ProductGatewayController {
    private readonly productServiceUrl?: string;
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.productServiceUrl = this.configService.get<string>('PRODUCT_SERVICE_URL')
    }

    @Post()
    async createProduct(@Body() createProductDtO: CreateProductDto) {
        try {
            const { data } = await lastValueFrom(
                this.httpService.post(`${this.productServiceUrl}`, createProductDtO, {
                    headers: {
                        'x-internal-api-key': process.env.INTERNAL_API_KEY || 'my-secret-key', // thêm header
                    },
                }),
            );
            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error creating product', HttpStatus.BAD_REQUEST);
        }
    }

    @Get()
    async getAllProduct() {
        try {
            const { data } = await lastValueFrom(
                this.httpService.get(`${this.productServiceUrl}`, {
                    headers: {
                        'x-internal-api-key': process.env.INTERNAL_API_KEY || 'my-secret-key', // thêm header
                    },
                },)
            );
            return data;
        } catch (error) {
            throw new HttpException(error.response?.data || 'Error fetching product', HttpStatus.BAD_REQUEST);

        }
    }


    @Get('search')
    async searchProduct(@Query() searchProductDto: SearchProductDto) {
        try {
            const { data } = await lastValueFrom(
                this.httpService.get(`${this.productServiceUrl}/search`, {
                    params: searchProductDto
                })
            );
            return data;
        } catch (error) {
            throw new Error(error.response?.data || 'Error searching product');
        }
    }

    @Get(':id')
    async getProductById(@Param('id') id: string) {
        try {
            const data = await lastValueFrom(
                this.httpService.get(`${this.productServiceUrl}/${id}`),
            );
            return data;
        } catch (error) {
            throw new Error(error.response?.data || 'Error searching product');

        }
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        try {
            const { data } = await lastValueFrom(
                this.httpService.delete(`${this.productServiceUrl}/${id}`, {
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
                this.httpService.put(`${this.productServiceUrl}/${id}`, updateProductDto, {
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