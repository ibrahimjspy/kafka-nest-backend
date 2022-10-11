import { productCDC, productTransformed } from 'src/types/Product';

/**
 * transforms and validates productView responses and existence
 * @value id
 * @value description
 * @value name
 * @params object,  Composite object containing cdc changeData, productView data
 */
export const productGeneralTransformer = async (
  object: productCDC,
): Promise<object> => {
  const productObject: productTransformed = {};

  productObject['id'] = object.TBItem_ID;
  productObject['name'] = await productNameValidator(object);
  productObject['description'] = await descriptionTransformer(
    object.nItemDescription,
  );

  return productObject;
};

// validator to check if product name exists in object
const productNameValidator = async (object: productCDC): Promise<string> => {
  if (object.nStyleName) {
    return object.nStyleName;
  }
  return 'test_product';
};

/**
 * description transformed from string format to richText(destination format)
 * @params string to be transformed
 */
export const descriptionTransformer = (string) => {
  if (string) {
    return `{\"time\": 1662995227870, \"blocks\": [{\"id\": \"cqWmV3MIPH\", \"data\": {\"text\": \"${string}\"}, \"type\": \"paragraph\"}], \"version\": \"2.24.3\"}`;
  }
  return `{\"time\": 1662995227870, \"blocks\": [{\"id\": \"cqWmV3MIPH\", \"data\": {\"text\": \"test product}\"}, \"type\": \"paragraph\"}], \"version\": \"2.24.3\"}`;
};
