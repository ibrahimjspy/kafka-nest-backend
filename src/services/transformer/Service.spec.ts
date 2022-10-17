import { Test, TestingModule } from '@nestjs/testing';
import {
  CategoryTransformedMock,
  masterCategoryCDCMock,
  subCategoryCDCMock,
} from 'src/mock/transformer/categories';
import {
  descriptionSmallText,
  productCdcMock,
  productTransformedExpected,
} from 'src/mock/transformer/product';
import { shopCdcMock, shopTransformedMock } from 'src/mock/transformer/shop';
import { masterCategoryTransformerMethod } from './methods/category/master';
import { subCategoryTransformerMethod } from './methods/category/sub';
import {
  descriptionTransformer,
  productGeneralTransformerMethod,
} from './methods/product/general';
import { shopTransformerMethod } from './methods/shop/general';
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
  // methods unit tests
  it('description transform is working ', () => {
    const description = descriptionTransformer('test description');
    expect(description).toBe(descriptionSmallText);
  });

  it('product object builder is working ', async () => {
    const transformedProduct = await productGeneralTransformerMethod(
      productCdcMock,
    );
    console.log(transformedProduct);
    expect(transformedProduct).toStrictEqual(productTransformedExpected);
  });

  it('master category object builder is working ', async () => {
    const transformedMasterCategory = await masterCategoryTransformerMethod(
      masterCategoryCDCMock,
    );
    // console.log(transformedMasterCategory);
    expect(transformedMasterCategory).toBeDefined();
    expect(transformedMasterCategory).toStrictEqual(CategoryTransformedMock);
  });

  it('sub category object builder is working ', async () => {
    const transformedSubCategory = await subCategoryTransformerMethod(
      subCategoryCDCMock,
    );
    // console.log(transformedSubCategory);
    expect(transformedSubCategory).toBeDefined();
    expect(transformedSubCategory).toStrictEqual(CategoryTransformedMock);
  });

  it('shop service builder is working ', async () => {
    const transformedShop = await shopTransformerMethod(shopCdcMock);
    // console.log(transformedShop);
    expect(transformedShop).toBeDefined();
    expect(transformedShop).toStrictEqual(shopTransformedMock);
  });
});
