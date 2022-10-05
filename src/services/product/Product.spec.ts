import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './Product';
import { TransformerService } from '../transformer/Transformer';
import { fetchProductId } from 'src/postgres/handlers/product';
import { Logger } from '@nestjs/common';

describe('TransformerController', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, TransformerService],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });
  describe('root', () => {
    it('should return "Service running"', () => {
      expect(service.healthCheck()).toBe('Service running');
    });
    it('checking whether product id sql connection is working', async () => {
      const data = await fetchProductId('3');
      Logger.log(data);
      expect(data).toBeDefined();
    });
  });
});
