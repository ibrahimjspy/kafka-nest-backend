export const productGeneralTransform = async (productObject) => {
  productNameValidator(productObject);
  productDescriptionTransform(productObject);
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

const productDescriptionTransform = (productObject) => {
  const transformedDescription = `{\"time\": 1662995227870, \"blocks\": [{\"id\": \"cqWmV3MIPH\", \"data\": {\"text\": \"${productObject.description}\"}, \"type\": \"paragraph\"}], \"version\": \"2.24.3\"}`;
  productObject.description = transformedDescription;
};
