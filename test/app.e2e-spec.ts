import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as pactum from 'pactum';
import { CreateUserDto, EditUserDto } from 'src/users/dto';
import { User } from 'src/users/user.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

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
    userRepository = moduleFixture.get('UserRepository');
  });

  afterAll(async () => {
    await userRepository.query('DELETE FROM users');
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('User', () => {
    const dtoCreateUser: CreateUserDto = {
      password: '1234560',
      username: 'newuserName',
    };
    const dtoUpdateUser: EditUserDto = {
      password: 'pass',
      username: 'userupdated',
    };
    describe('Get users empty', () => {
      it('should get empty array of users', () => {
        return pactum
          .spec()
          .get('/users')
          .expectStatus(200)
          .expectBodyContains([]);
      });
    });
    describe('Create user', () => {
      it('should create a new user', () => {
        return pactum
          .spec()
          .post('/users')
          .withBody(dtoCreateUser)
          .expectStatus(201)
          .expectBodyContains(dtoCreateUser.username)
          .stores('userId', 'id');
      });
      it('should throw an error if not body provided', () => {
        return pactum.spec().post('/users').expectStatus(400);
      });
      it('should throw an error if not username provided', () => {
        return pactum
          .spec()
          .post('/users')
          .withBody({ username: dtoCreateUser.username })
          .expectStatus(400);
      });
      it('should throw an error if not password provided', () => {
        return pactum
          .spec()
          .post('/users')
          .withBody({ password: dtoCreateUser.password })
          .expectStatus(400);
      });
    });
    describe('Get user', () => {
      it('should find a user by id', () => {
        return pactum
          .spec()
          .get('/users/{id}')
          .withPathParams('id', '$S{userId}')
          .expectStatus(200)
          .expectBodyContains(dtoCreateUser.username)
          .expectBodyContains(dtoCreateUser.password)
          .expectBodyContains('id')
          .expectJsonLike({ id: '$S{userId}' });
      });
    });
    describe('Get users array', () => {
      it('should get a list of users containing one', () => {
        return pactum
          .spec()
          .get('/users')
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Update user', () => {
      it('should updated the created user', () => {
        return pactum
          .spec()
          .patch('/users/{id}')
          .withPathParams('id', '$S{userId}')
          .withBody(dtoUpdateUser)
          .expectStatus(200)
          .expectBodyContains(dtoUpdateUser.password)
          .expectBodyContains(dtoUpdateUser.username);
      });
    });
    describe('delete user', () => {
      it('should delete an user successfully by id', () => {
        return pactum
          .spec()
          .delete('/users/{id}')
          .withPathParams('id', '$S{userId}')
          .expectStatus(200);
      });
      it('should throw an error if try to delete an user that doesn`t exists', () => {
        return pactum
          .spec()
          .delete('/users/{id}')
          .withPathParams('id', '$S{userId}')
          .expectStatus(404)
          .expectJsonLike({ message: 'user not found' });
      });
      it('should get an empty array after user delete', () => {
        return pactum
          .spec()
          .get('/users')
          .expectStatus(200)
          .expectBodyContains([]);
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
