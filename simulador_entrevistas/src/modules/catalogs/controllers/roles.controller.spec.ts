import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from '../services/roles.service';

describe('RolesController', () => {
  let controller: RolesController;

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
      controllers: [RolesController],
      providers: [{ provide: RolesService, useValue: mockService }],
    }).compile();
    controller = module.get<RolesController>(RolesController);
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
    mockService.findOne.mockResolvedValue({ id: 'role-1' });
    await controller.findOne('role-1');
    expect(mockService.findOne).toHaveBeenCalledWith('role-1');
  });

  it('create delega el dto al servicio', async () => {
    const dto = { name: 'admin' };
    mockService.create.mockResolvedValue({ id: 'role-1', ...dto });
    const result = await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(result).toMatchObject({ name: 'admin' });
  });

  it('update delega id y dto al servicio', async () => {
    const dto = { description: 'Gestor' };
    mockService.update.mockResolvedValue({ id: 'role-1', ...dto });
    await controller.update('role-1', dto);
    expect(mockService.update).toHaveBeenCalledWith('role-1', dto);
  });

  it('remove delega el id al servicio', async () => {
    mockService.remove.mockResolvedValue({ id: 'role-1' });
    await controller.remove('role-1');
    expect(mockService.remove).toHaveBeenCalledWith('role-1');
  });
});
