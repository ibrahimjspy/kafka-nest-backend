/**
 * transforms and validates productView responses and existence
 * @value description
 * @value style_name
 * @value seo_information
 * @params productObject,  Composite productObject containing cdc changeData, productView data
 */
export const productGeneralTransformer = async (productObject) => {
  productNameValidator(productObject);
  productDescriptionTransformer(productObject);
  return productObject;
};

// validator to check if product name exists in object
const productNameValidator = async (productObject) => {
  if (productObject.style_name) {
    return;
  } else {
    productObject.name = 'test_product';
  }
};

// product description transformed from string format to richText(destination format)
const productDescriptionTransformer = (productObject) => {
  const transformedDescription = `{\"time\": 1662995227870, \"blocks\": [{\"id\": \"cqWmV3MIPH\", \"data\": {\"text\": \"${productObject.description}\"}, \"type\": \"paragraph\"}], \"version\": \"2.24.3\"}`;
  productObject.description = transformedDescription;
};
