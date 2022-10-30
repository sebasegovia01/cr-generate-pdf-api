import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

const storage = new Storage();

@Injectable()
export class CloudStorageService {

  async downloadFileFrom(bucketName: string, file: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        console.log('Download file from ' + bucketName + '/' + file);
        const tmpfilename = `./tmp-pdf/${file}`;
        const options = { destination: tmpfilename };
        await storage.bucket(bucketName).file(file).download(options);
        console.log('File download successfully');
        return resolve(tmpfilename);
      } catch (error) {
        console.log(error);
        return reject(error);
      }
    });
  }

  async uploadFile(bucketName, fileName) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        console.log('Start upload file');
        await storage.bucket(bucketName).upload(`${fileName}`);
        console.log('File upload successfully');
        return resolve(true);
      } catch (error) {
        console.log(error);
        return reject(error);
      }
    });
  }
}
