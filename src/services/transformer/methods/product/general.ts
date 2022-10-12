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
): Promise<productTransformed> => {
  const productObject: productTransformed = {};
  const { TBItem_ID, nStyleName, nItemDescription } = object;

  productObject['id'] = TBItem_ID.toString();
  productObject['name'] = await productNameValidator(nStyleName).toString();
  productObject['description'] = await descriptionTransformer(nItemDescription);

  return productObject;
};

// validator to check if product name exists in object
const productNameValidator = async (productName: string): Promise<string> => {
  if (productName) {
    return productName;
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
  return `{\"time\": 1662995227870, \"blocks\": [{\"id\": \"cqWmV3MIPH\", \"data\": {\"text\": \"test product\"}, \"type\": \"paragraph\"}], \"version\": \"2.24.3\"}`;
};
