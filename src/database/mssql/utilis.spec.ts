import { getShoeBundlesFromDb, getShoeSizeColumns } from './utils';

describe('mssql utility tests', () => {
  describe('findAll', () => {
    it('checking whether getShoeBundles is working', async () => {
      const mockBundlesFromDb = {
        TBVendorShoeSize_ID: [
          {
            TBVendorShoeSize_ID: 151,
            ShoeSizeName: 'A12',
            Description: '12PAIRS',
            TBVendor_ID: '324',
            S5: '',
            S5h: '1',
            S6: '1',
            S6h: '2',
            S7: '2',
            S7h: '2',
            S8: '1',
            S8h: '1',
            S9: '1',
            S9h: '',
            S10: '1',
            S10h: '',
            S11: '',
            S11h: '',
            S12: '',
            S12h: '',
            is_favorite: false,
            sn1: '5',
            sn2: '5.5',
            sn3: '6',
            sn4: '6.5',
            sn5: '7',
            sn6: '7.5',
            sn7: '8',
            sn8: '8.5',
            sn9: '9',
            sn10: '9.5',
            sn11: '10',
            sn12: '10.5',
            sn13: '11',
            sn14: '11.5',
            sn15: '12',
            sn16: '12.5',
          },
          {
            TBVendorShoeSize_ID: 152,
            ShoeSizeName: 'B12',
            Description: '12PAIRS',
            TBVendor_ID: '324',
            S5: '',
            S5h: '',
            S6: '1',
            S6h: '1',
            S7: '1',
            S7h: '1',
            S8: '2',
            S8h: '2',
            S9: '2',
            S9h: '',
            S10: '2',
            S10h: '',
            S11: '',
            S11h: '',
            S12: '',
            S12h: '',
            is_favorite: false,
            sn1: '5',
            sn2: '5.5',
            sn3: '6',
            sn4: '6.5',
            sn5: '7',
            sn6: '7.5',
            sn7: '8',
            sn8: '8.5',
            sn9: '9',
            sn10: '9.5',
            sn11: '10',
            sn12: '10.5',
            sn13: '11',
            sn14: '11.5',
            sn15: '12',
            sn16: '12.5',
          },
        ],
      };
      const expectedBundles = [
        {
          S5h: '1',
          S6: '1',
          S6h: '2',
          S7: '2',
          S7h: '2',
          S8: '1',
          S8h: '1',
          S9: '1',
          S10: '1',
        },
        {
          S6: '1',
          S6h: '1',
          S7: '1',
          S7h: '1',
          S8: '2',
          S8h: '2',
          S9: '2',
          S10: '2',
        },
      ];
      const data = getShoeBundlesFromDb(mockBundlesFromDb);
      expect(data).toBeDefined();
      expect(data).toStrictEqual(expectedBundles);
    });
    it('checking whether we qet union sizes of get sizes util', async () => {
      const mockBundles = [
        {
          S5h: '1',
          S6: '1',
          S6h: '2',
          S7: '2',
          S7h: '2',
          S8: '1',
          S8h: '1',
          S9: '1',
          S10: '1',
        },
        {
          S6: '1',
          S6h: '1',
          S7: '1',
          S7h: '1',
          S8: '2',
          S8h: '2',
          S9: '2',
          S10: '2',
        },
      ];
      const expectedSizes = {
        S5h: '1',
        S6: '1',
        S6h: '1',
        S7: '1',
        S7h: '1',
        S8: '2',
        S8h: '2',
        S9: '2',
        S10: '2',
      };
      const data = getShoeSizeColumns(mockBundles);
      expect(data).toBeDefined();
      expect(data).toStrictEqual(expectedSizes);
    });
  });
});
