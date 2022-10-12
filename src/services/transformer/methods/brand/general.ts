/**
 * transforms and validates categoryMaster responses and existence
 * @value id
 * @value description
 * @value name
 * @value seo_description
 * @value seo_title
 * @params object,  Composite object containing cdc changeData, categoryMaster data
 * @returns transformed object
 */
export const brandTransformer = async (object): Promise<object> => {
  const brandObject = {};
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
  } = object;

  brandObject['id'] = TBVendor_ID.toString();
  brandObject['name'] = VDName.toString();
  brandObject['description'] = VDFrontDescription.toString();
  brandObject['seo_description'] = SEODescription.toString();
  brandObject['seo_title'] = SEOTitle.toString();
  brandObject['email'] = VDEMail.toString();
  brandObject['url'] = VDVendorURL.toString();
  brandObject['minOrder'] = OSminOrderAMT.toString();
  brandObject['storePolicy'] = VDStorePolicy.toString();

  return brandObject;
};
