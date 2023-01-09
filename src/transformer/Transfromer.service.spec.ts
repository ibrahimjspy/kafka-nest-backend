import { Test, TestingModule } from '@nestjs/testing';
import {
  masterCategoryCDCMock,
  subCategoryCDCMock,
  subCategoryExpected,
} from '../../mock/transformer/categories';
import {
  descriptionSmallText,
  productCdcMock,
} from '../../mock/transformer/product';
import { shopCdcMock } from '../../mock/transformer/shop';
import { TransformerService } from './Transformer.service';
import { mediaMock } from '../../mock/product/media';
import { ProductTransformerService } from './product/Product.transformer';
import { TransformerModule } from './Transformer.module';
import { RetailerTransformerService } from './shop/Retailer.transformer';
import { ShopTransformerService } from './shop/Shop.transformer';
import {
  getShoeBundleNames,
  getShoeBundlesFromDb,
  getShoeSizeColumns,
} from './product/Product.variant/Product.variant.transformer.utils';
import {
  expectedShoeSizes,
  mockDbShoesDetails,
  mockShoeBundles,
} from '../../mock/shoes/bundles';

describe('TransformerController', () => {
  let service: TransformerService;
  let productService: ProductTransformerService;
  let shopService: ShopTransformerService;
  let retailerService: RetailerTransformerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransformerService, RetailerTransformerService],
      imports: [TransformerModule],
    }).compile();

    service = module.get<TransformerService>(TransformerService);
    productService = module.get<ProductTransformerService>(
      ProductTransformerService,
    );
    shopService = module.get<ShopTransformerService>(ShopTransformerService);
    retailerService = module.get<RetailerTransformerService>(
      RetailerTransformerService,
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
    expect(transformedProduct).toBeDefined();
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

  it('shopUrlTransformer is working  ', async () => {
    const transformedUrl = await shopService.shopUrlTransformer(
      'mock.com',
      'testShop',
    );
    expect(transformedUrl).toBeDefined();
  });

  it('shop phone number transformer is working  ', async () => {
    const transformedNumber = await shopService.shopPhoneNumberTransformer(
      'mock786',
    );
    expect(transformedNumber).toBeDefined();
  });
  it('retailer full name transformer is working  ', async () => {
    const transformedFullName = await retailerService.fullNameTransformer(
      'mock',
      'rock',
    );
    expect(transformedFullName).toBeDefined();
  });

  it('retailer shop phone number transformer is working   ', async () => {
    const transformedNumber =
      await retailerService.retailerPhoneNumberTransformer('mock903');
    expect(transformedNumber).toBeDefined();
  });

  it('product media builder is working   ', async () => {
    const transformedMedia =
      productService.mediaTransformerMethod(productCdcMock);
    expect(transformedMedia).toBeDefined();
  });

  it('product categoryIdTransformer is working   ', async () => {
    const productCategoryId = await productService.categoryIdTransformer(
      productCdcMock.TBStyleNo_OS_Category_Master_ID,
      productCdcMock.TBStyleNo_OS_Category_Sub_ID,
    );
    expect(productCategoryId).toBeDefined();
  });

  it('price transformer is working   ', async () => {
    const productCategoryId = productService.priceTransformer(
      productCdcMock.nPurchasePrice,
      productCdcMock.nSalePrice,
      productCdcMock.nOnSale,
    );
    expect(productCategoryId).toBeDefined();
  });

  it('shop media urls are transforming fine', async () => {
    const testMedia = 'profile_2UNIC.jpg';
    const data = shopService.shopImageTransformer(testMedia);
    console.log(data);
    expect(data).toBeDefined();
  });

  it('shop banners are transforming fine', async () => {
    const data = shopService.shopBannerTransformer(shopCdcMock);
    console.log(data);
    expect(data).toBeDefined();
  });

  // Product variant transformer utils unit tests
  it('checking whether getShoeBundles is working', async () => {
    const data = getShoeBundlesFromDb(mockDbShoesDetails);
    expect(data).toBeDefined();
  });
  it('checking whether we qet union sizes of get sizes util', async () => {
    const data = getShoeSizeColumns(mockShoeBundles);
    expect(data).toBeDefined();
    expect(data).toStrictEqual(expectedShoeSizes);
  });
  it('checking whether we are fetching bundle names accurately', async () => {
    const bundleNames = getShoeBundleNames(mockDbShoesDetails);
    expect(bundleNames).toBeDefined();
  });
});
