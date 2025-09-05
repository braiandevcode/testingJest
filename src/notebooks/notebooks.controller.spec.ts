import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksController } from './notebooks.controller';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notebook } from './entities/notebook.entity';

// TEST UNITARIO
describe('NotebooksController', () => {
  let controller: NotebooksController;
  let service: NotebooksService;

  // MOCKEANDO SIN spyOn
  let mockNotebookService = {
    findAll: () => [
      {
        title: 'Test-1',
        content: 'Contenido-1',
      },
      {
        title: 'Test-2',
        content: 'Contenido-2',
      },
    ],

    create: () => ({ title: 'Test', content: 'Contenido' }),
  };

  // CONFIGURACION EN CADA TEST
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotebooksController],
      providers: [NotebooksService],
    })
      // AQUI SOBREESCRIBIMOS EL SERVICIO ENTERO → NO PODEMOS USAR spyOn
      .overrideProvider(NotebooksService)
      .useValue(mockNotebookService)
      .compile();

    controller = module.get<NotebooksController>(NotebooksController);
    service = module.get<NotebooksService>(NotebooksService);
  });

  //----- PRUEBAS----
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

  // TEST DE CREACION
  it('debería crear un notebook correctamente', async () => {
    const createDto: CreateNotebookDto = {
      title: 'Test',
      content: 'Contenido',
    };
    const result = await controller.create(createDto);
    expect(result).toEqual(createDto);
  });

  // USANDO SEGUNDA FORMA DE MOCKEADO CON "jest.spyOn" TEST UNITARIO
  describe('Errores controller', () => {
    let message: string;

    // CONFIGURAMOS EN CADA TEST
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [NotebooksController],
        providers: [
          NotebooksService,
          {
            // AQUI SE INYECTA EL REPO FAKE PARA QUE NEST PUEDA CREAR EL SERVICIO REAL
            provide: getRepositoryToken(Notebook),
            useValue: {
              find: jest.fn(), // METODOS FAKE, PARA QUE NO ROMPA
              create: jest.fn(),
              save: jest.fn(),
            },
          },
        ],
      }).compile();

      controller = module.get<NotebooksController>(NotebooksController);
      service = module.get<NotebooksService>(NotebooksService);
    });

    // TEST UNITARIO - ERRORES
    it('debería lanzar excepción en findAll', async () => {
      message = 'Error retrieving notebooks';
      const resultError = new Error(message);

      // CON EL SERVICIO REAL, PODEMOS USAR spyOn
      jest.spyOn(service, 'findAll').mockImplementation(async () => {
        throw resultError;
      });

      // REJECT
      await expect(controller.findAll()).rejects.toThrow(resultError);
    });

    // TEST UNITARIO - ERRORES
    it('debería lanzar excepción en create', async () => {
      message = 'Error creating notebook';
      const resultError = new Error(message);

      // DTO FAKE
      const createDto: CreateNotebookDto = {
        title: 'Test',
        content: 'Contenido',
      };

      // CON EL SERVICIO REAL, PODEMOS USAR spyOn
      jest.spyOn(service, 'create').mockImplementation(async () => {
        throw resultError;
      });

      // REJECT
      await expect(controller.create(createDto)).rejects.toThrow(resultError);
    });
  });
});

// TEST DE INTEGRACION
describe('NotebooksController - Integración', () => {
  let controller: NotebooksController;
  let service: NotebooksService;

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
    service = module.get<NotebooksService>(NotebooksService);
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
