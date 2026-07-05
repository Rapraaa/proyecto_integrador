import { ServiceUnavailableException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AiService } from './ai.service';

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn(),
}));

describe('AiService', () => {
  let service: AiService;
  let mockModel: { generateContent: jest.Mock };
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    service = new AiService();
    mockModel = {
      generateContent: jest.fn(),
    };

    (service as any).model = mockModel;
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit()', () => {
    it('should initialize the AI client and model when the API key exists', () => {
      const mockGetGenerativeModel = jest.fn().mockReturnValue(mockModel);
      const mockAiClient = { getGenerativeModel: mockGetGenerativeModel };
      (GoogleGenerativeAI as jest.Mock).mockImplementation(() => mockAiClient);
      process.env.GEMINI_API_KEY = 'test-key';

      service.onModuleInit();

      expect(GoogleGenerativeAI).toHaveBeenCalledWith('test-key');
      expect(mockGetGenerativeModel).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'gemini-2.5-flash' }),
      );
      expect((service as any).ai).toBe(mockAiClient);
      expect((service as any).model).toBe(mockModel);
    });

    it('should throw when the API key is missing', () => {
      delete process.env.GEMINI_API_KEY;

      expect(() => service.onModuleInit()).toThrow('Error: API key no configurada');
    });
  });

  describe('iniciarEntrevista()', () => {
    it('should return the first interview question text', async () => {
      mockModel.generateContent.mockResolvedValue({
        response: {
          text: () => '   ¿Cuál es la diferencia entre null y undefined?   ',
        },
      });

      const result = await service.iniciarEntrevista({
        rol: 'backend',
        nivel: 'junior',
        tecnologias: ['nodejs', 'nestjs'],
      });

      expect(mockModel.generateContent).toHaveBeenCalledWith(
        expect.stringContaining('backend'),
      );
      expect(mockModel.generateContent).toHaveBeenCalledWith(
        expect.stringContaining('nestjs'),
      );
      expect(result).toBe('¿Cuál es la diferencia entre null y undefined?');
    });

    it('should throw ServiceUnavailableException when the AI provider fails', async () => {
      mockModel.generateContent.mockRejectedValue(new Error('timeout'));

      await expect(
        service.iniciarEntrevista({
          rol: 'frontend',
          nivel: 'mid',
          tecnologias: ['react'],
        }),
      ).rejects.toThrow(ServiceUnavailableException);
    });
  });

  describe('continuarEntrevista()', () => {
    it('should return the next interview question based on history', async () => {
      mockModel.generateContent.mockResolvedValue({
        response: {
          text: () => '   ¿Puedes explicar cómo funciona el event loop en JavaScript?   ',
        },
      });

      const historial = [
        { sender: 'ai', content: '¿Qué es un closure?' },
        { sender: 'candidate', content: 'Una función con acceso a su scope.' },
      ];

      const result = await service.continuarEntrevista(historial as any);

      expect(mockModel.generateContent).toHaveBeenCalled();
      expect(result).toBe('¿Puedes explicar cómo funciona el event loop en JavaScript?');
    });

    it('should throw ServiceUnavailableException when continuation fails', async () => {
      mockModel.generateContent.mockRejectedValue(new Error('fail'));

      await expect(
        service.continuarEntrevista([{ sender: 'ai', content: 'Pregunta' }] as any),
      ).rejects.toThrow(ServiceUnavailableException);
    });
  });

  describe('evaluarEntrevista()', () => {
    it('should parse valid JSON evaluation from AI response', async () => {
      mockModel.generateContent.mockResolvedValue({
        response: {
          text: () => '{"score":85,"general_feedback":"Buen desempeño.","strengths":["Comunica bien"],"weaknesses":["Más profundidad"],"improvement_tips":["Estudia callbacks"]}',
        },
      });

      const historial = [
        { sender: 'ai', content: 'Pregunta técnica' },
        { sender: 'candidate', content: 'Respuesta' },
      ];

      const result = await service.evaluarEntrevista(historial as any);

      expect(result).toEqual({
        score: 85,
        general_feedback: 'Buen desempeño.',
        strengths: ['Comunica bien'],
        weaknesses: ['Más profundidad'],
        improvement_tips: ['Estudia callbacks'],
      });
    });

    it('should strip markdown fences and parse JSON evaluation', async () => {
      mockModel.generateContent.mockResolvedValue({
        response: {
          text: () => '```json\n{"score":90,"general_feedback":"Excelente.","strengths":["Claridad"],"weaknesses":["Velocidad"],"improvement_tips":["Practica más"]}\n```',
        },
      });

      const result = await service.evaluarEntrevista([
        { sender: 'candidate', content: 'Mi respuesta' },
      ] as any);

      expect(result.score).toBe(90);
      expect(result.strengths).toEqual(['Claridad']);
    });

    it('should throw ServiceUnavailableException when evaluation JSON is invalid', async () => {
      mockModel.generateContent.mockResolvedValue({
        response: {
          text: () => 'respuesta no válida',
        },
      });

      await expect(
        service.evaluarEntrevista([{ sender: 'candidate', content: 'Hola' }] as any),
      ).rejects.toThrow(ServiceUnavailableException);
    });

    it('should throw ServiceUnavailableException when evaluation fails', async () => {
      mockModel.generateContent.mockRejectedValue(new Error('bad request'));

      await expect(
        service.evaluarEntrevista([{ sender: 'candidate', content: 'Hola' }] as any),
      ).rejects.toThrow(ServiceUnavailableException);
    });
  });
});
