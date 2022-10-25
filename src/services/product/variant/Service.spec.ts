import { Test, TestingModule } from '@nestjs/testing';
import { getProductObject } from '../../../productAxiosCall';
import { TransformerModule } from 'src/transformer/Transformer.module';
import { TransformerService } from 'src/transformer/Transformer.service';
import { ProductVariantService } from './Service';

describe('TransformerController', () => {
  let service: ProductVariantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductVariantService, TransformerService],
      imports: [TransformerModule],
    }).compile();

    service = module.get<ProductVariantService>(ProductVariantService);
  });
  describe('root', () => {
    it('productDetails call is working', async () => {
      const data = await getProductObject(
        '91628651',
        'ethnic-print-brim-panama-hat',
        'urbanista',
      );
      expect(data).toThrowError();
    });
    it('service is running', async () => {
      expect(service.healthCheck()).toBeDefined();
    });
  });
});
