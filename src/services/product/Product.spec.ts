/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './Product';
import { TransformerService } from '../transformer/Transformer';
import { fetchProductId, insertProductId } from 'src/postgres/handlers/product';
import { Logger } from '@nestjs/common';
import { insertMasterCategoryId } from 'src/postgres/handlers/category';

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
    //                       < insert tests >
    it('checking whether product id sql connection is working', async () => {
      const data = await insertProductId('30', '7860');
      Logger.log(data);
      expect(data).toBeDefined();
    });
    it('checking whether master category id insert sql connection is working', async () => {
      const data = await insertMasterCategoryId('40', '4');
      expect(data).toBeDefined();
    });
  });
});
