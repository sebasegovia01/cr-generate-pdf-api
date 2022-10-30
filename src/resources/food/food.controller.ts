import { Body, Controller, Get, Post } from '@nestjs/common';
import { FoodService } from './food.services';
import { FoodDto } from './food.dto';

@Controller('food')
export class FoodController {

  constructor(private foodSrvc: FoodService) { }

  @Post()
  async createFood(@Body() body: FoodDto) {
    const response = await this.foodSrvc.create(body);
    return response;
  }

  @Get()
  async findAll(): Promise<any[]> {
    const response = await this.foodSrvc.findAll();
    return response;
  }
}
