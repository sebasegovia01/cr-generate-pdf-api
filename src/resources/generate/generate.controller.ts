import { GeneratePdfDto } from '@dtos/generate-pdf.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { Storage } from '@google-cloud/storage';

@Controller('generate')
export class GenerateController {

  constructor(private readonly generateService: GenerateService) { }

  @Post()
  async generate(@Body() body: GeneratePdfDto): Promise<any> {

    console.log(body);

    const storage = new Storage();

    async function listFiles() {
      // Lists files in the bucket
      const [files] = await storage.bucket('nani-food-dev-pdf-templates').getFiles();

      console.log('Files:');
      files.forEach(file => {
        console.log(file.name);
      });
    }
    listFiles().catch(console.error);
    
    const response = await await this.generateService.generatePDF();
    return response;
  }
}
