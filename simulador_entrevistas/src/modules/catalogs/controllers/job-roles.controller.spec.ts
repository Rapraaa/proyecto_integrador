import { Test, TestingModule } from '@nestjs/testing';
import { JobRolesController } from './job-roles.controller';
import { JobRolesService } from '../services/job-roles.service';

describe('JobRolesController', () => {
  let controller: JobRolesController;

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
      controllers: [JobRolesController],
      providers: [{ provide: JobRolesService, useValue: mockService }],
    }).compile();
    controller = module.get<JobRolesController>(JobRolesController);
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
    mockService.findOne.mockResolvedValue({ id: 'job-1' });
    await controller.findOne('job-1');
    expect(mockService.findOne).toHaveBeenCalledWith('job-1');
  });

  it('create delega el dto al servicio', async () => {
    const dto = { name: 'backend' };
    mockService.create.mockResolvedValue({ id: 'job-1', ...dto });
    await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('update delega id y dto al servicio', async () => {
    const dto = { isActive: false };
    mockService.update.mockResolvedValue({ id: 'job-1', ...dto });
    await controller.update('job-1', dto);
    expect(mockService.update).toHaveBeenCalledWith('job-1', dto);
  });

  it('remove delega el id al servicio', async () => {
    mockService.remove.mockResolvedValue({ id: 'job-1' });
    await controller.remove('job-1');
    expect(mockService.remove).toHaveBeenCalledWith('job-1');
  });
});
