export const TBStyleSearchUniqueQuery = (styleId: string): string => {
  return `SELECT product_id, group_id, style_name, is_hidden, style_number, group_name, category, is_plus_size, category_id, sub_category, sub_category_id, description, default_picture, color_image, brand_id, brand_name, brand_web_name, fulfillment, brand_url, vendor_active, is_prevention, patterns, sleeves, styles, is_active, is_broken, is_sale, is_preorder, available_date, is_restock, is_sold_out, is_prepare, pack_name, item_sizes, popular_point_7, popular_point_14, popular_point_30, popular_point_60, pct_1_stars, pct_2_stars, pct_3_stars, pct_4_stars, pct_5_stars, regular_price, price, sale_price, created_date, updated_date, color_list
    FROM testDB.dbo.vTBStyleSearchUnique
    WHERE product_id='${styleId}'`;
};

export const masterCategoryQuery = (): string => {
  return `SELECT TBStyleNo_OS_Category_Master_ID, CategoryMasterName, Description, Active, mainTopCategory, DisplayGroup, DisplayOrder, DisplayGroupOrder, url, Description50, seo_title, seo_description, Description_tmpl, h1_tag
  FROM testDB.dbo.TBStyleNo_OS_Category_Master
  WHERE TBStyleNo_OS_Category_Master_ID=2;`;
};

export const tbStyleNoQuery = (): string => {
  return `SELECT TBItem_ID, TBVendorOwnCategory_ID, TBStyleNoCategory1_ID, TBStyleNoCategory2_ID, TBVendorCollection_ID, TBVendor_ID, TBRealVendor_ID, nVendorBarItem, nVendorStyleNo, nOurStyleNo, nOurStyleNo2, nItemDescription, TBSizeChart_ID, nReportYesOrNo, TBPackNo_ID, nActive, nVendorActive, nPrepare, nPurchasePrice, nPurchaseDiscountPrice, nMSRP, nPrice1, nPrice2, nPrice3, nOnSale, nSalePrice, nSalePrice1, nSalePrice2, nSalePrice3, nAvgPrice, nFirstPDate, nLastPDate, nFirstSDate, nLastSDate, nFirstPPrice, nLastPPrice, nFirstSalePrice, nLastSalePrice, nAvgCost, nDate, nDISC, nBDiscountYesOrNo, nFirstSalePrice1, nFirstSalePrice2, nFirstSalePrice3, nWeight, nCustomerReadCount, nIsAllPack, nModifyDate, nSoldOutUpdateDate, nSaleDate, nSoldOut, nVendorSalePrice, nHotItem100_1, nHotItem20_1, nHotItem100_2, nHotItem20_2, nHotItem100_3, nHotItem20_3, nHotItem100_4, nHotItem20_4, nHotItem100_2M, nHotItem20_2M, nHotItem100_1Sorting, nHotItem20_1Sorting, nHotItem100_2Sorting, nHotItem20_2Sorting, nHotItem100_3Sorting, nHotItem20_3Sorting, nHotItem100_4Sorting, nHotItem20_4Sorting, nHotItem100_2MSorting, nHotItem20_2MSorting, PictureS1, PictureS2, PictureS3, PictureS4, PictureS5, PictureS6, PictureS7, PictureS8, PictureS9, PictureR1, PictureR2, PictureR3, PictureR4, PictureR5, PictureR6, PictureR7, PictureR8, PictureR9, Picture1, Picture2, Picture3, Picture4, Picture5, Picture6, Picture7, Picture8, Picture9, PColorID1, PColorID2, PColorID3, PColorID4, PColorID5, PColorID6, PColorID7, PColorID8, PColorID9, PictureS1Temp, PictureS2Temp, PictureS3Temp, PictureS4Temp, PictureS5Temp, PictureS6Temp, PictureS7Temp, PictureS8Temp, PictureS9Temp, PictureR1Temp, PictureR2Temp, PictureR3Temp, PictureR4Temp, PictureR5Temp, PictureR6Temp, PictureR7Temp, PictureR8Temp, PictureR9Temp, Picture1Temp, Picture2Temp, Picture3Temp, Picture4Temp, Picture5Temp, Picture6Temp, Picture7Temp, Picture8Temp, Picture9Temp, nMatched, nUpdate, nVendorBestSeller, nVendorBestSellerManual, nABSChoice, nAdd, nSelfAdd, TBStyleNo_OS_Category_Master_ID, TBStyleNo_OS_Category_Sub_ID, TBStyleNo_Category_Master_ID, TBStyleNo_Category_Sub_ID, TBStyleNo_Color_ID, TBStyleNo_PatternDetail_ID, TBStyleNo_Style_ID, TBStyleNo_Department_ID, nSortingNO, onGroupBy_Active, onGroupBy_MaxPack, onGroupBy_ChoosePackQTY, OnisCustomer, PictureZ1, PictureZ2, PictureZ3, PictureZ4, PictureZ5, PictureZ6, PictureZ7, PictureZ8, PictureZ9, PictureZ1Temp, PictureZ2Temp, PictureZ3Temp, PictureZ4Temp, PictureZ5Temp, PictureZ6Temp, PictureZ7Temp, PictureZ8Temp, PictureZ9Temp, PictureFullLocation, PictureV1, PictureV2, PictureV3, PictureV4, PictureV5, PictureV6, PictureV7, PictureV8, PictureV9, PictureV1Temp, PictureV2Temp, PictureV3Temp, PictureV4Temp, PictureV5Temp, PictureV6Temp, PictureV7Temp, PictureV8Temp, PictureV9Temp, PictureELocation, PictureLLocation, PictureVLocation, PictureZLocation, PictureTestR1, GroupBuySeries, nPreOrder, nPreOrderAvailableDate, TBGroupBuyStyleNo_ID, GroupNO_ID, nStyleName, nStyleNameUpdated, TBStyleNo_OS_Collection_ID, SearchField, PageIDX, nHidden, nReStock, nReStockDate, is_brand_only, is_brand_only_active, view_point, cart_point, sales_point, popular_point, WaitCallback, OriginDate, PublishDate, is_broken_pack, min_broken_pack_order_qty, TBStyleNo_OS_Shape_ID, TBStyleNo_OS_Length_ID, TBStyleNo_OS_Sleeve_ID, made_in, is_failed, is_checked
FROM testDB.dbo.TBStyleNo`;
};

export const subCategoryQuery = (): string => {
  return `SELECT TBStyleNo_OS_Category_Sub_ID, TBStyleNo_OS_Category_Master_ID, CategorySubName, Description, Active, url, Description50, seo_title, seo_description, Description_tmpl, h1_tag
  FROM testDB.dbo.TBStyleNo_OS_Category_Sub ;`;
};
