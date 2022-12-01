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
  chunkArray,
  getShoeBundlesBySizes,
  getShoeSizes,
  getShoeVariantsMapping,
  mediaUrlMapping,
} from './Product.utils';
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
      const expectedUrl = [{ large: 'url5' }];
      const newUrls = mediaUrlMapping(mockSourceUrls, mockDestinationUrls);
      expect(newUrls).toBeDefined();
      expect(newUrls).toStrictEqual(expectedUrl);
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
});
