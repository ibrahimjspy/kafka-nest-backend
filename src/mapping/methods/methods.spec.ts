import {
  addMasterCategoryMapping,
  addSubCategoryMapping,
  getMasterCategoryMapping,
  getSubCategoryMapping,
  removeMasterCategoryMapping,
  removeSubCategoryMapping,
} from './category';
import {
  addProductMapping,
  getProductMapping,
  removeProductMapping,
} from './product';
import { addShopMapping, getShopMapping, removeShopMapping } from './shop';

describe('MappingService', () => {
  describe('root', () => {
    it('master category id mapping workflow complete test', async () => {
      const data = await addMasterCategoryMapping(
        'testMasterAlpha',
        'testMasterDestination',
      );
      expect(data).toBeDefined();

      const testId = 'testMasterAlpha';
      const destinationId = await getMasterCategoryMapping(testId);
      expect(destinationId).toBeDefined();
      expect(destinationId).toStrictEqual('testMasterDestination');

      const deleteMapping = await removeMasterCategoryMapping(
        'testMasterDestination',
      );
      expect(deleteMapping).toBeDefined();
    });

    it('sub category id mapping workflow complete test', async () => {
      const data = await addSubCategoryMapping(
        'sourceSubTestAlpha',
        'sourceSubTestDestination',
        'sourceMasterTestZalpha',
      );
      expect(data).toBeDefined();

      const destinationId = await getSubCategoryMapping(
        'sourceSubTestAlpha',
        'sourceMasterTestZalpha',
      );
      expect(destinationId).toBeDefined();
      expect(destinationId).toStrictEqual('sourceSubTestDestination');

      const deleteMapping = await removeSubCategoryMapping(
        'sourceSubTestDestination',
      );
      expect(deleteMapping).toBeDefined();
    });

    it('product mapping workflow complete test', async () => {
      const data = await addProductMapping(
        'testSourcePdID',
        'testDestinationProdId',
        'testShopId',
      );
      expect(data).toBeDefined();

      const destinationId = await getProductMapping('testSourcePdID');
      expect(destinationId).toBeDefined();
      expect(destinationId).toStrictEqual('testDestinationProdId');

      const deleteMapping = await removeProductMapping('testDestinationProdId');
      expect(deleteMapping).toBeDefined();
    });

    it('shop mapping workflow complete test', async () => {
      const data = await addShopMapping(
        'testSourceShop',
        'testDestinationShop',
      );
      expect(data).toBeDefined();

      const destinationId = await getShopMapping('testSourceShop');
      expect(destinationId).toBeDefined();
      expect(destinationId).toStrictEqual('testDestinationShop');

      const deleteMapping = await removeShopMapping('testDestinationShop');
      expect(deleteMapping).toBeDefined();
    });
  });
});
