import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login:    jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login()', () => {
    it('should return access_token JSON structure on successful login', async () => {
      const mockResponse = { access_token: 'mi.jwt.token' };
      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await controller.login({ email: 'admin@test.com', password: 'pass' });
      expect(result).toEqual({ access_token: 'mi.jwt.token' });
      expect(mockAuthService.login).toHaveBeenCalledWith({ email: 'admin@test.com', password: 'pass' });
    });

    it('should throw UnauthorizedException when login fails', async () => {
      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Credenciales inválidas'));

      await expect(
        controller.login({ email: 'wrong@test.com', password: 'badpass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should propagate generic login errors from authService', async () => {
      const error = new Error('Service unavailable');
      mockAuthService.login.mockRejectedValue(error);

      await expect(controller.login({ email: 'wrong@test.com', password: 'badpass' })).rejects.toThrow('Service unavailable');
      expect(mockAuthService.login).toHaveBeenCalledWith({ email: 'wrong@test.com', password: 'badpass' });
    });
  });

  describe('register()', () => {
    it('should return access_token JSON structure on successful registration', async () => {
      const mockResponse = { access_token: 'nuevo.jwt.token' };
      mockAuthService.register.mockResolvedValue(mockResponse);

      const dto = { 
        email: 'nuevo@test.com', 
        password: 'pass123', 
        firstName: 'John', 
        lastName: 'Doe', 
        seniorityLevel: 'mid' as any 
      };

      const result = await controller.register(dto);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ access_token: 'nuevo.jwt.token' });
    });

    it('should propagate generic registration errors from authService', async () => {
      const dto = {
        email: 'nuevo@test.com',
        password: 'pass123',
        firstName: 'John',
        lastName: 'Doe',
        seniorityLevel: 'mid' as any,
      };
      const error = new Error('Email already exists');
      mockAuthService.register.mockRejectedValue(error);

      await expect(controller.register(dto)).rejects.toThrow('Email already exists');
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });

    it('should throw UnauthorizedException when registration fails unexpectedly', async () => {
      const dto = {
        email: 'nuevo@test.com',
        password: 'pass123',
        firstName: 'John',
        lastName: 'Doe',
        seniorityLevel: 'mid' as any,
      };

      mockAuthService.register.mockRejectedValue(new UnauthorizedException('No autorizado'));

      await expect(controller.register(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});