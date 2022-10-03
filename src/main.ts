import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        // consumer: {
        //   groupId: 'my-kafka-consumer',
        // },
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
