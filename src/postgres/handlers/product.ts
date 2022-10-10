import { postgresFetchCall } from 'src/utils/postgres/fetch';

import {
  deleteProductIdQuery,
  insertProductIdQuery,
  productIdQuery,
} from '../queries/product';

//                       <fetch>

export const fetchProductId = async (sourceId: string): Promise<string> => {
  return await postgresFetchCall(productIdQuery(sourceId));
};

//                       <insert>

export const insertProductId = async (sourceId: string, destinationId) => {
  // console.log(sourceId); // done
  // console.log(destinationId.productCreate.errors);
  return await postgresFetchCall(insertProductIdQuery(sourceId, destinationId));
};

//                       <delete>

export const deleteProductId = async (destinationId) => {
  // console.log(destinationId.productCreate.errors);
  return await postgresFetchCall(deleteProductIdQuery(destinationId));
};
