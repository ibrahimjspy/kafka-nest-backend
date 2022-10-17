import { shopTransformed } from 'src/types/shop';

/**
 * transforms and validates shop responses and existence
 * @value id
 * @value description
 * @value name
 * @value seo_description
 * @value seo_title
 * @params object,  Composite object containing cdc changeData, categoryMaster data
 * @returns transformed object
 */
export const shopTransformerMethod = async (object): Promise<object> => {
  const shopObject: shopTransformed = {};
  const {
    TBVendor_ID,
    VDEMail,
    VDFrontDescription,
    VDVendorURL,
    OSminOrderAMT,
    VDStorePolicy,
    SEOTitle,
    SEODescription,
    VDName,
    VDMadeIn,
    VDReturnPolicy,
  } = object;

  shopObject['id'] = TBVendor_ID?.toString();
  shopObject['name'] = VDName?.toString();
  shopObject['description'] = VDFrontDescription?.toString();
  shopObject['seo_description'] = SEODescription?.toString();
  shopObject['seo_title'] = SEOTitle?.toString();
  shopObject['email'] = VDEMail?.toString();
  shopObject['url'] = VDVendorURL?.toString();
  shopObject['minOrder'] = OSminOrderAMT?.toString();
  shopObject['storePolicy'] = VDStorePolicy?.toString();
  shopObject['madeIn'] = VDMadeIn?.toString();
  shopObject['returnPolicy'] = VDReturnPolicy?.toString();

  return shopObject;
};
