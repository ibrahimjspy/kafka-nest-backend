import { metadataCheckQuery } from 'src/graphql/queries/metadataCheck';
import { productExistingInterface } from 'src/types/Product';
import { graphqlCall } from 'src/utils/graphqlHandler';

/**
 * This function checks whether given source product ID exists against Destination if so
 * it returns Destination id stored in metadata of its object
 * @params cdc debezium payload
 */
export const productExistenceCheckHandler = async (changeData) => {
  let productIdResponse: productExistingInterface = {
    exists: false,
    destinationId: '',
  };
  // Queries Destination to check product existence in its ecosystem
  const response = await graphqlCall(metadataCheckQuery(changeData.TBItem_ID));
  // Parses and validates the response and returns an object containing required information of product existence
  response
    ? (productIdResponse = productIdResponseCheckValidation(response))
    : '';
  return productIdResponse;
};

/**
 * returns whether cdc change is update, delete or create
 * @params cdc debezium response parsed
 */
export const productIdResponseCheckValidation = (response) => {
  const productdestinationId: string =
    response.data?.products?.edges[0].node.id;
  let objectResponse: productExistingInterface = {
    exists: false,
    destinationId: '',
  };
  if (productdestinationId) {
    objectResponse = { exists: true, destinationId: `${productdestinationId}` };
    return objectResponse;
  }
  return objectResponse;
};
