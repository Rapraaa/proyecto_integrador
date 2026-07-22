import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockConfigService = {
    get: jest.fn(() => 'K9x2mQ7vLpR4tYw8NbHc3ZaJ5eFgD6sU1oIkMnBvCxZq'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate()', () => {
    it('should return user object with id, email, and role from payload', async () => {
      const payload = { id: 'user-123', email: 'test@test.com', role: 'admin' };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@test.com',
        role: 'admin',
      });
    });

    it('should handle payload with missing fields gracefully', async () => {
      const payload = { id: 'user-456' };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        id: 'user-456',
        email: undefined,
        role: undefined,
      });
    });

    it('should handle completely empty payload', async () => {
      const result = await strategy.validate({});

      expect(result).toEqual({
        id: undefined,
        email: undefined,
        role: undefined,
      });
    });
  });
});
