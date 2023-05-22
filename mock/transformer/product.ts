import { productDto, productTransformed } from 'src/transformer/types/product';

export const descriptionSmallText =
  '{"time": 1662995227870, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "test description"}, "type": "paragraph"}], "version": "2.24.3"}';

export const productCdcMock: productDto | any = {
  TBItem_ID: '93535945',
  TBVendorOwnCategory_ID: '8199',
  TBStyleNoCategory1_ID: '1',
  TBStyleNoCategory2_ID: '1',
  TBVendorCollection_ID: '1',
  TBVendor_ID: 'ACF',
  TBRealVendor_ID: 'ACF',
  nVendorBarItem: '0010803',
  nVendorStyleNo: 'QP-PHEDRA-04',
  nOurStyleNo: 'ACF_QP-PHEDRA-04',
  nOurStyleNo2: 'ACF_QP-PHEDRA-04',
  nItemDescription: 'Women SHOES\ncomfortable\nTrue to size',
  TBSizeChart_ID: '2',
  nReportYesOrNo: 'Y',
  TBPackNo_ID: '2',
  nActive: 'Y',
  nVendorActive: 'Y',
  nPrepare: 'N',
  nPurchasePrice: '14.5',
  nPurchaseDiscountPrice: 0,
  nMSRP: 0,
  nPrice1: '14.5',
  nPrice2: 14.5,
  nPrice3: 14.5,
  nOnSale: 'N',
  nSalePrice: '0',
  nSalePrice1: 0,
  nSalePrice2: 0,
  nSalePrice3: 0,
  nAvgPrice: 0,
  nFirstPPrice: 0,
  nLastPPrice: 0,
  nFirstSalePrice: 0,
  nLastSalePrice: 0,
  nAvgCost: 0,
  nDISC: '',
  nBDiscountYesOrNo: false,
  nFirstSalePrice1: 0,
  nFirstSalePrice2: 0,
  nFirstSalePrice3: 0,
  nWeight: 0,
  nCustomerReadCount: 0,
  nIsAllPack: 'N',
  nSoldOut: 'N',
  nVendorSalePrice: 0,
  nHotItem100_1: 'N',
  nHotItem20_1: 'N',
  nHotItem100_2: 'N',
  nHotItem20_2: 'N',
  nHotItem100_3: 'N',
  nHotItem20_3: 'N',
  nHotItem100_4: 'N',
  nHotItem20_4: 'N',
  nHotItem100_2M: 'N',
  nHotItem20_2M: 'N',
  nHotItem100_1Sorting: 0,
  nHotItem20_1Sorting: 0,
  nHotItem100_2Sorting: 0,
  nHotItem20_2Sorting: 0,
  nHotItem100_3Sorting: 0,
  nHotItem20_3Sorting: 0,
  nHotItem100_4Sorting: 0,
  nHotItem20_4Sorting: 0,
  nHotItem100_2MSorting: 0,
  nHotItem20_2MSorting: 0,
  PictureS1: '202110/L/f9036f04-2bb7-11ec-b025-027098eb172b_L.jpg',
  PictureS2: '202110/L/fc8a82c0-2bb7-11ec-b025-027098eb172b_L.jpg',
  PictureS3: '202110/L/fe76a62c-2bb7-11ec-b025-027098eb172b_L.jpg',
  PictureS4: '202110/L/016ff46e-2bb8-11ec-b025-027098eb172b_L.jpg',
  PictureS5: '202110/L/04e20c5e-2bb8-11ec-b025-027098eb172b_L.jpg',
  PictureS6: '202110/L/0743109d-2bb8-11ec-b025-027098eb172b_L.jpg',
  PictureS7: '202110/L/0a323b8e-2bb8-11ec-b025-027098eb172b_L.jpg',
  PictureS8: '202110/L/0c0c7816-2bb8-11ec-b025-027098eb172b_L.jpg',
  PictureS9: '202110/L/0e052f64-2bb8-11ec-b025-027098eb172b_L.jpg',
  PictureR1: '',
  PictureR2: '',
  PictureR3: '',
  PictureR4: '',
  PictureR5: '',
  PictureR6: '',
  PictureR7: '',
  PictureR8: '',
  PictureR9: '',
  Picture1: '202110/E/f9036f04-2bb7-11ec-b025-027098eb172b_E.jpg',
  Picture2: '202110/E/fc8a82c0-2bb7-11ec-b025-027098eb172b_E.jpg',
  Picture3: '202110/E/fe76a62c-2bb7-11ec-b025-027098eb172b_E.jpg',
  Picture4: '202110/E/016ff46e-2bb8-11ec-b025-027098eb172b_E.jpg',
  Picture5: '202110/E/04e20c5e-2bb8-11ec-b025-027098eb172b_E.jpg',
  Picture6: '202110/E/0743109d-2bb8-11ec-b025-027098eb172b_E.jpg',
  Picture7: '202110/E/0a323b8e-2bb8-11ec-b025-027098eb172b_E.jpg',
  Picture8: '202110/E/0c0c7816-2bb8-11ec-b025-027098eb172b_E.jpg',
  Picture9: '202110/E/0e052f64-2bb8-11ec-b025-027098eb172b_E.jpg',
  PColorID1: '',
  PColorID2: '',
  PColorID3: '',
  PColorID4: '',
  PColorID5: '',
  PColorID6: '',
  PColorID7: '',
  PColorID8: '',
  PColorID9: '',
  PictureS1Temp: '',
  PictureS2Temp: '',
  PictureS3Temp: '',
  PictureS4Temp: '',
  PictureS5Temp: '',
  PictureS6Temp: '',
  PictureS7Temp: '',
  PictureS8Temp: '',
  PictureS9Temp: '',
  PictureR1Temp: '',
  PictureR2Temp: '',
  PictureR3Temp: '',
  PictureR4Temp: '',
  PictureR5Temp: '',
  PictureR6Temp: '',
  PictureR7Temp: '',
  PictureR8Temp: '',
  PictureR9Temp: '',
  Picture1Temp: '',
  Picture2Temp: '',
  Picture3Temp: '',
  Picture4Temp: '',
  Picture5Temp: '',
  Picture6Temp: '',
  Picture7Temp: '',
  Picture8Temp: '',
  Picture9Temp: '',
  nMatched: 'N',
  nUpdate: 'N',
  nVendorBestSeller: 'N',
  nVendorBestSellerManual: 'N',
  nABSChoice: 'N',
  nAdd: 'Y',
  nSelfAdd: 'Y',
  TBStyleNo_OS_Category_Master_ID: '15',
  TBStyleNo_OS_Category_Sub_ID: '75',
  TBStyleNo_Category_Master_ID: '0',
  TBStyleNo_Category_Sub_ID: '0',
  TBStyleNo_Color_ID: '0',
  TBStyleNo_PatternDetail_ID: '',
  TBStyleNo_Style_ID: '',
  TBStyleNo_Department_ID: null,
  nSortingNO: 0,
  onGroupBy_Active: 'N',
  onGroupBy_MaxPack: 0,
  onGroupBy_ChoosePackQTY: 0,
  OnisCustomer: 'N',
  PictureZ1: '202110/Z/f9036f04-2bb7-11ec-b025-027098eb172b_Z.jpg',
  PictureZ2: '202110/Z/fc8a82c0-2bb7-11ec-b025-027098eb172b_Z.jpg',
  PictureZ3: '202110/Z/fe76a62c-2bb7-11ec-b025-027098eb172b_Z.jpg',
  PictureZ4: '202110/Z/016ff46e-2bb8-11ec-b025-027098eb172b_Z.jpg',
  PictureZ5: '202110/Z/04e20c5e-2bb8-11ec-b025-027098eb172b_Z.jpg',
  PictureZ6: '202110/Z/0743109d-2bb8-11ec-b025-027098eb172b_Z.jpg',
  PictureZ7: '202110/Z/0a323b8e-2bb8-11ec-b025-027098eb172b_Z.jpg',
  PictureZ8: '202110/Z/0c0c7816-2bb8-11ec-b025-027098eb172b_Z.jpg',
  PictureZ9: '202110/Z/0e052f64-2bb8-11ec-b025-027098eb172b_Z.jpg',
  PictureZ1Temp: '',
  PictureZ2Temp: '',
  PictureZ3Temp: '',
  PictureZ4Temp: '',
  PictureZ5Temp: '',
  PictureZ6Temp: '',
  PictureZ7Temp: '',
  PictureZ8Temp: '',
  PictureZ9Temp: '',
  PictureFullLocation: '',
  PictureV1: '202110/V/f9036f04-2bb7-11ec-b025-027098eb172b_V.jpg',
  PictureV2: '202110/V/fc8a82c0-2bb7-11ec-b025-027098eb172b_V.jpg',
  PictureV3: '202110/V/fe76a62c-2bb7-11ec-b025-027098eb172b_V.jpg',
  PictureV4: '202110/V/016ff46e-2bb8-11ec-b025-027098eb172b_V.jpg',
  PictureV5: '202110/V/04e20c5e-2bb8-11ec-b025-027098eb172b_V.jpg',
  PictureV6: '202110/V/0743109d-2bb8-11ec-b025-027098eb172b_V.jpg',
  PictureV7: '202110/V/0a323b8e-2bb8-11ec-b025-027098eb172b_V.jpg',
  PictureV8: '202110/V/0c0c7816-2bb8-11ec-b025-027098eb172b_V.jpg',
  PictureV9: '202110/V/0e052f64-2bb8-11ec-b025-027098eb172b_V.jpg',
  PictureV1Temp: '',
  PictureV2Temp: '',
  PictureV3Temp: '',
  PictureV4Temp: '',
  PictureV5Temp: '',
  PictureV6Temp: '',
  PictureV7Temp: '',
  PictureV8Temp: '',
  PictureV9Temp: '',
  PictureELocation: null,
  PictureLLocation: null,
  PictureVLocation: null,
  PictureZLocation: null,
  PictureTestR1: null,
  GroupBuySeries: 'N',
  nPreOrder: 'N',
  nPreOrderAvailableDate: null,
  TBGroupBuyStyleNo_ID: null,
  GroupNO_ID: null,
  nStyleName: 'BEST SELLER',
  nStyleNameUpdated: 'N',
  TBStyleNo_OS_Collection_ID: null,
  SearchField: '',
  PageIDX: '999999',
  nHidden: 'N',
  nReStock: 'N',
  nReStockDate: null,
  is_brand_only: false,
  is_brand_only_active: false,
  view_point: 0,
  cart_point: 0,
  sales_point: 0,
  popular_point: 0,
  WaitCallback: false,
  is_broken_pack: false,
  min_broken_pack_order_qty: 0,
  TBStyleNo_OS_Shape_ID: null,
  TBStyleNo_OS_Length_ID: null,
  TBStyleNo_OS_Sleeve_ID: null,
  made_in: 'CN',
  is_failed: false,
  is_checked: false,
};

export const productTransformedExpected: productTransformed = {
  id: '93535945',
  styleNumber: 'QP-PHEDRA-04',
  name: 'BEST SELLER',
  description:
    '{"time": 1662995227870, "blocks": [{"id": "cqWmV3MIPH", "data": {"text": "Women SHOES comfortable True to size"}, "type": "paragraph"}], "version": "2.24.3"}',
  media: [
    {
      tiny: undefined,
      small: '202110/V/f9036f04-2bb7-11ec-b025-027098eb172b_V.jpg',
      medium: '202110/E/f9036f04-2bb7-11ec-b025-027098eb172b_E.jpg',
      large: '202110/Z/f9036f04-2bb7-11ec-b025-027098eb172b_Z.jpg',
    },
    {
      tiny: undefined,
      small: '202110/V/fc8a82c0-2bb7-11ec-b025-027098eb172b_V.jpg',
      medium: '202110/E/fc8a82c0-2bb7-11ec-b025-027098eb172b_E.jpg',
      large: '202110/Z/fc8a82c0-2bb7-11ec-b025-027098eb172b_Z.jpg',
    },
    {
      tiny: undefined,
      small: '202110/V/fe76a62c-2bb7-11ec-b025-027098eb172b_V.jpg',
      medium: '202110/E/fe76a62c-2bb7-11ec-b025-027098eb172b_E.jpg',
      large: '202110/Z/fe76a62c-2bb7-11ec-b025-027098eb172b_Z.jpg',
    },
    {
      tiny: undefined,
      small: '202110/V/016ff46e-2bb8-11ec-b025-027098eb172b_V.jpg',
      medium: '202110/E/016ff46e-2bb8-11ec-b025-027098eb172b_E.jpg',
      large: '202110/Z/016ff46e-2bb8-11ec-b025-027098eb172b_Z.jpg',
    },
    {
      tiny: undefined,
      small: '202110/V/04e20c5e-2bb8-11ec-b025-027098eb172b_V.jpg',
      medium: '202110/E/04e20c5e-2bb8-11ec-b025-027098eb172b_E.jpg',
      large: '202110/Z/04e20c5e-2bb8-11ec-b025-027098eb172b_Z.jpg',
    },
    {
      tiny: undefined,
      small: '202110/V/0743109d-2bb8-11ec-b025-027098eb172b_V.jpg',
      medium: '202110/E/0743109d-2bb8-11ec-b025-027098eb172b_E.jpg',
      large: '202110/Z/0743109d-2bb8-11ec-b025-027098eb172b_Z.jpg',
    },
    {
      tiny: undefined,
      small: '202110/V/0a323b8e-2bb8-11ec-b025-027098eb172b_V.jpg',
      medium: '202110/E/0a323b8e-2bb8-11ec-b025-027098eb172b_E.jpg',
      large: '202110/Z/0a323b8e-2bb8-11ec-b025-027098eb172b_Z.jpg',
    },
    {
      tiny: undefined,
      small: '202110/V/0c0c7816-2bb8-11ec-b025-027098eb172b_V.jpg',
      medium: '202110/E/0c0c7816-2bb8-11ec-b025-027098eb172b_E.jpg',
      large: '202110/Z/0c0c7816-2bb8-11ec-b025-027098eb172b_Z.jpg',
    },
    {
      tiny: undefined,
      small: '202110/V/0e052f64-2bb8-11ec-b025-027098eb172b_V.jpg',
      medium: '202110/E/0e052f64-2bb8-11ec-b025-027098eb172b_E.jpg',
      large: '202110/Z/0e052f64-2bb8-11ec-b025-027098eb172b_Z.jpg',
    },
  ],
  categoryId: 'Q2F0ZWdvcnk6MTE2',
  shopId: '215',
  price: { purchasePrice: 14.5, salePrice: 0, onSale: 'N' },
};
