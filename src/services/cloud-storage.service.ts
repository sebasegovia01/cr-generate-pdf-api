import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

const storage = new Storage();

@Injectable()
export class CloudStorageService {

  async downloadFileFrom(bucketName: string, file: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const tmpfilename = `./tmp-pdf/${file}`;
        const options = { destination: tmpfilename };
        await storage.bucket(bucketName).file(file).download(options);
        return resolve(tmpfilename);
      } catch (error) {
        console.log(error);
        return reject(error);
      }
    });
  }
}
