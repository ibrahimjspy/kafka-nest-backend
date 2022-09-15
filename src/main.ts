import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  // <!.> connecting to kafka server as a consumer
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'my-kafka-consumer',
        },
      },
    },
  );

  app.listen().then(() => {
    console.log('connected to kafka server');
  });
}
bootstrap();
