import { fetchProductId } from 'src/postgres/handlers/product';
import { productExistingInterface } from 'src/types/poduct';

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
  const response = await fetchProductId(changeData.TBItem_ID);
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
  const productDestinationId: string = response;
  let objectResponse: productExistingInterface = {
    exists: false,
    destinationId: '',
  };
  if (productDestinationId) {
    objectResponse = { exists: true, destinationId: `${productDestinationId}` };
    return objectResponse;
  }
  return objectResponse;
};
