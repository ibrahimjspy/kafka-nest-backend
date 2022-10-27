import { Test, TestingModule } from '@nestjs/testing';
import { TransformerModule } from 'src/transformer/Transformer.module';
import { TransformerService } from 'src/transformer/Transformer.service';
import { ShopService } from './Shop.Service';

describe('Brand Service unit tests', () => {
  let service: ShopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopService, TransformerService],
      imports: [TransformerModule],
    }).compile();

    service = module.get<ShopService>(ShopService);
  });
  describe('root', () => {
    it('should return "Service running"', () => {
      expect(service.healthCheck()).toBe('Service running');
    });
  });
});
