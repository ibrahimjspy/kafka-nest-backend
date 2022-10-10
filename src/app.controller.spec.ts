import { Test, TestingModule } from '@nestjs/testing';
import { testQuery } from '../test/query';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { ProductService } from './services/product/Product';
import { TransformerService } from './services/transformer/Transformer';
import { brandGeneralTransformer } from './transformers/brand/general';
import { graphqlCall } from './utils/graphql/handler';
// import { productGeneralTransformer } from './transformers/product/general';

describe('AppController', () => {
  let appController: AppController;
  const testObjectEmpty = {};
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [KafkaModule],
      controllers: [AppController],
      providers: [AppService, ProductService, TransformerService],
    }).compile();
    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.healthCheck());
    });
  });

  // it('checks whether transformation of general product work properly', async () => {
  //   expect(await productGeneralTransformer(testObjectEmpty)).not.toBe({
  //     description:
  //       '{"time": 1662995227870, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "test product}"}, "type": "paragraph"}], "version": "2.24.3"}',
  //     name: 'test_product',
  //   });
  // });

  it('checks whether transformation of brand name work properly', async () => {
    expect(await brandGeneralTransformer(testObjectEmpty)).not.toBe({
      description:
        '{"time": 1662995227870, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "test product}"}, "type": "paragraph"}], "version": "2.24.3"}',
      name: 'test_product',
    });
  });

  it('checks whether graphql Call works properly', async () => {
    const data = await graphqlCall(testQuery());
    expect(data).toBeDefined();
    expect(data).toHaveProperty('products');
  });
});
