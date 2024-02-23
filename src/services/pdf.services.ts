import { Injectable } from '@nestjs/common';
import { writeFileSync, readFileSync } from 'fs';
import { fileSync } from 'tmp';
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

  async generateEncryptPDF(base64Data: string, password: string): Promise<string> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const pdfBuffer = Buffer.from(base64Data, 'base64');

        const tmpInput = fileSync({ postfix: '.pdf' });
        writeFileSync(tmpInput.name, pdfBuffer);

        const tmpOutput = fileSync({ postfix: '.pdf' });

        const cmd = `libreoffice --headless --convert-to 'pdf:writer_pdf_Export:{"EncryptFile":{"type":"boolean","value":"true"},"DocumentOpenPassword":{"type":"string","value":"${password}"}}' --outdir /tmp ${tmpInput.name}`;
        console.log(cmd);
        const { stdout, stderr } = await exec(cmd);
        if (stderr) {
          return reject(stderr);
        }
        console.log(stdout);
        const encryptedPdfBuffer = readFileSync(tmpOutput.name);

        tmpInput.removeCallback();
        tmpOutput.removeCallback();

        return resolve(encryptedPdfBuffer.toString('base64'));
      } catch (error) {
        console.log(error);
        return reject(error);
      }
    });
  }
}
