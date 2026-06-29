import { Test, TestingModule } from '@nestjs/testing';
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
      expect(result).toEqual({ access_token: 'nuevo.jwt.token' });
    });
  });
});