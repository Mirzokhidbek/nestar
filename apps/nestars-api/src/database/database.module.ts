import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const isProduction = process.env.NODE_ENV === 'production';
				const uri = isProduction
					? configService.get<string>('MONGO_PROD')
					: configService.get<string>('MONGO_DEV');

				return {
					uri: uri ?? configService.get<string>('MONGO_DEV'),
				};
			},
		}),
	],
	exports: [MongooseModule],
})
export class DatabaseModule {}
