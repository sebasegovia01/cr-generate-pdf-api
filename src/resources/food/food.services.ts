import { Injectable } from '@nestjs/common';
import { FoodDto } from './food.dto';

@Injectable()
export class FoodService {
  private readonly foods: FoodDto[] = [];

  create(food: FoodDto): Promise<boolean> {
    this.foods.push(food);
    return Promise.resolve(true);
  }

  findAll(): Promise<FoodDto[]> {
    return Promise.resolve(this.foods);
  }
}