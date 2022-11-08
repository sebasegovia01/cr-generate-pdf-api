import { GeneratePdfDto } from '@dtos/generate-pdf.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { PDFService } from '@services/pdf.services';
import { CloudStorageService } from '@services/cloud-storage.service';

@Controller('generate')
export class GenerateController {

  constructor(
    private pdfService: PDFService,
    private cloudStorageService: CloudStorageService) { }

  @Post()
  async generate(@Body() body: GeneratePdfDto): Promise<any> {

    const { template } = body;
    const bucketName = 'nani-food-dev-pdf-templates';
    const processedBucketName = 'nani-food-dev-pdf-processed';
    try {
      const tmpTemplate = await this.cloudStorageService.downloadFileFrom(bucketName, template);
      const tmpPdf = await this.pdfService.generatePDF(tmpTemplate);
      const uploadResult = await this.cloudStorageService.uploadFile(processedBucketName, tmpPdf);
      console.log(uploadResult);
      console.info(`PDF Upload successfully to ${processedBucketName}`, uploadResult);
    } catch (error) {
      console.log('Error trying generate pdf');
      console.log(error);
    }

    return 'done';
  }

  @Get('list')
  async listfiles(@Body('template') bucketName: string): Promise<any> {
    const filesList = await this.cloudStorageService.listBucketFiles(bucketName);
    return Promise.resolve(filesList);
  }
}
