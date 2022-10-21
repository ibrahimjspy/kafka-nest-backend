import { postgresDeleteCall } from 'src/utils/postgres/delete';
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
  return await postgresFetchCall(
    insertProductIdQuery(sourceId, destinationId.productCreate.product.id),
  );
};

//                       <delete>

export const deleteProductId = async (destinationId) => {
  return await postgresDeleteCall(deleteProductIdQuery(destinationId));
};
