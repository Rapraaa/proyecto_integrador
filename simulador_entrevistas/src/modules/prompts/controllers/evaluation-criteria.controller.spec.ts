import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationCriteriaController } from './evaluation-criteria.controller';
import { EvaluationCriteriaService } from '../services/evaluation-criteria.service';

describe('EvaluationCriteriaController', () => {
  let controller: EvaluationCriteriaController;

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
      controllers: [EvaluationCriteriaController],
      providers: [
        { provide: EvaluationCriteriaService, useValue: mockService },
      ],
    }).compile();
    controller = module.get<EvaluationCriteriaController>(
      EvaluationCriteriaController,
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
    mockService.findOne.mockResolvedValue({ id: 'ec-1' });
    await controller.findOne('ec-1');
    expect(mockService.findOne).toHaveBeenCalledWith('ec-1');
  });

  it('create delega el dto al servicio', async () => {
    const dto = { name: 'claridad' };
    mockService.create.mockResolvedValue({ id: 'ec-1', ...dto });
    await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('update delega id y dto al servicio', async () => {
    const dto = { description: 'Explica bien' };
    mockService.update.mockResolvedValue({ id: 'ec-1', ...dto });
    await controller.update('ec-1', dto);
    expect(mockService.update).toHaveBeenCalledWith('ec-1', dto);
  });

  it('remove delega el id al servicio', async () => {
    mockService.remove.mockResolvedValue({ id: 'ec-1' });
    await controller.remove('ec-1');
    expect(mockService.remove).toHaveBeenCalledWith('ec-1');
  });
});
