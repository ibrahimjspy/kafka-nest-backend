import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import {
  KAFKA_BROKER_ENDPOINT,
  KAFKA_CONSUMER_GROUP,
  SERVER_PORT,
} from '../common.env';
import packageInfo from '../package.json';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './app.filters';
import { ApplicationLogger } from './logger/Logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(new ApplicationLogger());
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [KAFKA_BROKER_ENDPOINT],
      },

      consumer: {
        // sessionTimeout: 200007,

        groupId: KAFKA_CONSUMER_GROUP || 'my-kafka-consumer3',
      },
    },
  });
  app.startAllMicroservices();
  // swagger configuration
  const config = new DocumentBuilder()
    .setTitle(packageInfo.name)
    .setDescription(packageInfo.description)
    .setVersion(packageInfo.version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // add exception filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // enable auto validation
  app.useGlobalPipes(new ValidationPipe());
  app
    .listen(SERVER_PORT || 6003)
    .then(() => {
      Logger.verbose('kafka client connected');
    })
    .catch((err) => {
      Logger.error(err);
    });
}
bootstrap();
