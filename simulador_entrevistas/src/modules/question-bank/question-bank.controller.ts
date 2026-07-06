import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { QuestionBankService } from './question-bank.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QueryQuestionDto } from './dto/query-question.dto';

@ApiTags('Banco de preguntas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('question-bank')
export class QuestionBankController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  @Get()
  @ApiOperation({ summary: 'Listar preguntas con filtros y paginación' })
  findAll(@Query() query: QueryQuestionDto) {
    return this.questionBankService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una pregunta por ID' })
  findOne(@Param('id') id: string) {
    return this.questionBankService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Crear una pregunta (solo admin)' })
  create(@Body() createDto: CreateQuestionDto) {
    return this.questionBankService.create(createDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar una pregunta (solo admin)' })
  update(@Param('id') id: string, @Body() updateDto: UpdateQuestionDto) {
    return this.questionBankService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar una pregunta (solo admin)' })
  remove(@Param('id') id: string) {
    return this.questionBankService.remove(id);
  }
}
