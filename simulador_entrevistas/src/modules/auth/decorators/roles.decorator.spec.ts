import 'reflect-metadata';
import { Roles } from './roles.decorator';

describe('Roles decorator', () => {
  it('should set roles metadata on method', () => {
    class TestClass {
      @Roles('admin', 'user')
      handler() {}
    }

    const meta = Reflect.getMetadata('roles', TestClass.prototype.handler);
    expect(meta).toEqual(['admin', 'user']);
  });

  it('should set roles metadata on class', () => {
    @Roles('guest')
    class TestClass2 {}

    const meta = Reflect.getMetadata('roles', TestClass2);
    expect(meta).toEqual(['guest']);
  });
});
