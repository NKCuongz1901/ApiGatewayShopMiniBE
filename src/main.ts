import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  const configService = app.get(ConfigService);
  const port = configService.get("PORT");
  const urlUserVice = configService.get<string>("USER_SERVICE_URL");
  app.setGlobalPrefix('api/v1');
  await app.listen(port);
  console.log("Api-gateway is running in port: ", port);
  console.log("URL User Service: ", urlUserVice);
}
bootstrap();
