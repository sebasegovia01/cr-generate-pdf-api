import { Module } from '@nestjs/common';
import { FoodController } from './food.controller';
import { FoodService } from './food.services';

@Module({
  imports: [],
  controllers: [FoodController],
  providers: [FoodService],
})
export class FoodModule { }
