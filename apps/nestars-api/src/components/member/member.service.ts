import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { MemberStatus } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/message.enum';

@Injectable()
export class MemberService {
	constructor(@InjectModel('Member') private readonly memberModel: Model<Member>) {}

	public async signup(input: MemberInput): Promise<Member> {
		input.memberPassword = await bcrypt.hash(input.memberPassword, 10);

		try {
			const result = await this.memberModel.create(input);
			const member = result.toObject() as Member;
			delete member.memberPassword;
			return member;
		} catch (err) {
			console.log('Error, Service.signup:', err.message);
			// 11000 = MongoDB duplicate key (memberNick / memberPhone are unique)
			if (err.code === 11000) throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
			throw new InternalServerErrorException(Message.CREATE_FAILED);
		}
	}

	public async login(input: LoginInput): Promise<Member> {
		const { memberNick, memberPassword } = input;
		const member = await this.memberModel
			.findOne({ memberNick: memberNick })
			.select('+memberPassword')
			.lean<Member>()
			.exec();

		if (!member || member.memberStatus === MemberStatus.DELETE) {
			throw new BadRequestException(Message.NO_MEMBER_NICK);
		} else if (member.memberStatus === MemberStatus.BLOCK) {
			throw new BadRequestException(Message.BLOCKED_USER);
		}

		const isMatch = await bcrypt.compare(memberPassword, member.memberPassword);
		if (!isMatch) throw new BadRequestException(Message.WRONG_PASSWORD);

		delete member.memberPassword;
		return member;
	}

	public async updateMember(): Promise<string> {
		return 'updateMember executed!';
	}

	public async getMember(): Promise<string> {
		return 'getMember executed!';
	}
}
