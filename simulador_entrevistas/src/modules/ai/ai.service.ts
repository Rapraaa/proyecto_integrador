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

interface MensajeHistorial {
  sender: string;
  content: string;
  code_snippet?: string;
}

export interface EvaluacionEntrevista {
  score: number;
  general_feedback: string;
  strengths: string[];
  weaknesses: string[];
  improvement_tips: string[];
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

  async continuarEntrevista(historial: MensajeHistorial[]): Promise<string> {
    const conversacion = historial
      .map((m) => {
        const quien = m.sender === 'ai' ? 'Entrevistador' : 'Candidato';
        const codigo = m.code_snippet
          ? `\n[Código enviado]:\n${m.code_snippet}`
          : '';
        return `${quien}: ${m.content}${codigo}`;
      })
      .join('\n');

    const prompt = `Esta es la conversación de la entrevista hasta ahora:
${conversacion}

Basándote en la ÚLTIMA respuesta del candidato, formula la SIGUIENTE pregunta técnica (una sola).
Si la respuesta fue floja, profundiza o repregunta. No des feedback todavía. Devuelve SOLO la pregunta.`;

    try {
      const resultado = await this.model.generateContent(prompt);
      return resultado.response.text().trim();
    } catch (error) {
      console.error('Error al continuar la entrevista', error);
      throw new ServiceUnavailableException(
        'El servicio de inteligencia artificial no está disponible temporalmente. Intente más tarde.',
      );
    }
  }

  async evaluarEntrevista(
    historial: MensajeHistorial[],
  ): Promise<EvaluacionEntrevista> {
    const conversacion = historial
      .map(
        (m) =>
          `${m.sender === 'ai' ? 'Entrevistador' : 'Candidato'}: ${m.content}`,
      )
      .join('\n');

    const prompt = `Evalúa esta entrevista técnica completa y devuelve ÚNICAMENTE un JSON válido,
sin texto adicional ni markdown, con EXACTAMENTE esta forma:
{
  "score": number (de 0 a 100),
  "general_feedback": string,
  "strengths": string[],
  "weaknesses": string[],
  "improvement_tips": string[]
}

Conversación:
${conversacion}`;

    try {
      const resultado = await this.model.generateContent(prompt);
      let texto = resultado.response.text().trim();

      texto = texto
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      return JSON.parse(texto) as EvaluacionEntrevista;
    } catch (error) {
      console.error('Error al evaluar la entrevista', error);
      throw new ServiceUnavailableException(
        'No se pudo generar la evaluación. Intenta más tarde.',
      );
    }
  }
}
