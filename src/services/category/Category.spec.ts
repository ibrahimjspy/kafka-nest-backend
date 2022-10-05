import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './Category';
import { TransformerService } from '../transformer/Transformer';
import {
  fetchMasterCategoryId,
  fetchSubCategoryId,
} from 'src/postgres/handlers/category';

describe('CategoriesController', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService, TransformerService],
    }).compile();
    service = module.get<CategoryService>(CategoryService);
  });
  describe('root', () => {
    it('should return "Service running"', () => {
      expect(service.healthCheck()).toBe('Service running');
    });
    it('checking whether Master category id sql connection is working', async () => {
      const data = await fetchMasterCategoryId('3');
      expect(data).toBeDefined();
    });
    it('checking whether Sub category id sql connection is working', async () => {
      const data = await fetchSubCategoryId('3');
      expect(data).toBeDefined();
    });
  });
});
