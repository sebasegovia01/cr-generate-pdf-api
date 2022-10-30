import { GeneratePdfDto } from '@dtos/generate-pdf.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { Storage } from '@google-cloud/storage';
import Libre from 'libreoffice-convert';
import { LoggingWinston } from '@google-cloud/logging-winston';
import * as winston from 'winston';

// Create logging
const loggingWinston = new LoggingWinston();

// Create a Winston logger that streams to Cloud Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    // Add Cloud Logging
    loggingWinston,
  ],
});

@Controller('generate')
export class GenerateController {

  constructor(private readonly generateService: GenerateService) { }

  @Post()
  async generate(@Body() body: GeneratePdfDto): Promise<any> {

    const { template } = body;
    const bucketName = 'nani-food-dev-pdf-templates';
    const processedBucketName = 'nani-food-dev-pdf-processed';
    const storage = new Storage();
    try {
      const htmlTemplate = await (await storage.bucket(bucketName).file(template).download()).toString();
      logger.info({ step: 'Getting content', content: htmlTemplate });
      const bufferContents = Buffer.from(htmlTemplate);
      logger.info({ step: 'Generate buffer.from', content: bufferContents });
      await Libre.convert(bufferContents, '/tmp-pdf/generate-pdf.pdf', undefined, async (err, data) => {
        logger.info({ step: 'Create PDF', data, err });
        logger.info('PDF Created successfully');
      });
      await storage.bucket(processedBucketName).upload('/tmp-pdf/generate-pdf.pdf');
      logger.info(`PDF Upload successfully to ${processedBucketName}`);
    } catch (error) {
      console.log('Error trying generate pdf');
      console.log(error);
    }

    const response = await await this.generateService.generatePDF();
    return response;
  }

  @Get('list')
  listfiles(): Promise<any> {
    const storage = new Storage();
    const filesList = [];
    async function listFiles() {
      // Lists files in the bucket
      const [files] = await storage.bucket('nani-food-dev-pdf-templates').getFiles();
      files.forEach(file => {
        filesList.push(file.name);
      });
    }
    listFiles().catch(console.error);
    return Promise.resolve(filesList);
  }
}
