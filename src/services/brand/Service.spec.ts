import { Test, TestingModule } from '@nestjs/testing';
import { TransformerService } from 'src/services/transformer/Service';
import { BrandService } from './Service';

describe('Brand Service unit tests', () => {
  let service: BrandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrandService, TransformerService],
    }).compile();

    service = module.get<BrandService>(BrandService);
  });
  describe('root', () => {
    it('should return "Service running"', () => {
      expect(service.healthCheck()).toBe('Service running');
    });
  });
});
