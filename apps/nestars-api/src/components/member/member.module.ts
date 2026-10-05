import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from '../../schemas/member.model';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Member.name,
				schema: MemberSchema,
			},
		]),
	],
	providers: [MemberResolver, MemberService],
	exports: [MemberService],
})
export class MemberModule {}
