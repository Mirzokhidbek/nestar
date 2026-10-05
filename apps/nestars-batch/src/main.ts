import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT_BATCH') ?? 3008;

  await app.listen(port);
  console.log(`Nestars Batch Server is running on: http://localhost:${port}`);
}
bootstrap();
