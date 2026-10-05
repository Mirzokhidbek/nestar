import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

@ArgsType()
export class PaginationQuery {
	@Field(() => Int, { defaultValue: 1 })
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	page: number;

	@Field(() => Int, { defaultValue: 10 })
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	limit: number;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	search?: string;
}
