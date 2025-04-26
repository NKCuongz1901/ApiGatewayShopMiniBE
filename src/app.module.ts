import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UserGatewayController } from './routes/user.route';
import { CategoryGatewayController } from './routes/category.route';
import { ProductGatewayController } from './routes/product.route';
import { UploadGatewayController } from './routes/upload.route';
import { CartGatewayController } from './routes/cart.route';
import { OrderGatewayController } from './routes/order.route';
import { GetwayModule } from './getway/getway.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    HttpModule,
    GetwayModule,
  ],
  controllers: [
    AppController,
    UserGatewayController,
    CategoryGatewayController,
    ProductGatewayController,
    UploadGatewayController,
    CartGatewayController,
    OrderGatewayController,
  ],
  providers: [AppService],
})
export class AppModule { }
