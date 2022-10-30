import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FoodModule } from './resources/food/food.module';
import { GenerateModule } from './resources/generate/generate.module';

@Module({
  imports: [FoodModule, GenerateModule],
  controllers: [AppController]
})
export class AppModule { }
