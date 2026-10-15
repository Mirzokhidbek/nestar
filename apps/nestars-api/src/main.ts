import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// Global pipe: every incoming input is validated by class-validator decorators in the DTOs
	app.useGlobalPipes(new ValidationPipe());

	const configService = app.get(ConfigService);
	const port = configService.get<number>('PORT_API') ?? 3007;

	await app.listen(port);
	console.log(`Nestars API Server is running on: http://localhost:${port}`);
}
bootstrap();
