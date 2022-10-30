import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateService {

  generatePDF(): Promise<any> {
    return Promise.resolve('PDF Generado');
  }
}
