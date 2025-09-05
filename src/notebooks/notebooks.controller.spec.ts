import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksController } from './notebooks.controller';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notebook } from './entities/notebook.entity';

// TEST UNITARIO
describe('NotebooksController', () => {
  let controller: NotebooksController;
  let mockNotebookService = {
    // findAll: () => [],  // ==> DEVOLVER VACIO
    findAll: () => [
      {
        title: 'Test-1',
        content: 'Contenido-1',
      },
      {
        title: 'Test-2',
        content: 'Contenido-2',
      },
    ], // ==> DEVOLVER DATOS

    create: () => ({ title: 'Test', content: 'Contenido' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotebooksController],
      providers: [NotebooksService],
    })
      .overrideProvider(NotebooksService)
      .useValue(mockNotebookService)
      .compile();

    controller = module.get<NotebooksController>(NotebooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // TEST DE CONSULTAS
  it('deberia mostrar datos correctamente', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([
      {
        title: 'Test-1',
        content: 'Contenido-1',
      },
      {
        title: 'Test-2',
        content: 'Contenido-2',
      },
    ]);
  });

  // TEST DE CRACION
  it('debería crear un notebook correctamente', async () => {
    const createDto: CreateNotebookDto = {
      title: 'Test',
      content: 'Contenido',
    };
    const result = await controller.create(createDto);
    expect(result).toEqual(createDto);
  });

  // TEST UNITARIO - Errores
  it('debería lanzar excepción en findAll', async () => {
    const mockErrorService = {
      findAll: () => {
        throw new Error('Error retrieving notebooks');
      },
      create: () => ({ title: 'Test', content: 'Contenido' }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotebooksController],
      providers: [NotebooksService],
    })
      .overrideProvider(NotebooksService)
      .useValue(mockErrorService)
      .compile();

    const ctrl = module.get<NotebooksController>(NotebooksController);

    await expect(ctrl.findAll()).rejects.toThrow('Error retrieving notebooks');
  });

  it('debería lanzar excepción en create', async () => {
    const mockErrorService = {
      findAll: () => [],
      create: () => {
        throw new Error('Error creating notebook');
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotebooksController],
      providers: [NotebooksService],
    })
      .overrideProvider(NotebooksService)
      .useValue(mockErrorService)
      .compile();

    const ctrl = module.get<NotebooksController>(NotebooksController);

    await expect(
      ctrl.create({ title: 'Test', content: 'Contenido' }),
    ).rejects.toThrow('Error creating notebook');
  });
});

// TEST DE INTEGRACION
describe('NotebooksController - Integración', () => {
  let controller: NotebooksController;

  const createDto = { title: 'Test', content: 'Contenido' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotebooksController],
      providers: [
        NotebooksService, // SERVICENOTEBOOKS REAL
        {
          provide: getRepositoryToken(Notebook),
          useValue: {
            find: jest.fn().mockResolvedValue([
              { title: 'Test-1', content: 'Contenido-1' },
              { title: 'Test-2', content: 'Contenido-2' },
            ]),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockResolvedValue(createDto),
          },
        },
      ],
    }).compile();

    controller = module.get<NotebooksController>(NotebooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('debería devolver los valores', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([
      { title: 'Test-1', content: 'Contenido-1' },
      { title: 'Test-2', content: 'Contenido-2' },
    ]);
  });

  it('debería crear un notebook correctamente', async () => {
    const createDto: CreateNotebookDto = {
      title: 'Test',
      content: 'Contenido',
    };
    const result = await controller.create(createDto);
    expect(result).toEqual(createDto);
  });
});




