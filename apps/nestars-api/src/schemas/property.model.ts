import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true, collection: 'properties' })
export class Property extends Document {
	@Prop({ type: String, required: true })
	propertyTitle: string;

	@Prop({ type: Number, required: true })
	propertyPrice: number;

	@Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Member', required: true })
	memberId: MongooseSchema.Types.ObjectId;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
