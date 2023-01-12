import { Test, TestingModule } from '@nestjs/testing';
// import { testQuery } from '../test/query';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryService } from './services/category/Category.Service';
import { ProductMediaService } from './services/product/media/Product.Media.Service';
import { ProductService } from './services/product/Product.Service';
import { ProductVariantService } from './services/product/variant/Product.Variant.Service';
import { ShopService } from './services/shop/Shop.Service';
import { TransformerService } from './transformer/Transformer.service';
import { RetailerService } from './services/shop/retailer/Retailer.Service';
import { ShippingService } from './services/shop/shipping/Shipping.Service';
import { UserService } from './services/shop/user/User.Service';
import { RetailerTransformerService } from './transformer/shop/Retailer.transformer';
import { Logger } from '@nestjs/common';
import { TransformerModule } from './transformer/Transformer.module';
import { stringValidation } from './app.utils';
import { shippingMethodValidation } from './services/shop/Shop.utils';
// import { graphqlCall } from './utils/graphql/handler';
// import { productGeneralTransformer } from './transformers/product/general';

describe('AppController', () => {
  let appController: AppController;
  // const testObjectEmpty = {};
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [TransformerModule],
      controllers: [AppController],
      providers: [
        AppService,
        Logger,
        ProductService,
        CategoryService,
        TransformerService,
        ShopService,
        ProductMediaService,
        ProductVariantService,
        ShippingService,
        UserService,
        RetailerService,
        RetailerTransformerService,
      ],
    }).compile();
    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.healthCheck());
    });
  });

  it('string validation test', () => {
    expect(stringValidation('testString')).toBeDefined();
  });

  it('shipping method util validation', () => {
    const data = shippingMethodValidation([], 'default');
    expect(data).toBeDefined();
    expect(data).toStrictEqual(['default']);
  });
});
