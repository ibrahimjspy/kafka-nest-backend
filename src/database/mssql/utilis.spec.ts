import {
  expectedShoeSizes,
  mockDbShoesDetails,
  mockShoeBundles,
} from '../../../mock/shoes/bundles';
import {
  getShoeBundleNames,
  getShoeBundlesFromDb,
  getShoeSizeColumns,
} from './utils';

describe('mssql utility tests', () => {
  describe('findAll', () => {
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
});
