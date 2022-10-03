import { Test, TestingModule } from '@nestjs/testing';
import { testQuery } from '../test/query';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { ProductService } from './services/Product';
import { ProductTransformer } from './streams/ProductTransformer';
import { brandGeneralTransformer } from './transformers/brand';
import { productGeneralTransformer } from './transformers/productGeneral';
import { graphqlCall } from './utils/graphqlHandler';
import { kafkaMessageCheck } from './utils/kafkaMessageNature';

describe('AppController', () => {
  let appController: AppController;
  const testObjectEmpty = {};
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [KafkaModule],
      controllers: [AppController],
      providers: [AppService, ProductService, ProductTransformer],
    }).compile();
    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.healthCheck());
    });
  });
  it('should return update based on kafka message nature', () => {
    const testObject = { op: 'u' };
    expect(kafkaMessageCheck(testObject)).toBe('update');
  });
  it('checks whether transformation of general product work properly', async () => {
    expect(await productGeneralTransformer(testObjectEmpty)).not.toBe({
      description:
        '{"time": 1662995227870, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "test product}"}, "type": "paragraph"}], "version": "2.24.3"}',
      name: 'test_product',
    });
  });
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
