jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const USER_ID = '33333333-3333-3333-3333-333333333333';

describe('AuthService', () => {
  let service: AuthService;

  // Ajustamos el mock con 'findByEmail' adaptado a tu proyecto
  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login()', () => {
    it('should throw UnauthorizedException when user does not exist', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'noexiste@test.com', password: '123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      const mockUser = {
        id: USER_ID,
        email: 'pato@test.com',
        passwordHash: '$2b$10$hash',
      };
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'pato@test.com', password: 'wrong_password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return an access_token object on successful login', async () => {
      const mockUser = {
        id: USER_ID,
        email: 'pato@test.com',
        passwordHash: '$2b$10$hash',
        role: { name: 'user' }, //el rol ahora es una FK al catálogo
      };
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt.token.valido');

      const result = await service.login({
        email: 'pato@test.com',
        password: 'correct_password',
      });
      expect(result).toEqual({ access_token: 'jwt.token.valido' });
    });

    it('should call jwtService.sign with correct payload structure', async () => {
      const mockUser = {
        id: USER_ID,
        email: 'maria@test.com',
        passwordHash: '$2b$10$hash',
        role: { name: 'user' },
      };
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('token');

      await service.login({ email: 'maria@test.com', password: 'pass' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        id: USER_ID,
        email: 'maria@test.com',
        role: 'user',
      });
    });
  });

  describe('register()', () => {
    it('should return an access_token object on successful registration', async () => {
      const mockUser = {
        id: USER_ID,
        email: 'nuevo@test.com',
        role: { name: 'user' },
      };
      mockUsersService.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('registro.token');

      const dto = {
        email: 'nuevo@test.com',
        password: 'pass123',
        firstName: 'Domenica',
        lastName: 'Carrera',
        seniorityLevel: 'junior' as any,
      };

      const result = await service.register(dto);
      expect(result).toEqual({ access_token: 'registro.token' });
    });

    it('should call usersService.create with the dto', async () => {
      const dto = {
        email: 'nuevo@test.com',
        password: 'pass123',
        firstName: 'Domenica',
        lastName: 'Carrera',
        seniorityLevel: 'junior' as any,
      };
      mockUsersService.create.mockResolvedValue(dto);
      mockJwtService.sign.mockReturnValue('token');

      await service.register(dto);
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
    });
  });
});
