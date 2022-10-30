import { Test, TestingModule } from '@nestjs/testing';
import { FoodController } from '../../resources/food/food.controller';
import { FoodService } from './food.services';

describe('FoodController', () => {

  let controller: FoodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodController],
      providers: [FoodService],
    }).compile();

    controller = module.get<FoodController>(FoodController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(controller.createFood).toBeTruthy();
    });
  });
});
