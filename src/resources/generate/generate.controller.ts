import { GeneratePdfDto } from '@dtos/generate-pdf.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { PDFService } from '@services/pdf.services';
import { CloudStorageService } from '@services/cloud-storage.service';
import { GenerateEncryptPdfDto } from '@dtos/generate-encrypt-pdf.dto';

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

  @Post('encrypt-pdf')
  async generateEncryptPDF(@Body() body: GenerateEncryptPdfDto): Promise<string> {
    const { content, password } = body;
    try {
      const encryptPdf = await this.pdfService.generateEncryptPDF(content, password);
      console.log(encryptPdf);
      console.info('PDF Encrypted successfully');
      return encryptPdf;
    } catch (error) {
      console.log('Error encrypting PDF');
      console.log(error);
      throw error;
    }
  }
}
