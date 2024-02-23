import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '50mb' })); // for JSON request
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // for URL-encoded request

  await app.listen(parseInt(process.env.PORT) || 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
