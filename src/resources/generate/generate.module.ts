import { Module } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { GenerateController } from './generate.controller';
import { PDFService } from '@services/pdf.services';
import { CloudStorageService } from '@services/cloud-storage.service';

@Module({
  controllers: [GenerateController],
  providers: [GenerateService, PDFService, CloudStorageService]
})
export class GenerateModule {}
