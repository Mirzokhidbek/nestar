import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'members' })
export class Member extends Document {
	@Prop({ type: String, required: true, unique: true })
	memberNick: string;

	@Prop({ type: String, required: true })
	memberPhone: string;

	@Prop({ type: String, required: true })
	memberPassword: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
