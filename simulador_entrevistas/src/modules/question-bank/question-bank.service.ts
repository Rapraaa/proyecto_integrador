import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from './schemas/question.schema';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QueryQuestionDto } from './dto/query-question.dto';

@Injectable()
export class QuestionBankService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<Question>,
  ) {}

  async create(createDto: CreateQuestionDto) {
    return await this.questionModel.create(createDto);
  }

  async findAll(query: QueryQuestionDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const filter: Record<string, unknown> = {};
    if (query.search) {
      filter.enunciado = { $regex: query.search, $options: 'i' };
    }
    if (query.interview_type) filter.interview_type = query.interview_type;
    if (query.technology) filter.technology = query.technology;
    if (query.difficulty) filter.difficulty = query.difficulty;

    const sortField = query.sort ?? 'created_at';
    const sortOrder = query.order?.toUpperCase() === 'DESC' ? -1 : 1;

    const [data, total] = await Promise.all([
      this.questionModel
        .find(filter)
        .sort({ [sortField]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.questionModel.countDocuments(filter).exec(),
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

  async findOne(id: string) {
    const question = await this.questionModel.findById(id).exec();
    if (!question) {
      throw new NotFoundException(`Pregunta con ID ${id} no encontrada`);
    }
    return question;
  }

  async update(id: string, updateDto: UpdateQuestionDto) {
    const question = await this.questionModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!question) {
      throw new NotFoundException(`Pregunta con ID ${id} no encontrada`);
    }
    return question;
  }

  async remove(id: string) {
    const question = await this.questionModel.findByIdAndDelete(id).exec();
    if (!question) {
      throw new NotFoundException(`Pregunta con ID ${id} no encontrada`);
    }
    return question;
  }
}
