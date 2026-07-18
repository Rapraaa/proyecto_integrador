import { Test, TestingModule } from '@nestjs/testing';
import { InterviewTypesController } from './interview-types.controller';
import { InterviewTypesService } from '../services/interview-types.service';

describe('InterviewTypesController', () => {
  let controller: InterviewTypesController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterviewTypesController],
      providers: [
        { provide: InterviewTypesService, useValue: mockService },
      ],
    }).compile();
    controller = module.get<InterviewTypesController>(InterviewTypesController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('findAll delega la consulta al servicio', async () => {
    const query = { page: 1, limit: 10 };
    mockService.findAll.mockResolvedValue({ data: [], meta: {} });
    await controller.findAll(query);
    expect(mockService.findAll).toHaveBeenCalledWith(query);
  });

  it('findOne delega el id al servicio', async () => {
    mockService.findOne.mockResolvedValue({ id: 'it-1' });
    await controller.findOne('it-1');
    expect(mockService.findOne).toHaveBeenCalledWith('it-1');
  });

  it('create delega el dto al servicio', async () => {
    const dto = { name: 'technical' };
    mockService.create.mockResolvedValue({ id: 'it-1', ...dto });
    await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('update delega id y dto al servicio', async () => {
    const dto = { description: 'Con código' };
    mockService.update.mockResolvedValue({ id: 'it-1', ...dto });
    await controller.update('it-1', dto);
    expect(mockService.update).toHaveBeenCalledWith('it-1', dto);
  });

  it('remove delega el id al servicio', async () => {
    mockService.remove.mockResolvedValue({ id: 'it-1' });
    await controller.remove('it-1');
    expect(mockService.remove).toHaveBeenCalledWith('it-1');
  });
});
