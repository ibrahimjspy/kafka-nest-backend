export const productGeneralTransform = async (productObject) => {
  productNameValidator(productObject);
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
