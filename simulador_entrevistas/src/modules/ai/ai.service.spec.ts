import { ServiceUnavailableException } from '@nestjs/common';

// Mock del SDK oficial de Google: NO se llama a la API real en las pruebas.
const mockGenerateContent = jest.fn();
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: mockGenerateContent,
    }),
  })),
}));

import { AiService } from './ai.service';

//Helper: simula la respuesta del modelo generativo
const respuestaIA = (texto: string) => ({
  response: { text: () => texto },
});

describe('AiService', () => {
  let service: AiService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    process.env.GEMINI_API_KEY = 'clave-de-prueba';
    service = new AiService();
    service.onModuleInit();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit()', () => {
    it('lanza error si no hay API key configurada', () => {
      delete process.env.GEMINI_API_KEY;
      const sinClave = new AiService();
      expect(() => sinClave.onModuleInit()).toThrow('API key no configurada');
    });
  });

  describe('iniciarEntrevista()', () => {
    it('devuelve la primera pregunta recortando espacios', async () => {
      mockGenerateContent.mockResolvedValue(
        respuestaIA('  ¿Qué es una promesa en JavaScript?  '),
      );

      const result = await service.iniciarEntrevista({
        rol: 'backend',
        nivel: 'senior',
        tecnologias: ['Node.js'],
      });

      expect(result).toBe('¿Qué es una promesa en JavaScript?');
      expect(mockGenerateContent).toHaveBeenCalled();
    });

    it('lanza ServiceUnavailableException si la IA falla', async () => {
      mockGenerateContent.mockRejectedValue(new Error('timeout'));
      await expect(
        service.iniciarEntrevista({
          rol: 'backend',
          nivel: 'junior',
          tecnologias: ['Go'],
        }),
      ).rejects.toThrow(ServiceUnavailableException);
    });
  });

  describe('continuarEntrevista()', () => {
    it('devuelve la siguiente pregunta a partir del historial', async () => {
      mockGenerateContent.mockResolvedValue(
        respuestaIA('¿Cómo manejarías la concurrencia?'),
      );

      const result = await service.continuarEntrevista([
        { sender: 'ai', content: 'Pregunta 1' },
        { sender: 'user', content: 'Respuesta 1' },
      ]);

      expect(result).toBe('¿Cómo manejarías la concurrencia?');
    });

    it('lanza ServiceUnavailableException si la IA falla', async () => {
      mockGenerateContent.mockRejectedValue(new Error('fallo'));
      await expect(
        service.continuarEntrevista([{ sender: 'user', content: 'x' }]),
      ).rejects.toThrow(ServiceUnavailableException);
    });
  });

  describe('evaluarEntrevista()', () => {
    it('parsea el JSON de evaluación limpiando el formato markdown', async () => {
      mockGenerateContent.mockResolvedValue(
        respuestaIA(
          '```json\n{"score":85,"general_feedback":"Bien","strengths":["claridad"],"weaknesses":[],"improvement_tips":["practicar"]}\n```',
        ),
      );

      const result = await service.evaluarEntrevista([
        { sender: 'ai', content: 'Pregunta' },
        { sender: 'user', content: 'Respuesta' },
      ]);

      expect(result.score).toBe(85);
      expect(result.strengths).toContain('claridad');
    });

    it('lanza ServiceUnavailableException si el JSON es inválido', async () => {
      mockGenerateContent.mockResolvedValue(respuestaIA('esto no es json'));
      await expect(
        service.evaluarEntrevista([{ sender: 'user', content: 'x' }]),
      ).rejects.toThrow(ServiceUnavailableException);
    });
  });
});
