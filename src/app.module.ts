import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GenerateModule } from './resources/generate/generate.module';

@Module({
  imports: [GenerateModule],
  controllers: [AppController]
})
export class AppModule { }
