import { Test, TestingModule } from '@nestjs/testing';
import { TransformerService } from './Service';

describe('TransformerController', () => {
  let service: TransformerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransformerService],
    }).compile();

    service = module.get<TransformerService>(TransformerService);
  });
  describe('root', () => {
    it('should return "Service running"', () => {
      expect(service.healthCheck()).toBe('Service running');
    });
  });
});
