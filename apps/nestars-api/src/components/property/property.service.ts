import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property } from '../../schemas/property.model';

@Injectable()
export class PropertyService {
	constructor(
		@InjectModel(Property.name)
		private readonly propertyModel: Model<Property>,
	) {}

	async getProperty(): Promise<string> {
		return 'Property Service is working!';
	}
}
