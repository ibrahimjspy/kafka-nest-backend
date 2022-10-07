/**
 * transforms and validates seo information from brand or product information
 * @value seoTitle
 * @value seoDescription
 * @params productObject,  Composite productObject containing cdc changeData, productView data
 */
export const seoTransformer = async (productObject): Promise<object> => {
  const fallbackString = '';
  const seoTitle = productObject.brand.information.seo_title || fallbackString;
  const seoDescription =
    productObject.brand.information.seo_description || fallbackString;
  productObject.seoTitle = seoTitle;
  productObject.seoDescription = seoDescription;
  return productObject;
};
