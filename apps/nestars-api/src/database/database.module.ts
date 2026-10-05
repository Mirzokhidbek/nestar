import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<string>('MONGO_URL') ?? 'mongodb://127.0.0.1:27017/nestar',
			}),
			inject: [ConfigService],
		}),
	],
	exports: [MongooseModule],
})
export class DatabaseModule {}
