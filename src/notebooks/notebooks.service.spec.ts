import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksService } from './notebooks.service';
import { Notebook } from './entities/notebook.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('NotebooksService', () => {
  let service: NotebooksService;

  const mockRepo = {
    find: jest.fn().mockResolvedValue([]),
    save: jest.fn().mockResolvedValue({ id: 1, title: 'Test', content: 'Contenido' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotebooksService,
        {
          provide: getRepositoryToken(Notebook),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<NotebooksService>(NotebooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

