import { Roles } from './roles.decorator';
import { SetMetadata } from '@nestjs/common';

describe('Roles Decorator', () => {
  it('should be defined', () => {
    expect(Roles).toBeDefined();
  });

  it('should set metadata with a single role', () => {
    const decorator = Roles('admin');
    const setMetadataDecorator = SetMetadata('roles', ['admin']);

    class TestSingle {}
    decorator(TestSingle);

    const metadata = Reflect.getMetadata('roles', TestSingle);
    expect(metadata).toEqual(['admin']);
  });

  it('should set metadata with multiple roles', () => {
    class TestMultiple {}
    const decorator = Roles('admin', 'user', 'moderator');
    decorator(TestMultiple);

    const metadata = Reflect.getMetadata('roles', TestMultiple);
    expect(metadata).toEqual(['admin', 'user', 'moderator']);
  });

  it('should set metadata with no roles (empty array)', () => {
    class TestEmpty {}
    const decorator = Roles();
    decorator(TestEmpty);

    const metadata = Reflect.getMetadata('roles', TestEmpty);
    expect(metadata).toEqual([]);
  });
});
