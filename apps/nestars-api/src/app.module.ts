import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { DatabaseModule } from './database/database.module';
import { ComponentsModule } from './components/components.module';
import { SchemaModule } from './schemas/schema.module';

declare module '@nestjs/apollo' {
	interface ApolloDriverConfig {
		uploads?: boolean;
	}
}

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: true,
			playground: true,
			uploads: false,
		}),
		DatabaseModule,
		SchemaModule,
		ComponentsModule,
	],
	controllers: [AppController],
	providers: [AppService, AppResolver],
})
export class AppModule {}
