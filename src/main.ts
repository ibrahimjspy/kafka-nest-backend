import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';
// import client from './postgres/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER],
        },

        consumer: {
          // sessionTimeout: 200007,

          groupId: process.env.KAFKA_CONSUMER_GROUP || 'my-kafka-consumer2',
        },
      },
    },
  );
  // <!.> connecting to kafka server as a consumer
  app
    .listen()
    .then(() => {
      Logger.verbose('kafka client connected');
    })
    .catch((err) => {
      Logger.error(err);
    });
}
bootstrap();
