import { Test, TestingModule } from '@nestjs/testing';
import { TransformerService } from 'src/services/transformer/Service';
import { ProductMediaService } from './Service';

describe('TransformerController', () => {
  let service: ProductMediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductMediaService, TransformerService],
    }).compile();

    service = module.get<ProductMediaService>(ProductMediaService);
  });
  describe('root', () => {
    it('should return "Service running"', () => {
      expect(service.healthCheck()).toBe('Service running');
    });
  });
});
