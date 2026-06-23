import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SeniorityLevels } from './enums/user-seniority.enum';

const USER_ID = '33333333-3333-3333-3333-333333333333';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create:  jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update:  jest.fn(),
    remove:  jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // Simula que el Guard siempre permite el paso en las pruebas
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should call usersService.create with correct dto', async () => {
      const dto = { email: 'ana@test.com', password: 'password123', firstName: 'Ana', lastName: 'Perez', seniorityLevel: SeniorityLevels.JUNIOR };
      mockUsersService.create.mockResolvedValue({ id: USER_ID, ...dto });

      const result = await controller.create(dto);
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('id', USER_ID);
    });
  });

  describe('findAll()', () => {
    it('should return an array of users', async () => {
      const mockUsers = [{ id: USER_ID, email: 'ana@test.com' }];
      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();
      expect(mockUsersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne()', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: USER_ID, email: 'ana@test.com' };
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne(USER_ID);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(USER_ID);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update()', () => {
    it('should call usersService.update with id and updateDto', async () => {
      const updateDto = { firstName: 'Ana Maria' };
      mockUsersService.update.mockResolvedValue({ id: USER_ID, ...updateDto });

      const result = await controller.update(USER_ID, updateDto);
      expect(mockUsersService.update).toHaveBeenCalledWith(USER_ID, updateDto);
      expect(result).toHaveProperty('firstName', 'Ana Maria');
    });
  });

  describe('remove()', () => {
    it('should call usersService.remove with correct id', async () => {
      mockUsersService.remove.mockResolvedValue({ id: USER_ID });

      await controller.remove(USER_ID);
      expect(mockUsersService.remove).toHaveBeenCalledWith(USER_ID);
    });
  });
});