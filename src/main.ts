import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';
// import client from './postgres/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER],
      },

      consumer: {
        // sessionTimeout: 200007,

        groupId: process.env.KAFKA_CONSUMER_GROUP || 'my-kafka-consumer3',
      },
    },
  });
  await app.startAllMicroservices();
  app
    .listen(process.env.SERVER_PORT || 6003)
    .then(() => {
      Logger.verbose('kafka client connected');
    })
    .catch((err) => {
      Logger.error(err);
    });
}
bootstrap();
