import { Test, TestingModule } from '@nestjs/testing';
import { TransformerModule } from 'src/transformer/Transformer.module';
import { TransformerService } from 'src/transformer/Transformer.service';
import { ProductMediaService } from './Product.Media.Service';

describe('TransformerController', () => {
  let service: ProductMediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductMediaService, TransformerService],
      imports: [TransformerModule],
    }).compile();

    service = module.get<ProductMediaService>(ProductMediaService);
  });
  describe('root', () => {
    it('should return "Service running"', () => {
      expect(service.healthCheck()).toBe('Service running');
    });
  });
});
