import { Test, TestingModule } from '@nestjs/testing';
import { TransformerService } from 'src/services/transformer/Service';
import { ShopService } from './Service';

describe('Brand Service unit tests', () => {
  let service: ShopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopService, TransformerService],
    }).compile();

    service = module.get<ShopService>(ShopService);
  });
  describe('root', () => {
    it('should return "Service running"', () => {
      expect(service.healthCheck()).toBe('Service running');
    });
  });
});
