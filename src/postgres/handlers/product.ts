import { postgresDeleteCall } from 'src/utils/postgres/delete';
import { postgresFetchIdCall } from 'src/utils/postgres/fetch';

import {
  deleteProductIdQuery,
  insertProductIdQuery,
  productIdQuery,
  productSerialIdQuery,
} from '../queries/product';

//                       <fetch>

export const fetchProductId = async (sourceId: string): Promise<string> => {
  return await postgresFetchIdCall(productIdQuery(sourceId));
};

export const fetchProductSerialIdBySlug = async (
  slug: string,
): Promise<string> => {
  return await postgresFetchIdCall(productSerialIdQuery(slug));
};

//                       <insert>

export const insertProductId = async (sourceId: string, destinationId) => {
  return await postgresFetchIdCall(
    insertProductIdQuery(sourceId, destinationId),
  );
};

//                       <delete>

export const deleteProductId = async (sourceId) => {
  return await postgresDeleteCall(deleteProductIdQuery(sourceId));
};
