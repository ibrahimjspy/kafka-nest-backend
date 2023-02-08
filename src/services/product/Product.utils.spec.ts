import {
  mockColorList,
  mockVariantData,
  mockVariantsByColor,
} from '../../../mock/product/variant';
import { getProductMapping } from 'src/mapping/methods/product';
import {
  expectedShoeVariantsMappedAgainstShoeColumns,
  expectedSizes,
  expectedVariantIdsMappedAgainstColors,
  mockDestinationUrls,
  mockShoeBundleMappingData,
  mockShoeSizes,
  mockShoeVariantMapping,
  mockSourceUrls,
} from '../../../mock/product/utils.spec.mock';
import {
  getVariantIdsByColor,
  getVariantMediaById,
} from './media/Product.Media.utils';
import {
  chunkArray,
  getShoeBundlesBySizes,
  getShoeSizes,
  getShoeVariantsMapping,
  mediaUrlMapping,
  idBase64Decode,
} from './Product.utils';
import { mockVariantMappedByMedia } from '../../../mock/product/media';
import {
  addSkuToProductVariants,
  getProductVariantsForSku,
} from './variant/Product.Variant.utils';
describe('Product utility tests', () => {
  describe('findAll', () => {
    it('chunkArray unit test to check if it is splitting array', async () => {
      const mockArray = ['test', 'test1', 'test2', 'test3'];
      const expectedArray = [
        ['test', 'test1'],
        ['test2', 'test3'],
      ];
      const splittedArray = chunkArray(mockArray, 2);

      expect(splittedArray).toBeDefined();
      expect(splittedArray).toStrictEqual(expectedArray);
    });

    it('splitting media urls utility is working', async () => {
      const newUrls = mediaUrlMapping(mockSourceUrls, mockDestinationUrls);
      expect(newUrls).toBeDefined();
    });
  });

  it('get shoe bundles from variants and bundle lengths', async () => {
    const shoeBundles = getShoeBundlesBySizes(
      mockShoeBundleMappingData.shoeVariants,
      mockShoeBundleMappingData.bundleSizes,
      mockShoeBundleMappingData.length,
    );
    expect(shoeBundles).toBeDefined();
    expect(shoeBundles).toStrictEqual(expectedVariantIdsMappedAgainstColors);
  });

  it('testing whether we can get shoe sizes against column names of db to match it for bundle creation ', async () => {
    const shoeColumns = getShoeSizes(mockShoeSizes);
    expect(shoeColumns).toBeDefined();
    expect(shoeColumns).toStrictEqual(expectedSizes);
  });
  it('testing whether shoe variant mapping against color and sizes is working ', async () => {
    const variantsMapping = getShoeVariantsMapping(
      mockShoeVariantMapping.shoe_sizes,
      mockShoeVariantMapping.variantIds,
      mockShoeVariantMapping.color_list,
    );
    expect(variantsMapping).toBeDefined();
    expect(variantsMapping).toStrictEqual(
      expectedShoeVariantsMappedAgainstShoeColumns,
    );
  });

  it('testing get mapping table data ', async () => {
    const getTable = await getProductMapping('123');
    console.log(getTable);
    expect(getTable).toBeDefined();
  });

  it('testing base 64 conversion', async () => {
    const encoded = 'UHJvZHVjdFZhcmlhbnQ6ODc1MDI=';
    const data = idBase64Decode(encoded);
    console.log(data);
    expect(data).toBeDefined();
  });

  it('variant ids are coming fine', async () => {
    const data = getVariantIdsByColor(mockVariantData, mockColorList);
    console.log(data);
    expect(data).toBeDefined();
    expect(data).toStrictEqual(mockVariantsByColor);
  });

  it('variant media is mapping with variant fine', async () => {
    const data = getVariantMediaById(mockVariantsByColor, {
      WHITE: ['123'],
      YELLOW: ['123'],
    });
    expect(data).toBeDefined();
    expect(data).toStrictEqual(mockVariantMappedByMedia);
  });

  it('product variants are transformed accurately for sku', async () => {
    const data = getProductVariantsForSku(mockVariantData, mockColorList);
    console.log(data);
    expect(data).toBeDefined();
  });

  it('sku is added fine to product variants array', async () => {
    const variantsMock = [{ color: 'red' }];
    addSkuToProductVariants([{ sku: 'test' }], variantsMock);
    expect(variantsMock).toBeDefined();
    expect(variantsMock).toStrictEqual([{ color: 'red', sku: 'test' }]);
  });
});
