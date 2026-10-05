import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../schemas/member.model';

@Injectable()
export class MemberService {
	constructor(
		@InjectModel(Member.name)
		private readonly memberModel: Model<Member>,
	) {}

	async getMember(): Promise<string> {
		return 'Member Service is working!';
	}
}
