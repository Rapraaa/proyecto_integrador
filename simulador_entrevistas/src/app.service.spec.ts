import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('getHealth()', () => {
    it('devuelve el estado de salud del servicio', () => {
      const health = service.getHealth();
      expect(health.status).toBe('ok');
      expect(health.service).toBe('simulador_entrevistas');
      expect(typeof health.timestamp).toBe('string');
      expect(typeof health.uptime).toBe('number');
    });
  });

  describe('getHello()', () => {
    it('devuelve el saludo por defecto', () => {
      expect(service.getHello()).toBe('Hello World!');
    });
  });
});
