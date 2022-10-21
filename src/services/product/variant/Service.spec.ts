import { Test, TestingModule } from '@nestjs/testing';
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
    it('should return "Service running"', () => {
      expect(service.healthCheck()).toBe('Service running');
    });
  });
});
