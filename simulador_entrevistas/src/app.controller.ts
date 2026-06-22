import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener estado de salud' })
  @ApiResponse({
    status: 200,
    description: 'El servidor está en línea y funcionando correctamente.',
    schema: {
      example: {
        status: 'ok',
        service: 'simulador-entrevistas-api',
        timestamp: '2026-06-22T16:05:36.000Z',
        uptime: 14.5,
      },
    },
  })
  getHealth() {
    return this.appService.getHealth();
  }
}
