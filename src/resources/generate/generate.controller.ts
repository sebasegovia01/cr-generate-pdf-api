import { GeneratePdfDto } from '@dtos/generate-pdf.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { GenerateService } from './generate.service';

@Controller('generate')
export class GenerateController {

  constructor(private readonly generateService: GenerateService) { }

  @Post()
  async generate(@Body() body: GeneratePdfDto): Promise<any> {
    console.log(body);
    const response = await await this.generateService.generatePDF();
    return response;
  }
}
