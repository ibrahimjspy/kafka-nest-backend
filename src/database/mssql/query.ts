export const TBStyleSearchUniqueQuery = (styleId: string): string => {
  const query = `SELECT product_id, group_id, style_name, is_hidden, style_number, group_name, category, is_plus_size, category_id, sub_category, sub_category_id, description, default_picture, color_image, brand_id, brand_name, brand_web_name, fulfillment, brand_url, vendor_active, is_prevention, patterns, sleeves, styles, is_active, is_broken, is_sale, is_preorder, available_date, is_restock, is_sold_out, is_prepare, pack_name, item_sizes, popular_point_7, popular_point_14, popular_point_30, popular_point_60, pct_1_stars, pct_2_stars, pct_3_stars, pct_4_stars, pct_5_stars, regular_price, price, sale_price, created_date, updated_date, color_list, ShoeDetails, ColorMedia, TBSizeChart_ID
    FROM [ARAOS].[dbo].[vTBStyleSearchUnique_V2]
    WHERE product_id='${styleId}'`;
  return query;
};

export const masterCategoryQuery = (): string => {
  return `SELECT TBStyleNo_OS_Category_Master_ID, CategoryMasterName, Description, Active, mainTopCategory, DisplayGroup, DisplayOrder, DisplayGroupOrder, url, Description50, seo_title, seo_description, Description_tmpl, h1_tag
  FROM ARAOS.dbo.TBStyleNo_OS_Category_Master`;
};

export const tbStyleNoQuery = (): string => {
  return `SELECT *
  FROM
             TBStyleNo_New NN
             LEFT JOIN TBStyleSearchUnique_New UN ON NN.TBItem_ID  = UN.product_id
  WHERE UN.product_id iS NULL and NN.TBStyleNo_OS_Category_Master_ID  = 15`;
};

export const tbStyleNoNewQuery = (vendorId: string): string => {
  return `SELECT *
  FROM [ARAOS].[dbo].[TBStyleNo]
  where TBVendor_ID = '${vendorId}'
  AND nSoldOut != 'Y' AND nActive = 'Y' 
	AND Picture1 <> ''
	AND ISNULL(TBStyleNo_OS_Category_Master_ID,0) <> 0
`;
};

export const subCategoryQuery = (): string => {
  return `SELECT TBStyleNo_OS_Category_Sub_ID, TBStyleNo_OS_Category_Master_ID, CategorySubName, Description, Active, url, Description50, seo_title, seo_description, Description_tmpl, h1_tag
  FROM ARAOS.dbo.TBStyleNo_OS_Category_Sub ;`;
};

export const tbVendorQuery = (vendorId?: string): string => {
  return `SELECT TBVendor_SQL_ID, TBVendor_ID, TBBrandVendor_ID, TBMajorMarket_ID, AfricanAmerican, AsianEthnicities, Caucasian, LatinAmerican, MiddleEasternEthnicity, NativeAmerican, PacificIslandEthnicity, TBSizeChart_ID, TBPackNo_ID, VDName, VDWebName, VDName2, VDAddress, VDAddress2, VDCity, VDState, VDZip, VDPhone, VDFax, VDEMail, VDContact, VDContTitle, fTerm, VDActive, VDOSVendor, VDRate1, VDRate2, VDRate3, VDCRate1, VDCRate2, VDCRate3, VDImageFrontMain, VDImageVendorMain, VDLogoImage, VDFrontImage, VDIntroduction, VDFrontDescription, VDRegisterDate, VDWebUsing, VDAdminUsing, VDWebUsingDomain, VDOwnDomain, TSalesCounting, TNewArrivalCounting1, TNewArrivalCounting2, TNewArrivalCounting3, TNewArrivalCounting4, TBVendor_Domain, TBOwnWebSiteManage, VDPrivacyPolicy, VDReturnPolicy, VDTermsOfUse, VDContactUs, VDVendorEmail, VDVendorURL, VDYoutubeUsing, VDYoutubeURL, VDABLogoOn, VDMinimumOrderAmount, VDWatermarkPositionx, VDWatermarkPositiony, VDWatermarkText, VDWatermarkImage, VDWatermarkFont, VDWatermarkSelect, nDownload, OnisCustomer, VDRegisterEmailTitle, VDRegisterEmailContent, VDForgotEmailTitle, VDForgotEmailContent, VDPurchaseEmailTitle, VDPurchaseEmailContent, VDShipoutEmailTitle, VDShipoutEmailContent, VDApprovedEmailTitle, VDApprovedEmailContent, nAllowSendOSEmail, VDOwnManageOrder, TUpdate, VDClass, AuthLoginName, AuthTransactionKey, nHomePageLayout, HeadBannerImageA_1, HeadBannerImageA_2, HeadBannerImageA_3, HeadBannerImageA_4, BannerA_Image1, BannerA_Image2, BannerA_Image3, BannerB_Image1, BannerB_Image2, nColorScheme, HeadBannerImageC_1, CCVerifyCode, BannerImg1, BannerImg2, BannerImg3, BannerImg4, BannerImg5, BannerImg6, BannerImg7, ShippedFrom, OSminOrderAMT, EnableDownloadPicture, FeaturedBrand, VDCategory, copyprevention, OSDescription, VDPriceLevel, VDMadeIn, TBStyleNo_OS_Collection_ID, VDContactPreference, VDPaidDetail, UPSAcct, VDH1Tag, VDWhoShipping, VDFSB, VDOrderEmail, PictureFee, ColorSwatchFee, VDPreOrderActive, VDDiscountFee, SignUpType, VDStoreCredit, VDUseUPS, VDOwnWebMonthlyFee, VDMonthlyFee, VDInvoiceMemo, VDMemo, VDUseOnlySale, Brand_Rep_Image, VDMerchantFee, VDPreAuth, VDPremiumCommission, BuyerStaff, BuyerStaffTemp, Site, VDActiveDate, AssignedStaff, SEOTitle, SEODescription, VDStorePolicy, BrandRewardRate, owner_info, VendorCollection, Ein_number, payment_method, CorporateName, internationalShipping, VDInactiveDate, VDReactiveDate, api_login_id, api_transaction_key, SharoveType, OSFulfillmentType
FROM ARAOS.dbo.TBVendor where VDActive = 'Y' ${
    vendorId ? `and TBVendor_ID = '${vendorId}'` : ''
  }`;
};

export const tbShipMethodQuery = (): string => {
  return `SELECT TBShipMethod_Local_ID, TBShipMethod_ID, SMShipMethodName, SMDescription, TActive, TActiveOnis, EasyPostDescription, Carrier, DefaultOrder, IsInternational, IsDefault
  FROM ARAOS.dbo.TBShipMethod;
  `;
};

export const tbVendorShippingDetailsQuery = (vendorId): string => {
  return `SELECT TBVendorShipMethod_ID, TBShipFrom_ID, TBShipMethod_ID, [Order], IsInternational, IsDefault
  FROM ARAOS.dbo.TBVendorShipMethod where TBShipFrom_ID = ${vendorId}
  `;
};

export const tbCustomerQuery = (): string => {
  return `SELECT TBCustomer_SQL_ID, TBWhichPlace, TBCustomer_ID, onVendor_ID, CustomerProfileID, CTCompanyName, CTLoginID, CTLoginPassword, TBMajorMarket_ID, AfricanAmerican, AsianEthnicities, Caucasian, LatinAmerican, MiddleEasternEthnicity, NativeAmerican, PacificIslandEthnicity, TBMyVendor_Use, TBCustomerJobTitle_ID, CTCustomerFirstName, CTCustomerLastName, CTWebsite, CTPhone, CTContactTitle, CTHandPhone, CTAddress1, CTAddress2, CTCity, CTState, CTZip, CTCountry, CTFax, CardType, CardNumber, CardSecurityCode, CardExpireMonth, CardExpireYear, CTNote, CTCreditCardInfo, CTDISC, CTActive, CTFirstPurchaseDate, CTLastPurchaseDate, CTBalance, CTStoreCredit, CTPriceLevel, CTMemo, CTMailCompanyName, CTMailAttention, IsResidential, UPSinsurance, CTMailAddress1, CTMailAddress2, CTMailCity, CTMailState, CTMailZip, CTMailCountry, CTMailPhone, CTSHOWorLOCAL, CTCreditLimitLine, ReceiveEmail, ResaleID, FavoritesTBVendor_ID, TotalOrderCount, TotalOrderAmount, TotalLoginCount, DateTimeRegistered, DateTimeLastLogin, DateTimeLastUpdated, PenaltyAmount, CommentByCustomer, IsOfflineCustomer, IsCODCustomer, Approved, CTPermitImg1, CTPermitImg2, CTInvoiceImg1, CTInvoiceImg2, AFConfirm, PreviewOTP, TAdd, TUpdate, IsVendor, Confirm1st, Confirm2st, Confirm3st, RetailerOrNo, SendTheEmailToConfirm, EmailDate, RegisterIP, OnisCustomer, CustomerPaymentProfileID, CustomerShippingAddressProfileID, LocationFromIP, nOSStaff, TBSecretQuestion_ID, CTResaleID1_US, CTImg1_US, CTCompanyName1_INT, CTCompanyName2_INT, CTCompanyName3_INT, CTPhone1_INT, CTPhone2_INT, CTPhone3_INT, CTImg1_INT, CTImg2_INT, CTImg3_INT, CTType, CTNationType, nSSNM, nLandingPage, nSecretQuestionAnswer, AuthPassword, AuthPasswordOnDate, ChangedPasswordOnDate, Vegas2011, sFreeShipping, isUseMyShippingAccount, nMyShippingAcount, isUseMyShippingAccount1, nMyShippingAccount, isAvailableEmail, IsEmailVerified, nHidden, LastLoginIP, is_migrated_user, ReceivePush, CODEmail, CODRequestedDate, CODCapitalMinAmount, MaxOrderAmount, AvgOrderAmount, VoidOrderCount, BigBuyerStaff, BigBuyerLevel, BigBuyerManager, InactiveReason, isPaused, isEncrypted, NewMyPickCount, PreviousPasswords, CustomerStripeID
FROM ARAOS.dbo.TBCustomer;
  `;
};

export const tbSyleNoById = (id: string): string => {
  return `SELECT TBItem_ID, TBVendorOwnCategory_ID, TBStyleNoCategory1_ID, TBStyleNoCategory2_ID, TBVendorCollection_ID, TBVendor_ID, TBRealVendor_ID, nVendorBarItem, nVendorStyleNo, nOurStyleNo, nOurStyleNo2, nItemDescription, TBSizeChart_ID, nReportYesOrNo, TBPackNo_ID, nActive, nVendorActive, nPrepare, nPurchasePrice, nPurchaseDiscountPrice, nMSRP, nPrice1, nPrice2, nPrice3, nOnSale, nSalePrice, nSalePrice1, nSalePrice2, nSalePrice3, nAvgPrice, nFirstPDate, nLastPDate, nFirstSDate, nLastSDate, nFirstPPrice, nLastPPrice, nFirstSalePrice, nLastSalePrice, nAvgCost, nDate, nDISC, nBDiscountYesOrNo, nFirstSalePrice1, nFirstSalePrice2, nFirstSalePrice3, nWeight, nCustomerReadCount, nIsAllPack, nModifyDate, nSoldOutUpdateDate, nSaleDate, nSoldOut, nVendorSalePrice, nHotItem100_1, nHotItem20_1, nHotItem100_2, nHotItem20_2, nHotItem100_3, nHotItem20_3, nHotItem100_4, nHotItem20_4, nHotItem100_2M, nHotItem20_2M, nHotItem100_1Sorting, nHotItem20_1Sorting, nHotItem100_2Sorting, nHotItem20_2Sorting, nHotItem100_3Sorting, nHotItem20_3Sorting, nHotItem100_4Sorting, nHotItem20_4Sorting, nHotItem100_2MSorting, nHotItem20_2MSorting, PictureS1, PictureS2, PictureS3, PictureS4, PictureS5, PictureS6, PictureS7, PictureS8, PictureS9, PictureR1, PictureR2, PictureR3, PictureR4, PictureR5, PictureR6, PictureR7, PictureR8, PictureR9, Picture1, Picture2, Picture3, Picture4, Picture5, Picture6, Picture7, Picture8, Picture9, PColorID1, PColorID2, PColorID3, PColorID4, PColorID5, PColorID6, PColorID7, PColorID8, PColorID9, PictureS1Temp, PictureS2Temp, PictureS3Temp, PictureS4Temp, PictureS5Temp, PictureS6Temp, PictureS7Temp, PictureS8Temp, PictureS9Temp, PictureR1Temp, PictureR2Temp, PictureR3Temp, PictureR4Temp, PictureR5Temp, PictureR6Temp, PictureR7Temp, PictureR8Temp, PictureR9Temp, Picture1Temp, Picture2Temp, Picture3Temp, Picture4Temp, Picture5Temp, Picture6Temp, Picture7Temp, Picture8Temp, Picture9Temp, nMatched, nUpdate, nVendorBestSeller, nVendorBestSellerManual, nABSChoice, nAdd, nSelfAdd, TBStyleNo_OS_Category_Master_ID, TBStyleNo_OS_Category_Sub_ID, TBStyleNo_Category_Master_ID, TBStyleNo_Category_Sub_ID, TBStyleNo_Color_ID, TBStyleNo_PatternDetail_ID, TBStyleNo_Style_ID, TBStyleNo_Department_ID, nSortingNO, onGroupBy_Active, onGroupBy_MaxPack, onGroupBy_ChoosePackQTY, OnisCustomer, PictureZ1, PictureZ2, PictureZ3, PictureZ4, PictureZ5, PictureZ6, PictureZ7, PictureZ8, PictureZ9, PictureZ1Temp, PictureZ2Temp, PictureZ3Temp, PictureZ4Temp, PictureZ5Temp, PictureZ6Temp, PictureZ7Temp, PictureZ8Temp, PictureZ9Temp, PictureFullLocation, PictureV1, PictureV2, PictureV3, PictureV4, PictureV5, PictureV6, PictureV7, PictureV8, PictureV9, PictureV1Temp, PictureV2Temp, PictureV3Temp, PictureV4Temp, PictureV5Temp, PictureV6Temp, PictureV7Temp, PictureV8Temp, PictureV9Temp, PictureELocation, PictureLLocation, PictureVLocation, PictureZLocation, PictureTestR1, GroupBuySeries, nPreOrder, nPreOrderAvailableDate, TBGroupBuyStyleNo_ID, GroupNO_ID, nStyleName, nStyleNameUpdated, TBStyleNo_OS_Collection_ID, SearchField, PageIDX, nHidden, nReStock, nReStockDate, is_brand_only, is_brand_only_active, view_point, cart_point, sales_point, popular_point, WaitCallback, OriginDate, PublishDate, is_broken_pack, min_broken_pack_order_qty, TBStyleNo_OS_Shape_ID, TBStyleNo_OS_Length_ID, TBStyleNo_OS_Sleeve_ID, made_in, is_failed, is_checked
    FROM ARAOS.dbo.TBStyleNo
    WHERE TBItem_ID = '${id}'
  `;
};

export const tbVendorSettingsQuery = (vendorId: string): string => {
  return `SELECT *
  FROM ARAOS.[dbo].[TBBrandSettings]
  WHERE TBVendor_ID ='${vendorId}'
  `;
};

export const tbStyleFirstTenQuery = (): string => {
  return `
  SELECT TOP (10) *
  FROM [ARAOS].[dbo].[TBStyleNo]
  `;
};

export const tbShipsFromQuery = (vendorName: string): string => {
  return `
  select InvMinAmount, id from ARAOS.dbo.TBShipFrom where ShipFrom = '${vendorName}'
  `;
};

export const brandViewQuery = (vendorId: string): string => {
  return `
   select * from dbo.vw_BrandList where TBVendor_ID = '${vendorId}'
  `;
};

export const masterEventQuery = (vendorName?: string): string => {
  return `
  SELECT * from dbo.TBEventPageMaster ${
    vendorName ? `where event_title like '${vendorName}%'` : ''
  }
  `;
};

export const subEventQuery = (masterId?: string): string => {
  return `
  SELECT * from dbo.TBEventPageSubmaster where TBEventPageMaster_ID = '${masterId}'
  `;
};

export const eventProductsQuery = (subEventId?: string): string => {
  return `
  SELECT * from dbo.TBEventItems where TBEventPageSubmaster_ID = '${subEventId}'
  `;
};

export const subEventByIdQuery = (id?: string): string => {
  return `
  SELECT * from dbo.TBEventPageSubmaster where TBEventPageSubmaster_ID = '${id}'
  `;
};

export const masterEventByIdQuery = (id?: string): string => {
  return `
  SELECT * from dbo.TBEventPageMaster where TBEventPageMaster_ID = '${id}'
  `;
};
