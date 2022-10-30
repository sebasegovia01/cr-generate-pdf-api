import { Injectable } from '@nestjs/common';
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

@Injectable()
export class PDFService {

  async generatePDF(fileName: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const cmd = `libreoffice --headless --convert-to pdf --outdir ./tmp-pdf ./tmp-pdf/${fileName}`;
        console.log(cmd);
        const { stdout, stderr } = await exec(cmd);
        if (stderr) {
          return reject(stderr);
        }
        console.log(stdout);
        const pdfFileName = fileName.replace(/\.\w+$/, '.pdf');
        return resolve(pdfFileName);
      } catch (error) {
        console.log(error);
        return reject(error);
      }
    });
  }

  async deleteGeneratedTempPdf(tmppdf: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const cmd = `rm -rf ${tmppdf}`;
        console.log(cmd);
        const { stdout, stderr } = await exec(cmd);
        if (stderr) {
          console.log(stderr);
          return reject(false);
        }
        console.log(stdout);
        return resolve(true);
      } catch (error) {
        console.log(error);
        return reject(false);
      }
    });
  }
}
