import { GeneratePdfDto } from '@dtos/generate-pdf.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { Storage } from '@google-cloud/storage';
import { PDFService } from '@services/pdf.services';
import { CloudStorageService } from '@services/cloud-storage.service';

// import { LoggingWinston } from '@google-cloud/logging-winston';
// import * as winston from 'winston';

@Controller('generate')
export class GenerateController {

  constructor(
    private readonly generateService: GenerateService,
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

  @Get('test-pdf')
  async test(): Promise<any> {
    const tmpTemplate = await this.cloudStorageService.downloadFileFrom('nani-food-dev-pdf-templates', 'simple-template.html');
    console.log(tmpTemplate);
    const response = await this.pdfService.generatePDF(tmpTemplate);
    console.log(response);
    return Promise.resolve(response);
  }
}
