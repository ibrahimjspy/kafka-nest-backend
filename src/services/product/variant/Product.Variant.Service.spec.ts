import { Test, TestingModule } from '@nestjs/testing';
import { TransformerModule } from 'src/transformer/Transformer.module';
import { TransformerService } from 'src/transformer/Transformer.service';
import { ProductVariantService } from './Product.Variant.Service';

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
    it('service is running', async () => {
      expect(service.healthCheck()).toBeDefined();
    });
  });
});
