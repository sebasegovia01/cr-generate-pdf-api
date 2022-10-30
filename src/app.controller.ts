import { Controller, Get, Req } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  getHello(): string {
    return 'Its Alive.';
  }
}
