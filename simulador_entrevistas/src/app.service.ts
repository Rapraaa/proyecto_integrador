import { Injectable } from '@nestjs/common';
//TODO: reemplazar por get health
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getHealth() {
    return {
      status: 'ok',
      service: 'simulador_entrevistas',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
