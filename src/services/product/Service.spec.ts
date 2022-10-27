/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './Service';
import { TransformerService } from '../../transformer/Transformer.service';
import {
  deleteProductId,
  fetchProductId,
  insertProductId,
} from 'src/postgres/handlers/product';
import { Logger } from '@nestjs/common';
import { insertMasterCategoryId } from 'src/postgres/handlers/category';
import { TransformerModule } from 'src/transformer/Transformer.module';
import { ProductMediaService } from './media/Service';

describe('product variant unit tests', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, TransformerService, ProductMediaService],
      imports: [TransformerModule],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });
  describe('root', () => {
    it('should return "Service running"', () => {
      expect(service.healthCheck()).toBe('Service running');
    });
  });
});
