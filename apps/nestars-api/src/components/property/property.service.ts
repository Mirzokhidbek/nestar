import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PropertyService {
	constructor(
		@InjectModel('Property')
		private readonly propertyModel: Model<any>,
	) {}

	async getProperty(): Promise<string> {
		return 'Property Service is working!';
	}
}
