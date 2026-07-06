import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const createMockContext = (user?: any): ExecutionContext =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as unknown as ExecutionContext;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        { provide: Reflector, useValue: mockReflector },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true when no roles are required', () => {
    mockReflector.getAllAndOverride.mockReturnValue(undefined);
    const context = createMockContext({ role: 'user' });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should return true when user has a required role', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['admin', 'user']);
    const context = createMockContext({ role: 'admin' });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should return false when user does not have a required role', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['admin']);
    const context = createMockContext({ role: 'user' });

    expect(guard.canActivate(context)).toBe(false);
  });

  it('should return false when user is undefined', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['admin']);
    const context = createMockContext(undefined);

    expect(guard.canActivate(context)).toBe(false);
  });
});
