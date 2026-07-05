import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  const mockReflector = { getAllAndOverride: jest.fn() } as unknown as Reflector;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new RolesGuard(mockReflector);
  });

  function makeContext(user?: any): ExecutionContext {
    return {
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
      getHandler: () => 'handler',
      getClass: () => 'class',
    } as unknown as ExecutionContext;
  }

  it('should allow when no roles are required', () => {
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);
    const ctx = makeContext({ role: 'user' });

    expect(guard.canActivate(ctx)).toBe(true);
    expect(mockReflector.getAllAndOverride).toHaveBeenCalled();
  });

  it('should allow when user has required role', () => {
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    const ctx = makeContext({ role: 'admin' });

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should deny when user does not have required role', () => {
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    const ctx = makeContext({ role: 'user' });

    expect(guard.canActivate(ctx)).toBe(false);
  });

  it('should deny when request has no user', () => {
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValue(['admin']);
    const ctx = makeContext(undefined);

    expect(guard.canActivate(ctx)).toBe(false);
  });
});
