//                       <fetch>

import { postgresDeleteCall } from 'src/utils/postgres/delete';
import { postgresFetchCall } from 'src/utils/postgres/fetch';
import { postgresInsertCall } from 'src/utils/postgres/insert';
import {
  deleteShopIdQuery,
  insertShopIdQuery,
  shopIdQuery,
} from '../queries/shop';

export const fetchShopId = async (sourceId: string): Promise<string> => {
  return await postgresFetchCall(shopIdQuery(sourceId));
};

//                       <insert>

export const insertShopId = async (sourceId: string, destinationId) => {
  console.log(sourceId); // done
  console.log(destinationId, ' in shop service');
  // console.log(destinationId.ShopCreate.errors);
  return await postgresInsertCall(insertShopIdQuery(sourceId, destinationId));
};

//                       <delete>

export const deleteShopId = async (destinationId) => {
  // console.log(destinationId.ShopCreate.errors);
  return await postgresDeleteCall(deleteShopIdQuery(destinationId));
};
