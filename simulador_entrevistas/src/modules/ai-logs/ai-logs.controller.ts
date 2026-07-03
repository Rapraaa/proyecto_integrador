import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AiLogsService } from './ai-logs.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@ApiTags('Logs de IA')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('ai-logs')
export class AiLogsController {
  constructor(private readonly aiLogsService: AiLogsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar logs de IA con paginación (solo admin)' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.aiLogsService.findAll(query);
  }
}
