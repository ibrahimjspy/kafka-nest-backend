/**
 * transforms and validates productView responses and existence
 * @value description
 * @value style_name
 * @value seo_information
 * @params object,  Composite object containing cdc changeData, productView data
 */
export const productGeneralTransformer = async (object) => {
  productNameValidator(object);
  productDescriptionTransformer(object);
  return object;
};

// validator to check if product name exists in object
const productNameValidator = async (object) => {
  if (object.style_name) {
    return;
  } else {
    object.name = 'test_product';
  }
};

// product description transformed from string format to richText(destination format)
const productDescriptionTransformer = (object) => {
  let transformedDescription = {};
  if (object.description) {
    transformedDescription = `{\"time\": 1662995227870, \"blocks\": [{\"id\": \"cqWmV3MIPH\", \"data\": {\"text\": \"${object.description}\"}, \"type\": \"paragraph\"}], \"version\": \"2.24.3\"}`;
  } else {
    transformedDescription = `{\"time\": 1662995227870, \"blocks\": [{\"id\": \"cqWmV3MIPH\", \"data\": {\"text\": \"test product}\"}, \"type\": \"paragraph\"}], \"version\": \"2.24.3\"}`;
  }
  object.description = transformedDescription;
};
