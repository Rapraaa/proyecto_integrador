import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiLog } from './schemas/ai-log.schema';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export interface AiLogEntry {
  user_id?: string;
  interview_id?: string;
  prompt: string;
  response: string;
  model: string;
  tokens?: number;
  latency_ms?: number;
}

@Injectable()
export class AiLogsService {
  private readonly logger = new Logger(AiLogsService.name);

  constructor(
    @InjectModel(AiLog.name)
    private readonly aiLogModel: Model<AiLog>,
  ) {}

  //Nunca lanza: un fallo al loguear no debe tumbar la entrevista en curso.
  async record(entry: AiLogEntry): Promise<void> {
    try {
      await this.aiLogModel.create(entry);
    } catch (error) {
      this.logger.error('No se pudo registrar el log de IA', error);
    }
  }

  async findAll(query: PaginationQueryDto & { user_id?: string }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const filter: Record<string, unknown> = {};
    if (query.user_id) filter.user_id = query.user_id;

    const [data, total] = await Promise.all([
      this.aiLogModel
        .find(filter)
        .sort({ created_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.aiLogModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}
