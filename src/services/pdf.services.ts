import { Injectable } from '@nestjs/common';
import { writeFileSync, readFileSync } from 'fs';
import { fileSync } from 'tmp';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
import * as dotenv from 'dotenv';
dotenv.config();

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

  async generateEncryptPDF(
    base64Data: string,
    password: string,
  ): Promise<string> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        console.log('password: ', password);
        const pdfBuffer = Buffer.from(base64Data, 'base64');

        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdf-'));
        const tmpInput = fileSync({ postfix: '.pdf', tmpdir: tmpDir });
        console.log('tmpInput: ', tmpInput);
        writeFileSync(tmpInput.name, pdfBuffer);

        //const tmpOutput = fileSync({ postfix: '.pdf' });

        console.log('NODE_ENV: ', process.env.NODE_ENV);

        const officeExecPath =
          process.env.NODE_ENV === 'production'
            ? '/usr/bin/libreoffice'
            : 'cd /Applications/LibreOffice.app/Contents/MacOS/ && ./soffice';

        const cmd = `${officeExecPath} --headless --convert-to 'pdf:writer_pdf_Export:{"EncryptFile":{"type":"boolean","value":"true"},"DocumentOpenPassword":{"type":"string","value":"${password}"}}' --outdir /tmp ${tmpInput.name}`;

        console.log(cmd);
        const { stdout, stderr } = await exec(cmd);
        if (stderr) {
          console.log('ERROR: ', stdout);
          return reject(stderr);
        }
        console.log('SALIDA: ', stdout);
        //const encryptedPdfBuffer = readFileSync(tmpOutput.name);
        // El nombre del archivo encriptado será el mismo que el del archivo de entrada, pero en el directorio /tmp
        const encryptedPdfPath = path.join(
          '/tmp',
          path.basename(tmpInput.name),
        );
        const encryptedPdfBuffer = readFileSync(encryptedPdfPath);

        tmpInput.removeCallback();
        //tmpOutput.removeCallback();

        return resolve(encryptedPdfBuffer.toString('base64'));
      } catch (error) {
        console.log(error);
        return reject(error);
      }
    });
  }
}
