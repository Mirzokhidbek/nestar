import { Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	@Query(() => String)
	async getMember(): Promise<string> {
		return this.memberService.getMember();
	}
}
