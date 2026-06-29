import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestConUsuario {
  user: { id: string; email: string; role: string };
}

@ApiTags('interviews')
@ApiBearerAuth()
@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear/iniciar una entrevista' })
  crear(@Req() req: RequestConUsuario, @Body() dto: CreateInterviewDto) {
    return this.interviewsService.crear(req.user.id, dto);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Responder y recibir la siguiente pregunta' })
  enviarMensaje(
    @Req() req: RequestConUsuario,
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.interviewsService.enviarMensaje(req.user.id, id, dto);
  }

  @Post(':id/finish')
  @ApiOperation({ summary: 'Finalizar y generar el reporte' })
  finalizar(@Req() req: RequestConUsuario, @Param('id') id: string) {
    return this.interviewsService.finalizar(req.user.id, id);
  }

  @Get()
  @ApiOperation({ summary: 'Historial de entrevistas del usuario' })
  historial(@Req() req: RequestConUsuario) {
    return this.interviewsService.historial(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de una entrevista' })
  obtenerUna(@Req() req: RequestConUsuario, @Param('id') id: string) {
    return this.interviewsService.obtenerUna(req.user.id, id);
  }
}
