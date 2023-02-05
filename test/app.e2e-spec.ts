import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as pactum from 'pactum';
import { CreateUserDto } from 'src/users/dto';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3334);
    pactum.request.setBaseUrl('http://localhost:3334');
  });

  afterAll(() => app.close());

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('User', () => {
    describe('Get users', () => {
      it('should get all users', () => {
        return pactum
          .spec()
          .get('/users')
          .expectStatus(200)
          .expectBodyContains([]);
      });
      it('should create a new user', () => {
        const dto: CreateUserDto = {
          password: '1234560',
          username: 'newuserName',
        };
        return pactum
          .spec()
          .post('/users')
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.username);
      });
    });
  });

  describe('Post', () => {
    describe('Get Posts', () => {
      it('should get all posts', () => {
        return pactum
          .spec()
          .get('/posts')
          .expectStatus(200)
          .expectBodyContains([]);
      });
    });
  });
});
