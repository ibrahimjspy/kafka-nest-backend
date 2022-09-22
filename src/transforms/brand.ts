export const brandGeneralTransform = async (productObject) => {
  brandNameValidator(productObject);
  return productObject;
};
// validator to check if product name exists in object
const brandNameValidator = async (productObject) => {
  if (productObject.name) {
    return;
  }
  if (productObject.web_name) {
    productObject.name = productObject.web_name;
  }
  if (productObject.contact.name) {
    productObject.name = productObject.contact.name;
  } else {
    productObject.name = 'test_shop';
  }
};
