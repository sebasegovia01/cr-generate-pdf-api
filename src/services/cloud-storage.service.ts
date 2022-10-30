import { Injectable } from '@nestjs/common';
import { Storage, UploadResponse } from '@google-cloud/storage';

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
        return resolve(file);
      } catch (error) {
        console.log(error);
        return reject(error);
      }
    });
  }

  async uploadFile(bucketName, fileName) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        console.log(`Start upload file ${fileName}`);
        const uploadResult: UploadResponse = await storage.bucket(bucketName).upload(`./tmp-pdf/${fileName}`);
        console.log(`Start making public upload file ${fileName}`);
        await uploadResult[0].makePublic();
        const sgnedURL = await uploadResult[0].publicUrl();
        console.log('File upload successfully', sgnedURL, );
        // await storage.bucket(bucketName).file(fileName).makePublic();
        return resolve(uploadResult);
      } catch (error) {
        console.log(error);
        return reject(error);
      }
    });
  }

  async listBucketFiles(bucketName: string): Promise<string[]> {
    return new Promise<string[]>(async (resolve, reject) => {
      try {
        const storage = new Storage();
        const filesList = [];
        const [files] = await storage.bucket(bucketName).getFiles();
        files.forEach(file => {
          filesList.push(file.name);
        });
        return resolve(filesList);
      } catch (error) {

      }
    });
  }
}
