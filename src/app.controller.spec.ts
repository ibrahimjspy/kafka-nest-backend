import { Test, TestingModule } from '@nestjs/testing';
// import { testQuery } from '../test/query';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { CategoryService } from './services/category/Service';
import { ProductMediaService } from './services/product/media/Service';
import { ProductService } from './services/product/Service';
import { ProductVariantService } from './services/product/variant/Service';
import { ShopService } from './services/shop/Service';
import { TransformerModule } from './transformer/Transformer.module';
import { TransformerService } from './transformer/Transformer.service';
// import { graphqlCall } from './utils/graphql/handler';
// import { productGeneralTransformer } from './transformers/product/general';

describe('AppController', () => {
  let appController: AppController;
  // const testObjectEmpty = {};
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [KafkaModule, TransformerModule],
      controllers: [AppController],
      providers: [
        AppService,
        ProductService,
        TransformerService,
        CategoryService,
        ShopService,
        ProductVariantService,
        ProductMediaService,
      ],
    }).compile();
    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.healthCheck());
    });
  });
});
