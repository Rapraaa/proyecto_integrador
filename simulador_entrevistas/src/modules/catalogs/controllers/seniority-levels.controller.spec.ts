import { Test, TestingModule } from '@nestjs/testing';
import { SeniorityLevelsController } from './seniority-levels.controller';
import { SeniorityLevelsService } from '../services/seniority-levels.service';

describe('SeniorityLevelsController', () => {
  let controller: SeniorityLevelsController;

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
      controllers: [SeniorityLevelsController],
      providers: [
        { provide: SeniorityLevelsService, useValue: mockService },
      ],
    }).compile();
    controller = module.get<SeniorityLevelsController>(
      SeniorityLevelsController,
    );
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
    mockService.findOne.mockResolvedValue({ id: 'sen-1' });
    await controller.findOne('sen-1');
    expect(mockService.findOne).toHaveBeenCalledWith('sen-1');
  });

  it('create delega el dto al servicio', async () => {
    const dto = { name: 'junior' };
    mockService.create.mockResolvedValue({ id: 'sen-1', ...dto });
    await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('update delega id y dto al servicio', async () => {
    const dto = { description: 'Intermedio' };
    mockService.update.mockResolvedValue({ id: 'sen-1', ...dto });
    await controller.update('sen-1', dto);
    expect(mockService.update).toHaveBeenCalledWith('sen-1', dto);
  });

  it('remove delega el id al servicio', async () => {
    mockService.remove.mockResolvedValue({ id: 'sen-1' });
    await controller.remove('sen-1');
    expect(mockService.remove).toHaveBeenCalledWith('sen-1');
  });
});
