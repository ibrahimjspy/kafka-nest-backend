import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './Service';
import { TransformerService } from '../../transformer/Transformer.service';
import { TransformerModule } from 'src/transformer/Transformer.module';
// import {
//   fetchMasterCategoryId,
//   fetchSubCategoryId,
// } from 'src/postgres/handlers/category';

describe('CategoriesController', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService, TransformerService],
      imports: [TransformerModule],
    }).compile();
    service = module.get<CategoryService>(CategoryService);
  });
  describe('root', () => {
    it('should return "Service running"', () => {
      expect(service.healthCheck()).toBe('Service running');
    });
  });
});
