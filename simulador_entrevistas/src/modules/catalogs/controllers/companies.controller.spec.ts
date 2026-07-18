import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from '../services/companies.service';

describe('CompaniesController', () => {
  let controller: CompaniesController;

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
      controllers: [CompaniesController],
      providers: [{ provide: CompaniesService, useValue: mockService }],
    }).compile();
    controller = module.get<CompaniesController>(CompaniesController);
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
    mockService.findOne.mockResolvedValue({ id: 'co-1' });
    await controller.findOne('co-1');
    expect(mockService.findOne).toHaveBeenCalledWith('co-1');
  });

  it('create delega el dto al servicio', async () => {
    const dto = { name: 'Startup Tech' };
    mockService.create.mockResolvedValue({ id: 'co-1', ...dto });
    await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('update delega id y dto al servicio', async () => {
    const dto = { description: 'Global' };
    mockService.update.mockResolvedValue({ id: 'co-1', ...dto });
    await controller.update('co-1', dto);
    expect(mockService.update).toHaveBeenCalledWith('co-1', dto);
  });

  it('remove delega el id al servicio', async () => {
    mockService.remove.mockResolvedValue({ id: 'co-1' });
    await controller.remove('co-1');
    expect(mockService.remove).toHaveBeenCalledWith('co-1');
  });
});
