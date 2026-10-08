import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';

describe('AppController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideProvider(getConnectionToken())
			.useValue({
				model: jest.fn().mockReturnValue({}),
				models: {},
				close: jest.fn().mockResolvedValue(true),
			})
			.overrideProvider(getModelToken('Member'))
			.useValue({})
			.overrideProvider(getModelToken('Property'))
			.useValue({})
			.compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		if (app) {
			await app.close();
		}
	});

	it('/ (GET)', () => {
		return request(app.getHttpServer())
			.get('/')
			.expect(200)
			.expect('Hello from Nestars API Server!');
	});
});
