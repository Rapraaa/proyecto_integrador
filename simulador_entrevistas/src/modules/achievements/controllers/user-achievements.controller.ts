import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RoleOptions } from '../../users/enums/user-roles.enum';
import { UserAchievementsService } from '../services/user-achievements.service';
import { GrantAchievementDto } from '../dto/grant-achievement.dto';

interface RequestConUsuario {
  user: { id: string; email: string; role: string };
}

@ApiTags('Logros de usuario')
@ApiBearerAuth()
@Controller()
@UseGuards(JwtAuthGuard)
export class UserAchievementsController {
  constructor(private readonly service: UserAchievementsService) {}

  @Get('me/achievements')
  @ApiOperation({ summary: 'Listar mis logros obtenidos' })
  misLogros(@Req() req: RequestConUsuario) {
    return this.service.misLogros(req.user.id);
  }

  @Get('user-achievements')
  @UseGuards(RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiOperation({ summary: 'Listar los logros otorgados a todos (solo admin)' })
  listarTodos(@Query() query: PaginationQueryDto) {
    return this.service.listarTodos(query);
  }

  @Post('user-achievements')
  @UseGuards(RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiOperation({ summary: 'Otorgar un logro a un usuario (solo admin)' })
  otorgar(@Body() dto: GrantAchievementDto) {
    return this.service.otorgar(dto);
  }

  @Delete('user-achievements/:id')
  @UseGuards(RolesGuard)
  @Roles(RoleOptions.ADMIN)
  @ApiOperation({ summary: 'Revocar un logro otorgado (solo admin)' })
  revocar(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.revocar(id);
  }
}
