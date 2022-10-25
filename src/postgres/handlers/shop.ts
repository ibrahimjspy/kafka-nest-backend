//                       <fetch>

import { postgresDeleteCall } from 'src/utils/postgres/delete';
import { postgresFetchIdCall } from 'src/utils/postgres/fetch';
import { postgresInsertCall } from 'src/utils/postgres/insert';
import {
  deleteShopIdQuery,
  insertShopIdQuery,
  shopIdQuery,
} from '../queries/shop';

export const fetchShopId = async (sourceId: string): Promise<string> => {
  return await postgresFetchIdCall(shopIdQuery(sourceId));
};

//                       <insert>

export const insertShopId = async (sourceId: string, destinationId) => {
  return await postgresInsertCall(insertShopIdQuery(sourceId, destinationId));
};

//                       <delete>

export const deleteShopId = async (destinationId) => {
  return await postgresDeleteCall(deleteShopIdQuery(destinationId));
};
