import { Injectable } from '@nestjs/common';
//TODO: reemplazar por get health
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
