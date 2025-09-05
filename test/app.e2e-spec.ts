import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notebook } from '../src/notebooks/entities/notebook.entity';

describe('NotebooksController (E2E)', () => {
  let app: INestApplication;

  const createDto = { title: 'Test', content: 'Contenido' };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(Notebook))
      .useValue({
        find: jest.fn().mockResolvedValue([
          { title: 'Test-1', content: 'Contenido-1' },
          { title: 'Test-2', content: 'Contenido-2' },
        ]),
        create: jest.fn().mockImplementation((dto) => dto),
        save: jest.fn().mockResolvedValue(createDto),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/notebooks (GET) debería devolver los notebooks', () => {
    return request(app.getHttpServer())
      .get('/notebooks')
      .expect(200)
      .expect([
        { title: 'Test-1', content: 'Contenido-1' },
        { title: 'Test-2', content: 'Contenido-2' },
      ]);
  });

  it('/notebooks (POST) debería crear un notebook', () => {
    return request(app.getHttpServer())
      .post('/notebooks')
      .send(createDto)
      .expect(201)
      .expect(createDto);
  });

  // TEST DE INTEGRACIÓN - Errores
  it('debería devolver 500 si findAll falla', async () => {
    const failRepo = {
      find: jest.fn().mockRejectedValue(new Error('fail')),
      create: jest.fn(),
      save: jest.fn(),
    };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(Notebook))
      .useValue(failRepo)
      .compile();

    const app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer()).get('/notebooks').expect(500);

    await app.close();
  });

  it('debería devolver 400 si create falla', async () => {
    const failRepo = {
      find: jest.fn(),
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockRejectedValue(new Error('fail')),
    };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(Notebook))
      .useValue(failRepo)
      .compile();

    const app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/notebooks')
      .send({ title: 'Test', content: 'Contenido' })
      .expect(400);

    await app.close();
  });
});
