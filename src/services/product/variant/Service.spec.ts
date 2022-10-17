import { Test, TestingModule } from '@nestjs/testing';
import { TransformerService } from 'src/services/transformer/Service';
import { ProductVariantService } from './Service';

describe('TransformerController', () => {
  let service: ProductVariantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductVariantService, TransformerService],
    }).compile();

    service = module.get<ProductVariantService>(ProductVariantService);
  });
  describe('root', () => {
    it('should return "Service running"', () => {
      expect(service.healthCheck()).toBe('Service running');
    });
  });
});
