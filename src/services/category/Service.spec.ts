import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './Service';
import { TransformerService } from '../transformer/Service';
// import {
//   fetchMasterCategoryId,
//   fetchSubCategoryId,
// } from 'src/postgres/handlers/category';

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
    //                       < fetch tests >
    // it('checking whether Master category id sql connection is working', async () => {
    //   const data = await fetchMasterCategoryId('3');
    //   expect(data).not.toBeDefined();
    // });

    // it('checking whether Sub category id sql connection is working', async () => {
    //   const data = await fetchSubCategoryId('3');
    //   expect(data).not.toBeDefined();
    // });
    //                       < insert tests >
    // it('checking whether insert in master id sql connection is working', async () => {
    //   const data = await insertMasterCategoryId('3', '4');
    //   expect(data).toBeDefined();
    // });

    // it('checking whether insert in sub id sql connection is working', async () => {
    //   const data = await insertSubCategoryId('5', '590');
    //   expect(data).toBeDefined();
    // });
    //                       < delete tests >
    // it('checking if master category id delete is working', async () => {
    //   const testId = 3;
    //   const data = await deleteMasterCategoryId(testId);
    //   expect(data).toBeDefined();
    // });

    // it('checking if master category id delete is working', async () => {
    //   const testId = 7;
    //   const data = await deleteSubCategoryId(testId);
    //   expect(data).toBeDefined();
    // });
  });
});
