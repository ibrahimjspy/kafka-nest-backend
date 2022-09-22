import { metadataCheckQuery } from 'src/graphql/queries/metadataCheck';
import { graphqlCall } from 'src/utils/graphqlHandler';

export const productCheckHandler = async (productUpdateData) => {
  let productIdResponseCheck = { exists: false, saleorId: '' };
  const response = await graphqlCall(
    metadataCheckQuery(productUpdateData.TBItem_ID),
  );
  productIdResponseCheck = productIdResponseCheckValidation(response);
  return productIdResponseCheck;
};

export const productIdResponseCheckValidation = (response) => {
  const productSaleorId = response.data.products.edges[0].node.id;
  let objectResponse = { exists: false, saleorId: '' };
  if (productSaleorId) {
    objectResponse = { exists: true, saleorId: `${productSaleorId}` };
    return objectResponse;
  }
  return objectResponse;
};
