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
import { TransformerService } from './Transformer.service';
import { mediaMock, mockMediaTransformed } from 'src/mock/product/media';
import { mockColor, mockSize } from 'src/mock/product/variant';
import { ProductTransformerService } from './product/Product.transformer';
import { TransformerModule } from './Transformer.module';

describe('TransformerController', () => {
  let service: TransformerService;
  let productService: ProductTransformerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransformerService],
      imports: [TransformerModule],
    }).compile();

    service = module.get<TransformerService>(TransformerService);
    productService = module.get<ProductTransformerService>(
      ProductTransformerService,
    );
  });
  describe('root', () => {
    it('should return "Service running"', () => {
      expect(service.healthCheck()).toBe('Service running');
    });
  });
  // methods unit tests
  it('description transform is working ', () => {
    const description =
      productService.descriptionTransformer('test description');
    expect(description).not.toBe(descriptionSmallText);
  });

  it('product object builder is working ', async () => {
    const transformedProduct = await service.productDetailsTransformer(
      productCdcMock,
    );
    expect(transformedProduct).toStrictEqual(productTransformedExpected);
  });

  it('master category object builder is working ', async () => {
    const transformedMasterCategory = await service.masterCategoryTransformer(
      masterCategoryCDCMock,
    );
    expect(transformedMasterCategory).toBeDefined();
    expect(transformedMasterCategory).toStrictEqual(CategoryTransformedMock);
  });

  it('sub category object builder is working ', async () => {
    const transformedSubCategory = await service.subCategoryTransformer(
      subCategoryCDCMock,
    );
    expect(transformedSubCategory).toBeDefined();
    expect(transformedSubCategory).toStrictEqual(CategoryTransformedMock);
  });

  it('shop service builder is working ', async () => {
    const transformedShop = await service.shopTransformer(shopCdcMock);
    expect(transformedShop).toBeDefined();
    expect(transformedShop).toStrictEqual(shopTransformedMock);
  });

  it('media array builder is working ', async () => {
    const transformedMedia = await service.productMediaTransformer(mediaMock);
    expect(transformedMedia).toBeDefined();
    expect(transformedMedia).toStrictEqual(mockMediaTransformed);
  });

  it('color variant array builder is working ', async () => {
    const transformedColorInformation = await service.productVariantTransformer(
      mockColor[0].name,
      mockSize.size,
    );
    expect(transformedColorInformation).toBeDefined();
    expect(transformedColorInformation).not.toStrictEqual([
      { color: 'BLACK', size: 'ONE' },
    ]);
  });
});
