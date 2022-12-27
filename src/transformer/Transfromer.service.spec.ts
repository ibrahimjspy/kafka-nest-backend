import { Test, TestingModule } from '@nestjs/testing';
import {
  CategoryTransformedMock,
  masterCategoryCDCMock,
  subCategoryCDCMock,
  subCategoryExpected,
} from '../../mock/transformer/categories';
import {
  descriptionSmallText,
  productCdcMock,
  productTransformedExpected,
} from '../../mock/transformer/product';
import { shopCdcMock, shopTransformedMock } from '../../mock/transformer/shop';
import { TransformerService } from './Transformer.service';
import { mediaMock, mockMediaTransformed } from '../../mock/product/media';
import { ProductTransformerService } from './product/Product.transformer';
import { TransformerModule } from './Transformer.module';
import { RetailerTransformerService } from './shop/Retailer.transformer';

describe('TransformerController', () => {
  let service: TransformerService;
  let productService: ProductTransformerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransformerService, RetailerTransformerService],
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
    expect(description).toBe(descriptionSmallText);
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
  });

  it('sub category object builder is working ', async () => {
    const transformedSubCategory = await service.subCategoryTransformer(
      subCategoryCDCMock,
    );
    expect(transformedSubCategory).toBeDefined();
    expect(transformedSubCategory).toStrictEqual(subCategoryExpected);
  });

  it('shop service builder is working ', async () => {
    const transformedShop = await service.shopTransformer(shopCdcMock);
    expect(transformedShop).toBeDefined();
  });

  it('media array builder is working ', async () => {
    const transformedMedia = await service.productMediaTransformer(mediaMock);
    expect(transformedMedia).toBeDefined();
  });

  it('color variant array builder is working ', async () => {
    const transformedColorInformation = await service.productVariantTransformer(
      'Red',
      ['S'],
      'N',
      '13',
    );
    expect(transformedColorInformation).toBeDefined();
    expect(transformedColorInformation).not.toStrictEqual([
      [{ color: 'Red', size: 'S', preOrder: 'N', price: '13' }],
    ]);
  });
});
