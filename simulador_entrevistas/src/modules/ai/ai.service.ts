import {
  Injectable,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

interface ContextoEntrevista {
  rol: string;
  nivel: string;
  tecnologias: string[];
}

@Injectable()
export class AiService implements OnModuleInit {
  private ai: GoogleGenerativeAI;
  private model: GenerativeModel;

  onModuleInit() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('Error: API key no configurada');
    }

    this.ai = new GoogleGenerativeAI(apiKey);
    this.model = this.ai.getGenerativeModel({
      model: 'gemini-2.5-flash',
      //TODO: mejorar systeminstruction
      systemInstruction: `Actúa como un reclutador técnico y entrevistador de software senior ultra riguroso.
            Tu objetivo es evaluar candidatos simulando una entrevista técnica real.
            Harás preguntas precisas, evaluarás las respuestas y no harás comentarios amigables innecesarios.
            Ve directo al grano, mantén un tono profesional y desafiante.`,
    });
  }

  async iniciarEntrevista(datos: ContextoEntrevista): Promise<string> {
    const { rol, nivel, tecnologias } = datos;

    const userPrompt = `Hola. Postulo al puesto de ${rol} (Nivel: ${nivel}).
        Mi stack tecnológico principal incluye: ${tecnologias.join(', ')}.
        Por favor, genera la primera pregunta técnica conceptual para iniciar la entrevista.
        No saludes, genera directamente la pregunta.`;

    try {
      const resultado = await this.model.generateContent(userPrompt);
      const respuestaIA = resultado.response.text();

      return respuestaIA.trim();
    } catch (error) {
      console.error('Error al comunicarse con el provedor de IA', error);
      //TODO: poner mas errores.
      throw new ServiceUnavailableException(
        'El servicio de inteligencia artificial no está disponible temporalmente. Intente más tarde.',
      );
    }
  }
}
