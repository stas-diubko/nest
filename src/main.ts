import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import conf from './config/config'
import { ExceptionHandlerFilter } from './common/exception-handler.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.use(morgan('dev'));
  app.use(bodyParser.json({limit: "50mb"}));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(helmet());
  app.useGlobalFilters(new ExceptionHandlerFilter)

  const options = new DocumentBuilder()
  .setTitle('My store')
  .setDescription('The store API f books shop')
  .setVersion('1.0')
  .addBearerAuth('Authorization', 'header', 'apiKey')
  .addTag('store')
  .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(conf.PORT);
  console.log(`Server is leasning on PORT  :  ${conf.PORT}`);

}
bootstrap();
