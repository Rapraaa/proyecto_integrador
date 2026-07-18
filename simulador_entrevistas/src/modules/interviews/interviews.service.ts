import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Interview, InterviewDocument } from './schemas/interview.schema';
import { AiService } from '../ai/ai.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectModel(Interview.name)
    private readonly interviewModel: Model<InterviewDocument>,
    private readonly aiService: AiService,
  ) {}

  async crear(userId: string, dto: CreateInterviewDto) {
    const primeraPregunta = await this.aiService.iniciarEntrevista({
      rol: dto.target_role,
      nivel: dto.seniority,
      tecnologias: dto.technologies,
    });

    const nueva = new this.interviewModel({
      user_id: userId,
      config: dto,
      status: 'in_progress',
      chat_history: [{ sequence: 1, sender: 'ai', content: primeraPregunta }],
    });

    return nueva.save();
  }

  // El usuario responde -> guardamos su respuesta -> la IA repregunta
  async enviarMensaje(userId: string, id: string, dto: SendMessageDto) {
    const interview = await this.buscarPropia(userId, id);

    if (interview.status === 'completed') {
      throw new BadRequestException('Esta entrevista ya finalizó.');
    }

    const seqUsuario = interview.chat_history.length + 1;
    interview.chat_history.push({
      sequence: seqUsuario,
      sender: 'user',
      content: dto.content,
      code_snippet: dto.code_snippet,
    } as never);

    const siguiente = await this.aiService.continuarEntrevista(
      interview.chat_history,
    );

    interview.chat_history.push({
      sequence: seqUsuario + 1,
      sender: 'ai',
      content: siguiente,
    } as never);

    return interview.save();
  }

  // Finaliza la entrevista y genera el reporte con la IA
  async finalizar(userId: string, id: string) {
    const interview = await this.buscarPropia(userId, id);

    if (interview.status === 'completed') {
      throw new BadRequestException('Esta entrevista ya fue evaluada.');
    }

    interview.evaluation = await this.aiService.evaluarEntrevista(
      interview.chat_history,
    );
    interview.status = 'completed';
    return interview.save();
  }

  // Historial del usuario (dashboard)
  async historial(userId: string) {
    return this.interviewModel
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .exec();
  }

  async obtenerUna(userId: string, id: string) {
    return this.buscarPropia(userId, id);
  }

  // Busca la entrevista Y verifica que pertenezca al usuario logueado
  private async buscarPropia(userId: string, id: string) {
    const interview = await this.interviewModel.findById(id).exec();
    if (!interview) {
      throw new NotFoundException('Entrevista no encontrada.');
    }
    if (interview.user_id !== userId) {
      throw new ForbiddenException('Esta entrevista no te pertenece.');
    }
    return interview;
  }
}
