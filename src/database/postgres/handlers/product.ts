import { postgresDeleteCall } from 'src/database/postgres/call/delete';
import {
  postgresFetchIdCall,
  postgresFetchMediaIdCall,
} from 'src/database/postgres/call/fetch';

import {
  deleteProductIdByDestinationIdQuery,
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
  return await postgresFetchMediaIdCall(productSerialIdQuery(slug));
};

//                       <insert>

export const insertProductId = async (sourceId: string, destinationId) => {
  if (destinationId) {
    return await postgresFetchIdCall(
      insertProductIdQuery(sourceId, destinationId),
    );
  }
};

//                       <delete>

export const deleteProductId = async (sourceId) => {
  return await postgresDeleteCall(deleteProductIdQuery(sourceId));
};

export const deleteProductIdByDestinationId = async (destinationId) => {
  return await postgresDeleteCall(
    deleteProductIdByDestinationIdQuery(destinationId),
  );
};
