import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('should be defined and have canActivate', () => {
    const guard = new JwtAuthGuard();
    expect(guard).toBeDefined();
    expect(typeof (guard as any).canActivate).toBe('function');
  });
});
